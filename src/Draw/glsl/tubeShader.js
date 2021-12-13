export const _VS = `
varying vec3 v_position;
void main() {
    v_position = position;
    gl_Position =  projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    
}
`;
export const _FS = `
#define PI2 6.28318530718

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;

varying vec3 v_position;

float rect(vec2 pt, vec2 size, vec2 center){
  //return 0 if not in box and 1 if it is
  //step(edge, x) 0.0 is returned if x < edge, and 1.0 is returned otherwise.
  vec2 halfsize = size * 0.5;
  vec2 p = pt - center;
  float horz = step(-halfsize.x, p.x) - step(halfsize.x, p.x);
  float vert = step(-halfsize.y, p.y) - step(halfsize.y, p.y);
  return horz * vert;
}

void main (void)
{
  float radius = 0.5;
  vec2 center = vec2(cos(u_time) * radius , sin(u_time) * radius);
  float square = rect(v_position.xy, vec2(0.5), center);
  vec3 color = vec3(1.0, 1.0, 0.0) * square;
  gl_FragColor = vec4(color, 1.0); 
}
`;

