declare const mat4: any;

interface buffers {
  position: WebGLBuffer;
  color: WebGLBuffer,
  indices: WebGLBuffer,
};

interface programInfo {

  program: WebGLProgram,
    attribLocations: {
      vertexPosition: number,
      vertexColor: number,
    },
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation,
    modelViewMatrix: WebGLUniformLocation,
  },
};
