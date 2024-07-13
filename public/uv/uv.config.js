self.__uv$config = {
  prefix: "/~/uv/",
  encodeUrl: function encode(str) {
        if (!str) return str;
        return encodeURIComponent(
            str
                .toString()
                .split('')
                .map((char, ind) =>
                    ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 3) : char
                )
                .join('')
        );
    },
  decodeUrl: function decode(str) {
        if (!str) return str;
        let [input, ...search] = str.split('?');

        return (
            decodeURIComponent(input)
                .split('')
                .map((char, ind) =>
                    ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 3) : char
                )
                .join('') + (search.length ? '?' + search.join('?') : '')
        );
    },
  handler: "/uv/uv.handler.js",
  client: "/uv/uv.client.js",
  bundle: "/uv/uv.bundle.js",
  config: "/uv/uv.config.js",
  sw: "/uv/uv.sw.js"
};
