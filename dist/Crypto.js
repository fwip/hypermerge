"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sodium_native_1 = __importDefault(require("sodium-native"));
const Base58 = __importStar(require("bs58"));
function encodedSigningKeyPair() {
    return encodePair(signingKeyPair());
}
exports.encodedSigningKeyPair = encodedSigningKeyPair;
function signingKeyPair() {
    const publicKey = Buffer.alloc(sodium_native_1.default.crypto_sign_PUBLICKEYBYTES);
    const secretKey = Buffer.alloc(sodium_native_1.default.crypto_sign_SECRETKEYBYTES);
    sodium_native_1.default.crypto_sign_keypair(publicKey, secretKey);
    return { publicKey, secretKey };
}
exports.signingKeyPair = signingKeyPair;
function encodedEncryptionKeyPair() {
    return encodePair(encryptionKeyPair());
}
exports.encodedEncryptionKeyPair = encodedEncryptionKeyPair;
function encryptionKeyPair() {
    const publicKey = Buffer.alloc(sodium_native_1.default.crypto_box_PUBLICKEYBYTES);
    const secretKey = Buffer.alloc(sodium_native_1.default.crypto_box_SECRETKEYBYTES);
    sodium_native_1.default.crypto_box_keypair(publicKey, secretKey);
    return { publicKey, secretKey };
}
exports.encryptionKeyPair = encryptionKeyPair;
function sign(secretKey, message) {
    const secretKeyBuffer = decode(secretKey);
    const signatureBuffer = Buffer.alloc(sodium_native_1.default.crypto_sign_BYTES);
    sodium_native_1.default.crypto_sign_detached(signatureBuffer, message, secretKeyBuffer);
    return encode(signatureBuffer);
}
exports.sign = sign;
function verify(publicKey, message, signature) {
    const publicKeyBuffer = decode(publicKey);
    const signatureBuffer = decode(signature);
    return sodium_native_1.default.crypto_sign_verify_detached(signatureBuffer, message, publicKeyBuffer);
}
exports.verify = verify;
function sealedBox(publicKey, message) {
    const sealedBox = Buffer.alloc(message.length + sodium_native_1.default.crypto_box_SEALBYTES);
    sodium_native_1.default.crypto_box_seal(sealedBox, message, decode(publicKey));
    return encode(sealedBox);
}
exports.sealedBox = sealedBox;
function openSealedBox(keyPair, sealedBox) {
    const keyPairBuffer = decodePair(keyPair);
    const sealedBoxBuffer = decode(sealedBox);
    const message = Buffer.alloc(sealedBoxBuffer.length - sodium_native_1.default.crypto_box_SEALBYTES);
    const success = sodium_native_1.default.crypto_box_seal_open(message, sealedBoxBuffer, keyPairBuffer.publicKey, keyPairBuffer.secretKey);
    if (!success)
        throw new Error('Unable to open sealed box');
    return message;
}
exports.openSealedBox = openSealedBox;
function encode(val) {
    return Base58.encode(val);
}
exports.encode = encode;
function decode(val) {
    return Base58.decode(val);
}
exports.decode = decode;
function decodePair(pair) {
    return {
        publicKey: Base58.decode(pair.publicKey),
        secretKey: Base58.decode(pair.secretKey),
    };
}
exports.decodePair = decodePair;
function encodePair(pair) {
    return {
        publicKey: Base58.encode(pair.publicKey),
        secretKey: Base58.encode(pair.secretKey),
    };
}
exports.encodePair = encodePair;
//# sourceMappingURL=Crypto.js.map