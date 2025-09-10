"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = void 0;
const crypto_1 = __importDefault(require("crypto"));
const secretKey = (_a = process.env.SECRET_KEY) !== null && _a !== void 0 ? _a : "default_secret_key";
// ✅ ทำ key 32 bytes (AES-256)
const makekey = crypto_1.default.createHash("sha256")
    .update(secretKey)
    .digest()
    .subarray(0, 32);
// IV ต้องมีความยาวที่เหมาะสม (12 bytes สำหรับ AES-CCM/GCM)
const enableData = Buffer.from("123456789012"); // 12 bytes
// ตัวอย่าง encode
const encode = (data) => {
    const cipher = crypto_1.default.createCipheriv("aes-256-ccm", makekey, enableData, { authTagLength: 16 });
    let encrypted = cipher.update(data, "utf8", "base64");
    encrypted += cipher.final("base64");
    const tag = cipher.getAuthTag().toString("base64");
    return JSON.stringify({ encrypted, tag });
};
exports.encode = encode;
// ตัวอย่าง decode
const decode = (payload) => {
    const { encrypted, tag } = JSON.parse(payload);
    const decipher = crypto_1.default.createDecipheriv("aes-256-ccm", makekey, enableData, { authTagLength: 16 });
    decipher.setAuthTag(Buffer.from(tag, "base64"));
    let decrypted = decipher.update(encrypted, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};
exports.decode = decode;
