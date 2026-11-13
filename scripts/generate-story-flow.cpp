// Build the offline displacement maps from the nine-cell WebP sprite sheets.
// From the repository root:
//   c++ -std=c++17 -O3 scripts/generate-story-flow.cpp -o /tmp/stp-story-flow
//   scene=the-deal-breaks
//   magick "public/images/redesign/story-layer-${scene}-smooth.webp" -crop 3x3@ +repage -resize '256x256!' -depth 8 RGBA:/tmp/stp-poses.rgba
//   /tmp/stp-story-flow "$scene" /tmp/stp-poses.rgba "public/images/redesign/story-flow-${scene}.bin"
//
// File layout: width, height, pair count, and version as four unsigned bytes.
// Each pair is top-to-bottom, left-to-right. Four bytes per grid point hold
// forward X/Y and backward X/Y, measured in 1/256 of a sprite cell with 128 as zero.

#include <algorithm>
#include <array>
#include <cmath>
#include <cstdint>
#include <fstream>
#include <iostream>
#include <stdexcept>
#include <string>
#include <vector>

constexpr int sourceSize = 256;
constexpr int gridSize = 40;
constexpr int poseCount = 9;

struct Color {
    float alpha, luma, color;
};

struct Image {
    int size;
    std::vector<Color> values;

    const Color& at(int x, int y) const {
        static const Color transparent{};
        if (x < 0 || x >= size || y < 0 || y >= size) return transparent;
        return values[y * size + x];
    }

    Image halve() const {
        Image down{size / 2, std::vector<Color>(values.size() / 4)};
        for (int y = 0; y < down.size; ++y) {
            for (int x = 0; x < down.size; ++x) {
                const auto& a = at(x * 2, y * 2);
                const auto& b = at(x * 2 + 1, y * 2);
                const auto& c = at(x * 2, y * 2 + 1);
                const auto& d = at(x * 2 + 1, y * 2 + 1);
                down.values[y * down.size + x] = {
                    (a.alpha + b.alpha + c.alpha + d.alpha) / 4,
                    (a.luma + b.luma + c.luma + d.luma) / 4,
                    (a.color + b.color + c.color + d.color) / 4
                };
            }
        }
        return down;
    }
};

struct Vector {
    float x, y, confidence;
};

struct Field {
    int size;
    std::vector<Vector> values;

    Vector at(int x, int y) const {
        return values[std::clamp(y, 0, size - 1) * size + std::clamp(x, 0, size - 1)];
    }

    Vector interpolate(float u, float v) const {
        const float x = u * (size - 1), y = v * (size - 1);
        const int i = int(x), j = int(y);
        const float h = x - i, k = y - j;
        const auto a = at(i, j), b = at(i + 1, j), c = at(i, j + 1), d = at(i + 1, j + 1);
        return {
            ((1 - h) * a.x + h * b.x) * (1 - k) + ((1 - h) * c.x + h * d.x) * k,
            ((1 - h) * a.y + h * b.y) * (1 - k) + ((1 - h) * c.y + h * d.y) * k,
            ((1 - h) * a.confidence + h * b.confidence) * (1 - k)
                + ((1 - h) * c.confidence + h * d.confidence) * k
        };
    }
};

Image load(std::ifstream& input) {
    std::vector<unsigned char> bytes(sourceSize * sourceSize * 4);
    if (!input.read(reinterpret_cast<char*>(bytes.data()), bytes.size())) throw std::runtime_error("truncated input");
    Image frame{sourceSize, std::vector<Color>(sourceSize * sourceSize)};
    for (std::size_t i = 0; i < frame.values.size(); ++i) {
        const float alpha = bytes[i * 4 + 3] / 255.0f;
        const float red = bytes[i * 4] / 255.0f;
        const float green = bytes[i * 4 + 1] / 255.0f;
        const float blue = bytes[i * 4 + 2] / 255.0f;
        frame.values[i] = {
            alpha,
            (0.2126f * red + 0.7152f * green + 0.0722f * blue) * alpha,
            (red - blue) * alpha
        };
    }
    return frame;
}

// Fill the immediate transparent area from confident neighbors. This gives
// silhouette pixels room to travel beyond the starting pose's visible bounds.
void extend(Field& field, int iterations, float maxChange) {
    for (int pass = 0; pass < iterations; ++pass) {
        auto output = field.values;
        for (int y = 0; y < field.size; ++y) {
            for (int x = 0; x < field.size; ++x) {
                const auto here = field.at(x, y);
                Vector sum{};
                float weight = 0;
                for (int dy = -1; dy <= 1; ++dy) {
                    for (int dx = -1; dx <= 1; ++dx) {
                        const auto other = field.at(x + dx, y + dy);
                        if (other.confidence <= 0) continue;
                        const float distance = std::abs(here.x - other.x) + std::abs(here.y - other.y);
                        const float agreement = here.confidence > 0 ? 1.0f / (1.0f + distance / maxChange) : 1;
                        const float factor = agreement * other.confidence * (dx == 0 && dy == 0 ? 3 : 1);
                        sum.x += factor * other.x;
                        sum.y += factor * other.y;
                        sum.confidence = std::max(sum.confidence, other.confidence);
                        weight += factor;
                    }
                }
                if (weight > 0) {
                    output[y * field.size + x] = {
                        sum.x / weight, sum.y / weight,
                        std::max(here.confidence, sum.confidence * 0.6f)
                    };
                }
            }
        }
        field.values.swap(output);
    }
}

Field match(const Image& from, const Image& to, const Field& prior, int grid, int stride, int radius) {
    Field result{grid, std::vector<Vector>(grid * grid)};
    const float priorScale = prior.size == 1 ? 0 : 2;
    constexpr int patchRadius = 2;
    constexpr int patchWidth = patchRadius * 2 + 1;
    for (int i = 0; i < grid * grid; ++i) {
        const float u = float(i % grid) / (grid - 1), v = float(i / grid) / (grid - 1);
        const int x = int(std::round(u * (from.size - 1))), y = int(std::round(v * (from.size - 1)));
        std::array<Color, patchWidth * patchWidth> patch{};
        float alpha = 0;
        int cursor = 0;
        for (int cy = -patchRadius; cy <= patchRadius; ++cy) {
            for (int cx = -patchRadius; cx <= patchRadius; ++cx) {
                const auto a = from.at(x + cx * stride, y + cy * stride);
                patch[cursor++] = a;
                alpha += a.alpha;
            }
        }
        if (alpha < 0.35f) continue;
        const auto estimate = prior.interpolate(u, v);
        const int initialX = std::lround(estimate.x * priorScale);
        const int initialY = std::lround(estimate.y * priorScale);
        auto cost = [&](int dx, int dy) {
            // Favor stable artwork when a patch has multiple equally good matches.
            const float regularization = priorScale == 0 ? 0.032f : 0.017f;
            float score = regularization * (std::abs(dx - initialX) + std::abs(dy - initialY))
                + 0.004f * (std::abs(dx) + std::abs(dy));
            int sample = 0;
            for (int cy = -patchRadius; cy <= patchRadius; ++cy) {
                for (int cx = -patchRadius; cx <= patchRadius; ++cx) {
                    const auto a = patch[sample++];
                    const auto b = to.at(x + dx + cx * stride, y + dy + cy * stride);
                    const float alphaDifference = std::abs(a.alpha - b.alpha);
                    const float lumaDifference = std::abs(a.luma - b.luma);
                    const float colorDifference = std::abs(a.color - b.color);
                    score += std::min(0.85f, 0.60f * alphaDifference + lumaDifference + 0.30f * colorDifference);
                }
            }
            return score;
        };
        int bestX = initialX, bestY = initialY;
        float best = cost(bestX, bestY);
        const float staticCost = cost(0, 0);
        if (staticCost <= best) {
            best = staticCost;
            bestX = bestY = 0;
        }
        if (best > 0.003f) {
            for (int dy = initialY - radius; dy <= initialY + radius; ++dy) {
                for (int dx = initialX - radius; dx <= initialX + radius; ++dx) {
                    const float score = cost(dx, dy);
                    if (score < best) {
                        best = score;
                        bestX = dx;
                        bestY = dy;
                    }
                }
            }
        }
        const float gain = std::max(0.0f, (staticCost - best) / (staticCost + 0.4f));
        const float confidence = std::min(1.0f, alpha / 10) / (1 + best / (alpha * 0.2f + 0.4f));
        const float motion = std::clamp(gain * 2.0f + 0.25f, 0.0f, 1.0f);
        result.values[i] = {float(bestX) * motion, float(bestY) * motion, confidence};
    }
    return result;
}

float ramp(float from, float to, float value) {
    const float t = std::clamp((value - from) / (to - from), 0.0f, 1.0f);
    return t * t * (3 - 2 * t);
}

Field track(const std::array<Image, 3>& from, const std::array<Image, 3>& to, const std::string& scene) {
    if (scene == "the-price-of-protection") {
        // The print darkens in place. An appearance change supplies the motion.
        return {gridSize, std::vector<Vector>(gridSize * gridSize)};
    }
    Field start{1, {{0, 0, 0}}};
    Field coarse = match(from[0], to[0], start, 20, 2, 13);
    extend(coarse, 2, 2.0f);
    Field medium = match(from[1], to[1], coarse, 30, 3, 5);
    extend(medium, 2, 4.0f);
    Field fine = match(from[2], to[2], medium, gridSize, 3, 5);
    extend(fine, 3, 6.0f);
    for (int y = 0; y < gridSize; ++y) {
        for (int x = 0; x < gridSize; ++x) {
            auto& v = fine.values[y * gridSize + x];
            const float u = float(x) / (gridSize - 1);
            const float t = float(y) / (gridSize - 1);
            float amount = 1;
            if (scene == "the-safe-house-fails") {
                // The casing and floor are landmarks shared by all door poses.
                amount = ramp(0.303f, 0.348f, u) * (1 - ramp(0.677f, 0.709f, u))
                    * ramp(0.123f, 0.177f, t) * (1 - ramp(0.847f, 0.907f, t));
            } else if (scene == "the-deal-breaks") {
                // Hold the pedestal while leaving the lifted handset free.
                const float pedestal = ramp(0.69f, 0.80f, t) * ramp(0.36f, 0.47f, u);
                amount = 1 - pedestal;
            }
            v.x *= amount;
            v.y *= amount;
        }
    }
    return fine;
}

std::uint8_t quantize(float value) {
    return std::uint8_t(std::clamp(128 + int(std::lround(value * 256 / (sourceSize - 1))), 0, 255));
}

int main(int argc, char** argv) {
    if (argc != 4) {
        std::cerr << "usage: match scene-id input-poses.rgba output.bin\n";
        return 2;
    }
    try {
        std::ifstream input(argv[2], std::ios::binary);
        std::vector<std::array<Image, 3>> frames;
        for (int i = 0; i < poseCount; ++i) {
            Image full = load(input), medium = full.halve(), coarse = medium.halve();
            frames.push_back({std::move(coarse), std::move(medium), std::move(full)});
        }
        if (input.peek() != std::char_traits<char>::eof()) throw std::runtime_error("excess input");
        std::vector<std::uint8_t> bytes = {gridSize, gridSize, poseCount - 1, 1};
        for (int i = 0; i < poseCount - 1; ++i) {
            const auto forward = track(frames[i], frames[i + 1], argv[1]);
            const auto backward = track(frames[i + 1], frames[i], argv[1]);
            for (int sample = 0; sample < gridSize * gridSize; ++sample) {
                const auto f = forward.values[sample], b = backward.values[sample];
                bytes.insert(bytes.end(), {quantize(f.x), quantize(f.y), quantize(b.x), quantize(b.y)});
            }
        }
        std::ofstream output(argv[3], std::ios::binary);
        output.write(reinterpret_cast<const char*>(bytes.data()), bytes.size());
        if (!output) throw std::runtime_error("could not write output");
    } catch (const std::exception& error) {
        std::cerr << error.what() << '\n';
        return 1;
    }
}
