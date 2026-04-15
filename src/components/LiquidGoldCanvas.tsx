import { useEffect, useRef, useCallback } from 'react';

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FLUID_SHADER = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_cursor;

  // Deep purple base: #4B0082
  vec3 basePurple = vec3(0.294, 0.0, 0.51);
  vec3 gridPurple = vec3(0.36, 0.08, 0.58);
  vec3 goldColor = vec3(0.831, 0.659, 0.263); // #D4A843

  float grid(vec2 uv) {
    // Diamond / architectural mesh pattern
    vec2 cell = fract(uv * 12.0);
    // Diamond lines
    float d1 = abs(cell.x + cell.y - 1.0);
    float d2 = abs(cell.x - cell.y);
    float line = min(d1, d2);
    float g = 1.0 - smoothstep(0.0, 0.04, line);

    // Orthogonal grid overlay
    vec2 cell2 = fract(uv * 24.0);
    float ox = 1.0 - smoothstep(0.0, 0.025, abs(cell2.x - 0.5));
    float oy = 1.0 - smoothstep(0.0, 0.025, abs(cell2.y - 0.5));
    float ortho = max(ox, oy) * 0.3;

    return max(g, ortho);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float aspect = u_resolution.x / u_resolution.y;

    // Grid pattern
    vec2 uvA = vec2(uv.x * aspect, uv.y);
    float g = grid(uvA);

    // Base: dark purple with slightly lighter grid lines
    vec3 color = mix(basePurple, gridPurple, g * 0.5);

    // Localized gold reveal (~80px radius)
    float revealRadius = 80.0 / u_resolution.y;
    vec2 cursorA = vec2(u_cursor.x * aspect, u_cursor.y);
    float dist = length(uvA - cursorA);
    float reveal = 1.0 - smoothstep(0.0, revealRadius, dist);
    reveal = reveal * reveal; // softer falloff

    // Gold shimmer on grid lines within reveal
    float shimmer = sin(uv.x * 60.0 + u_time * 0.4) * sin(uv.y * 60.0 - u_time * 0.3) * 0.15 + 0.85;
    vec3 gold = goldColor * shimmer;

    // Blend: grid lines go gold, background gets subtle gold glow
    vec3 goldGrid = mix(color, gold, g * reveal);
    vec3 goldGlow = gold * reveal * 0.15 * (1.0 - g); // subtle ambient glow
    color = goldGrid + goldGlow;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const LiquidGoldCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const startTimeRef = useRef(Date.now());
  const rafRef = useRef<number>(0);
  const targetCursorRef = useRef({ x: 0.5, y: 0.5 });
  const smoothCursorRef = useRef({ x: 0.5, y: 0.5 });

  const initGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) return false;

    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VERTEX_SHADER);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, FLUID_SHADER);
    gl.compileShader(fs);

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error('Fragment shader error:', gl.getShaderInfoLog(fs));
      return false;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    glRef.current = gl;
    programRef.current = program;
    return true;
  }, []);

  const render = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;
    if (!gl || !program || !canvas) return;

    const dpr = Math.min(window.devicePixelRatio, 1.5);
    const w = canvas.clientWidth * dpr;
    const h = canvas.clientHeight * dpr;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }

    // Smooth cursor interpolation (inertia/lag)
    const sc = smoothCursorRef.current;
    const tc = targetCursorRef.current;
    sc.x += (tc.x - sc.x) * 0.08;
    sc.y += (tc.y - sc.y) * 0.08;

    const now = (Date.now() - startTimeRef.current) / 1000;

    gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), w, h);
    gl.uniform1f(gl.getUniformLocation(program, 'u_time'), now);
    gl.uniform2f(gl.getUniformLocation(program, 'u_cursor'), sc.x, sc.y);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    rafRef.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    if (!initGL()) return;

    const canvas = canvasRef.current!;
    const section = canvas.parentElement;

    const updateCursor = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      targetCursorRef.current = {
        x: (clientX - rect.left) / rect.width,
        y: 1 - (clientY - rect.top) / rect.height,
      };
    };

    const onMove = (e: MouseEvent) => updateCursor(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateCursor(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    // Listen on the section parent so pointer-events:none on canvas doesn't block
    const target = section || canvas;
    target.addEventListener('mousemove', onMove as EventListener);
    target.addEventListener('touchmove', onTouch as EventListener, { passive: true });

    rafRef.current = requestAnimationFrame(render);

    return () => {
      target.removeEventListener('mousemove', onMove as EventListener);
      target.removeEventListener('touchmove', onTouch as EventListener);
      cancelAnimationFrame(rafRef.current);
    };
  }, [initGL, render]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none', zIndex: 0 }}
    />
  );
};

export default LiquidGoldCanvas;
