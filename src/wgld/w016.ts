import vsSource from './w015.vert?raw';
import fsSource from './w015.frag?raw';
//import {Mat4,Vec2} from '../../lib/minMatrix';
import {Mat4} from '../lib/minMatrix';

type shader_type = 'vert' | 'frag';
const create_shader = (type:shader_type, shader_str:string, gl:WebGLRenderingContext) => {
  const shader = type === 'vert' ? gl.createShader(gl.VERTEX_SHADER)! : gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(shader, shader_str);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(shader));
  return shader;
}
const create_program = (vs:WebGLShader, fs:WebGLShader) => {
  const program = <WebGLProgram>gl.createProgram();
  gl.attachShader(program,vs);
  gl.attachShader(program,fs);
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program, gl.LINK_STATUS)) console.error(gl.getProgramInfoLog(program));
  gl.useProgram(program);
  return program;
}

const create_vbo = (data:number[]) => {
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return vbo;
}

interface info {
  attLocation: number, // attributeLocation
  attStride: number,   // attributeの要素数
  vertex: number[],    // 頂点の位置・色情報
}
/** vboをバインドし登録する関数 */
const set_attribute = (gl:WebGLRenderingContext, info_list:info[]) => {
  for (const info of info_list){
    const vbo = <WebGLBuffer>create_vbo(info.vertex);//vbo生成
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo); //VBOをバインド
    gl.enableVertexAttribArray(info.attLocation); //attribute属性を有効にする
    gl.vertexAttribPointer(info.attLocation, info.attStride, gl.FLOAT, false, 0, 0); //attribute属性
  }
}

const canvas = <HTMLCanvasElement>document.querySelector('canvas');
canvas.width = 300;
canvas.height = 300;
const gl = <WebGLRenderingContext>canvas.getContext('webgl');
gl.clearColor(0.0, 0.0, 0.0, 1.0); //初期化時の色
gl.clearDepth(1.0); //初期化時の深度
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
const v_shader = create_shader('vert', vsSource, gl);
const f_shader = create_shader('frag', fsSource, gl);
const prg = create_program(v_shader, f_shader);

const info_list:info[] = [{
  attLocation: gl.getAttribLocation(prg, 'position'),
  attStride: 3,
  vertex: [0.0, 1.0, 0.0,
           1.0, 0.0, 0.0,
          -1.0, 0.0, 0.0],
},{
  attLocation: gl.getAttribLocation(prg, 'color'),
  attStride: 4,
  vertex: [1.0, 0.0, 0.0, 1.0,
           0.0, 1.0, 0.0, 1.0,
           0.0, 0.0, 1.0, 1.0,]
}];

set_attribute(gl, info_list);
const uniLocation = gl.getUniformLocation(prg, 'mvpMatrix');


// 各種行列の生成と初期化
const mMatrix = Mat4.identity(Mat4.create());   //モデル変換行列
const vMatrix = Mat4.identity(Mat4.create());   //ビュー変換行列
const pMatrix = Mat4.identity(Mat4.create());   //プロジェクション変換行列
const tmpMatrix = Mat4.identity(Mat4.create());
const mvpMatrix = Mat4.identity(Mat4.create()); //最終座標変換行列

Mat4.lookAt([0.0, 0.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix); //ビュー座標変換行列
Mat4.perspective(90, canvas.width / canvas.height, 0.1, 100, pMatrix); //プロジェクション座標変換行列
Mat4.multiply(pMatrix, vMatrix, tmpMatrix);

Mat4.translate(mMatrix, [1.5, 0.0, 0.0], mMatrix); // 一つ目のモデルを移動するためのモデル座標変換行列
Mat4.multiply(tmpMatrix, mMatrix, mvpMatrix); // mvp(1つ目のモデル)

// uniformLocationへ座標変換行列を登録し描画する(1つ目のモデル)
gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
gl.drawArrays(gl.TRIANGLES, 0,3);

// 2つ目のモデルを移動するためのモデル座標変換行列
Mat4.identity(mMatrix);
Mat4.translate(mMatrix, [-1.5, 0.0, 0.0], mMatrix);

// mvp(2つ目のモデル)
Mat4.multiply(tmpMatrix, mMatrix, mvpMatrix);

// uniformLocationへ座標変換行列を登録し描画する(2つ目のモデル)
gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
gl.drawArrays(gl.TRIANGLES, 0, 3);

gl.flush(); //コンテキストの再描画

export {};

