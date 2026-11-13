const vertexSource = `
attribute vec2 position;
varying vec2 pixel;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
  pixel = vec2(position.x + 1.0, 1.0 - position.y) * 0.5;
}
`;

const fragmentSource = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform sampler2D atlas;
uniform sampler2D field;
uniform vec2 atlasGrid;
uniform vec2 fieldGrid;
uniform float pairCount;
uniform float pose;
uniform float fraction;
varying vec2 pixel;

vec4 flowAt(vec2 uv) {
  vec2 texel = clamp(uv, 0.0, 1.0) * (fieldGrid - 1.0) + 0.5;
  texel.y += pose * fieldGrid.y;
  return (texture2D(field, texel / (fieldGrid * vec2(1.0, pairCount))) * 255.0 - 128.0) / 256.0;
}

vec4 poseAt(float index, vec2 uv) {
  if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) return vec4(0.0);
  vec2 cell = vec2(mod(index, atlasGrid.x), floor(index / atlasGrid.x));
  // The 640px fallback atlas has ~213px cells. Inset half a texel so bilinear filtering never crosses a cell border.
  return texture2D(atlas, (cell + clamp(uv, 0.0025, 0.9975)) / atlasGrid);
}

void main() {
  vec4 motion = flowAt(pixel);
  vec2 first = pixel - fraction * motion.xy;
  vec2 second = pixel - (1.0 - fraction) * motion.zw;

  // The vector is defined at the source pixel. Refine each inverse sample using the vector at its current estimate.
  first = mix(first, pixel - fraction * flowAt(first).xy, 0.7);
  second = mix(second, pixel - (1.0 - fraction) * flowAt(second).zw, 0.7);

  // Both poses are premultiplied on upload, preserving the transparent outline while they blend.
  gl_FragColor = mix(poseAt(pose, first), poseAt(pose + 1.0, second), fraction);
}
`;

interface MotionField {
  width: number;
  height: number;
  pairs: number;
  pixels: Uint8Array;
}

interface Scene {
  image: HTMLImageElement;
  columns: number;
  rows: number;
  frames: number;
  progress?: number;
  field?: MotionField;
  surface?: HTMLCanvasElement;
  renderedSource?: string;
  renderedProgress?: number;
}

const scenes = new WeakMap<HTMLElement, Scene>();
const activeRoots = new Set<HTMLElement>();
const fields = new Map<string, Promise<MotionField | undefined>>();

function loadField(path: string) {
  const cached = fields.get(path);
  if (cached) return cached;

  const field = (async () => {
    try {
      const url = new URL(path, document.baseURI);
      if (url.origin !== location.origin) return undefined;
      const response = await fetch(url, {credentials: 'same-origin', redirect: 'error'});
      if (!response.ok) return undefined;
      const bytes = new Uint8Array(await response.arrayBuffer());
      const [width, height, pairs, version] = bytes;
      if (version !== 1 || width < 2 || width > 128 || height < 2 || height > 128
        || pairs < 1 || pairs > 32 || bytes.length !== 4 + width * height * pairs * 4) return undefined;
      return {width, height, pairs, pixels: bytes.subarray(4)};
    } catch {
      return undefined;
    }
  })();
  fields.set(path, field);
  return field;
}

function makeShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

function bindTexture<Key>(
  gl: WebGLRenderingContext, unit: number, cache: Map<Key, WebGLTexture>,
  key: Key, premultiply: boolean, upload: () => void,
) {
  gl.activeTexture(unit);
  const cached = cache.get(key);
  if (cached) {
    cache.delete(key);
    cache.set(key, cached);
    gl.bindTexture(gl.TEXTURE_2D, cached);
    return true;
  }

  const texture = gl.createTexture();
  if (!texture) return false;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiply);
  try {
    upload();
    if (gl.getError() !== gl.NO_ERROR) {
      gl.deleteTexture(texture);
      return false;
    }
  } catch {
    gl.deleteTexture(texture);
    return false;
  }
  cache.set(key, texture);
  if (cache.size > 3) {
    const oldest = cache.keys().next().value as Key;
    gl.deleteTexture(cache.get(oldest) ?? null);
    cache.delete(oldest);
  }
  return true;
}

function makeRenderer(surface: HTMLCanvasElement) {
  const gl = surface.getContext('webgl', {
    alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false,
  });
  if (!gl || gl.isContextLost()) return null;

  const vertex = makeShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = makeShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) {
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    gl.deleteProgram(program);
    return null;
  }
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  const buffer = gl.createBuffer();
  const attribute = gl.getAttribLocation(program, 'position');
  if (!buffer || attribute < 0) {
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    return null;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attribute);
  gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
  gl.useProgram(program);
  gl.uniform1i(gl.getUniformLocation(program, 'atlas'), 0);
  gl.uniform1i(gl.getUniformLocation(program, 'field'), 1);
  const atlasGrid = gl.getUniformLocation(program, 'atlasGrid');
  const fieldGrid = gl.getUniformLocation(program, 'fieldGrid');
  const pairCount = gl.getUniformLocation(program, 'pairCount');
  const pose = gl.getUniformLocation(program, 'pose');
  const fraction = gl.getUniformLocation(program, 'fraction');
  const atlases = new Map<string, WebGLTexture>();
  const motion = new Map<MotionField, WebGLTexture>();

  return (scene: Scene, field: MotionField, source: string, progress: number) => {
    if (gl.isContextLost()) return false;
    const cellWidth = scene.image.naturalWidth / scene.columns;
    const cellHeight = scene.image.naturalHeight / scene.rows;
    const scale = Math.min(1, 512 / Math.max(cellWidth, cellHeight));
    const width = Math.max(1, Math.round(cellWidth * scale));
    const height = Math.max(1, Math.round(cellHeight * scale));
    if (surface.width !== width) surface.width = width;
    if (surface.height !== height) surface.height = height;

    if (!bindTexture(gl, gl.TEXTURE0, atlases, source, true, () => {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, scene.image);
    }) || !bindTexture(gl, gl.TEXTURE1, motion, field, false, () => {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, field.width, field.height * field.pairs, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, field.pixels);
    })) return false;

    const step = progress * (scene.frames - 1);
    const start = Math.min(field.pairs - 1, Math.floor(step));
    gl.uniform2f(atlasGrid, scene.columns, scene.rows);
    gl.uniform2f(fieldGrid, field.width, field.height);
    gl.uniform1f(pairCount, field.pairs);
    gl.uniform1f(pose, start);
    gl.uniform1f(fraction, step - start);
    gl.viewport(0, 0, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    const target = scene.surface;
    if (!target || gl.isContextLost()) return false;
    if (target.width !== width) target.width = width;
    if (target.height !== height) target.height = height;
    const context = target.getContext('2d');
    if (!context) return false;
    context.globalCompositeOperation = 'copy';
    context.drawImage(surface, 0, 0);
    return true;
  };
}

let renderSurface: HTMLCanvasElement | undefined;
let renderer: ReturnType<typeof makeRenderer> | undefined;

function getRenderer() {
  if (renderer !== undefined) return renderer;
  if (!renderSurface) {
    renderSurface = document.createElement('canvas');
    renderSurface.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      renderer = null;
      for (const root of activeRoots) {
        delete root.dataset.visualInterpolated;
        const scene = scenes.get(root);
        if (scene) scene.renderedProgress = undefined;
      }
    });
    renderSurface.addEventListener('webglcontextrestored', () => {
      renderer = undefined;
      for (const root of activeRoots) {
        const scene = scenes.get(root);
        if (scene) paint(root, scene);
      }
    });
  }
  try {
    renderer = makeRenderer(renderSurface);
  } catch {
    renderer = null;
  }
  return renderer;
}

function paint(root: HTMLElement, scene: Scene) {
  const {field, image, progress} = scene;
  if (!root.isConnected || document.hidden || progress === undefined || !field
    || !image.complete || !image.naturalWidth || field.pairs !== scene.frames - 1) {
    delete root.dataset.visualInterpolated;
    return;
  }
  const draw = getRenderer();
  if (!draw) return;

  const source = image.currentSrc || image.src;
  if (!scene.surface) {
    const sprite = root.querySelector('[data-visual-sprite]');
    if (!sprite) return;
    scene.surface = document.createElement('canvas');
    scene.surface.dataset.visualInterpolationSurface = '';
    scene.surface.setAttribute('aria-hidden', 'true');
    sprite.append(scene.surface);
  }

  try {
    if (progress !== scene.renderedProgress || source !== scene.renderedSource) {
      if (!draw(scene, field, source, progress)) {
        delete root.dataset.visualInterpolated;
        return;
      }
      scene.renderedSource = source;
      scene.renderedProgress = progress;
    }
    root.dataset.visualInterpolated = '';
  } catch {
    delete root.dataset.visualInterpolated;
  }
}

/** Use a shared offscreen renderer to draw into the currently visible sprite's transparent canvas. */
export function renderSpriteInterpolation(root: HTMLElement, progress: number) {
  const path = root.dataset.visualFlow;
  if (!path || !root.isConnected || !Number.isFinite(progress) || !getRenderer()) return;
  let scene = scenes.get(root);
  if (!scene) {
    const image = root.querySelector<HTMLImageElement>('[data-visual-sprite-current] img, [data-visual-sprite] img');
    const columns = Number(root.dataset.visualColumns);
    const rows = Number(root.dataset.visualRows);
    const frames = Number(root.dataset.visualFrameCount);
    if (!image || !Number.isSafeInteger(columns) || columns < 1 || !Number.isSafeInteger(rows) || rows < 1
      || !Number.isSafeInteger(frames) || frames < 2 || frames > columns * rows) return;
    const current: Scene = {image, columns, rows, frames};
    scenes.set(root, current);
    scene = current;
    image.addEventListener('load', () => paint(root, current));
    image.addEventListener('error', () => { delete root.dataset.visualInterpolated; });
    void loadField(path).then(field => {
      current.field = field;
      paint(root, current);
    });
  }
  activeRoots.add(root);
  scene.progress = Math.max(0, Math.min(1, progress));
  paint(root, scene);
}

export function clearSpriteInterpolation(root: HTMLElement) {
  const scene = scenes.get(root);
  if (scene) scene.progress = undefined;
  activeRoots.delete(root);
  delete root.dataset.visualInterpolated;
}
