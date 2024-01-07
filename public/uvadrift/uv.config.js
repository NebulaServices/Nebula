self.__uv$config = {
  prefix: "/~/uv/",
  bare: "/bare/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/uvadrift/uv.handler.js",
  client: "/uvadrift/uv.client.js",
  bundle: "/uvadrift/uv.bundle.js",
  config: "/uvadrift/uv.config.js",
  sw: "/uvadrift/uv.sw.js"
};
