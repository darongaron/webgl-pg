const initPositionBuffer = (gl: WebGLRenderingContext) => {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, // Front face
    -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, // Back face
    -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, // Top face
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, // Bottom face
    1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, // Right face
    -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,// Left face
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return positionBuffer;
}

const initColorBuffer = (gl: WebGLRenderingContext) =>{
  const faceColors = [
    [1.0, 1.0, 1.0, 1.0], // Front face: white
    [1.0, 0.0, 0.0, 1.0], // Back face: red
    [0.0, 1.0, 0.0, 1.0], // Top face: green
    [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
    [1.0, 1.0, 0.0, 1.0], // Right face: yellow
    [1.0, 0.0, 1.0, 1.0], // Left face: purple
  ];
  let colors:number[] = [];

  for (let j = 0; j < faceColors.length; ++j){
    const c = faceColors[j];
    colors = colors.concat(c,c,c,c);
  }
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  return colorBuffer;
}

const initIndexBuffer = (gl: WebGLRenderingContext) => {
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  const indices = [
    0,1,2,0,2,3, // front
    4,5,6,4,6,7, // back
    8,9,10,8,10,11, // top
    12,13,14,12,14,15, // bottom
    16,17,18,16,18,19, // right
    20,21,22,20,22,23, // left
  ];
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );
  return indexBuffer;
}

export const initBuffers = (gl: WebGLRenderingContext) => {
  const positionBuffer = initPositionBuffer(gl)!;
  const colorBuffer = initColorBuffer(gl)!;
  const indexBuffer = initIndexBuffer(gl)!;

  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
}

