/*global Ultraviolet*/
self.__uv$config = {
    prefix: '/win-11/uv/service/',
    bare: 'https://8080-chessaimaker-win11-aqdkju33ung.ws-us108.gitpod.io/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/win-11/uv/uv.handler.js',
    client: '/win-11/uv/uv.client.js',
    bundle: '/win-11/uv/uv.bundle.js',
    config: '/win-11/uv/uv.config.js',
    sw: '/win-11/uv/uv.sw.js',
};
