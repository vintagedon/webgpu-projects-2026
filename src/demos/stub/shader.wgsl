struct Params {
  color: vec3f,
  time: f32,
};

@group(0) @binding(0) var<uniform> params: Params;

struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};

@vertex
fn vs_main(@builtin(vertex_index) idx: u32) -> VertexOut {
  let positions = array<vec2f, 3>(
    vec2f(-1.0, -3.0),
    vec2f(-1.0, 1.0),
    vec2f(3.0, 1.0)
  );
  let uvs = array<vec2f, 3>(
    vec2f(0.0, -1.0),
    vec2f(0.0, 1.0),
    vec2f(2.0, 1.0)
  );
  var out: VertexOut;
  out.position = vec4f(positions[idx], 0.0, 1.0);
  out.uv = uvs[idx];
  return out;
}

fn hsb2rgb(c: vec3f) -> vec3f {
  let rgb = clamp(abs(((c.x * 6.0 + vec3f(0.0, 4.0, 2.0)) % 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return c.z * mix(vec3f(1.0), rgb, c.y);
}

@fragment
fn fs_main(in: VertexOut) -> @location(0) vec4f {
  let uv = in.uv;
  let wave = sin(uv.x * 3.0 + params.time * 0.35) * 0.06;
  let hue = mod(params.color.x + (1.0 - uv.y) * 0.18 + wave, 1.0);
  let sat = params.color.y;
  let bright = params.color.z * (0.72 + uv.y * 0.28);
  let rgb = hsb2rgb(vec3f(hue, sat, bright));
  return vec4f(rgb, 1.0);
}
