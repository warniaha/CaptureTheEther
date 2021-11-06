export function fromHexString(hexString) {
    new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}

export function toHexString(bytes) {
    bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}
