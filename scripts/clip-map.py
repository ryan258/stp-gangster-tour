"""Rebuild the small map layer from retained USGS data; no network access.

The recorded NHD extract contains one Polygon (outer ring and holes).
Changing either its source or the derived bytes invalidates the map review.
"""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BOUNDS = {"west": -93.102, "east": -93.082, "south": 44.934, "north": 44.947}


def clip(points, axis, bound, greater):
    """Sutherland–Hodgman clipping against one rectangle edge."""
    if not points:
        return []
    inside = lambda point: point[axis] >= bound if greater else point[axis] <= bound
    result, previous = [], points[-1]
    for point in points:
        if inside(point) != inside(previous):
            ratio = (bound - previous[axis]) / (point[axis] - previous[axis])
            cut = [previous[i] + ratio * (point[i] - previous[i]) for i in (0, 1)]
            cut[axis] = bound
            result.append(cut)
        if inside(point):
            result.append(point)
        previous = point
    return result


def main():
    metadata_path = ROOT / "src/data/geography.json"
    metadata = json.loads(metadata_path.read_text())
    raw = (ROOT / "production/geography/usgs-nhd-area.geojson").read_bytes()
    features = json.loads(raw)["features"]
    if len(features) != 1 or features[0]["geometry"]["type"] != "Polygon":
        raise ValueError("Expected the recorded single USGS polygon; review a changed extract first")
    rings = []
    for ring in features[0]["geometry"]["coordinates"]:
        points = ring[:-1] if ring[0] == ring[-1] else ring
        for axis, bound, greater in (
            (0, BOUNDS["west"], True), (0, BOUNDS["east"], False),
            (1, BOUNDS["south"], True), (1, BOUNDS["north"], False),
        ):
            points = clip(points, axis, bound, greater)
        result = []
        for point in points:
            rounded = [round(value, 6) for value in point]
            if not result or result[-1] != rounded:
                result.append(rounded)
        if len(result) >= 3:
            if result[-1] != result[0]:
                result.append(result[0])
            rings.append(result)
    if not rings:
        raise ValueError("No river geometry intersects the map")
    derived = (json.dumps({"bounds": BOUNDS, "rings": rings}, separators=(",", ":")) + "\n").encode()
    source_digest = hashlib.sha256(raw).hexdigest()
    base_digest = hashlib.sha256(derived).hexdigest()
    if (source_digest, base_digest) != (metadata["sourceDigest"], metadata["baseDigest"]):
        metadata.update(status="pending", reviewer=None, reviewDate=None)
    metadata.update(sourceDigest=source_digest, baseDigest=base_digest)
    (ROOT / "src/data/map-river.json").write_bytes(derived)
    metadata_path.write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + "\n")
    print(f"Rebuilt {len(rings)} rings, {sum(map(len, rings))} vertices; review {metadata['status']}")


if __name__ == "__main__":
    main()
