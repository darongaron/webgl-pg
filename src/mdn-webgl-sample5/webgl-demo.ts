import vsSource from './app.vert?raw';
import fsSource from './app.frag?raw';
import { initBuffers } from './init-buffers';
import { drawScene } from './draw-scene';

let cubeRotation = 0.0;
let deltaTime = 0;

const loadShader = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const initShaderProgram = (gl: WebGLRenderingContext, vsSource: string, fsSource: string) => {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)!;
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)!;

  const shaderProgram = gl.createProgram()!;
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
    return null;
  }
  return shaderProgram;
}

const main = () => {
  const canvas = document.querySelector<HTMLCanvasElement>('#glcanvas')!;
  const gl = canvas.getContext("webgl")!;

  if(gl === null) {
    console.error('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }
  
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource)!;
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition')!,
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor')!,
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix')!,
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')!,
    },
  };
  const buffers = initBuffers(gl);
  let then = 0;
  const render = (now: number) => {
    now *= 0.001;
    deltaTime = now - then;
    then = now;
    drawScene(gl, programInfo, buffers, cubeRotation);
    cubeRotation += deltaTime;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();
