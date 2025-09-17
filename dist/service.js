"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode = encode;
exports.decode = decode;
const crypto = __importStar(require("crypto"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const algorithm = "aes-256-cbc";
const rawKey = process.env.SECRET_KEY;
if (!rawKey)
    throw new Error("SECRET_KEY is missing in .env file");
if (rawKey.length !== 32)
    throw new Error("SECRET_KEY must be exactly 32 characters long");
const key = Buffer.from(rawKey);
/** เข้ารหัส → enc:v1:cbc:<iv_b64>:<ct_b64> */
function encode(plain) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const ct = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
    return `enc:v1:cbc:${iv.toString("base64")}:${ct.toString("base64")}`;
}
/** ถอดรหัสจาก enc:v1:cbc:<iv_b64>:<ct_b64> */
function decode(token) {
    const parts = token.split(":");
    if (parts.length !== 5 || parts[0] !== "enc" || parts[1] !== "v1" || parts[2] !== "cbc") {
        throw new Error("Invalid encrypted token format");
    }
    const iv = Buffer.from(parts[3], "base64");
    const ct = Buffer.from(parts[4], "base64");
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
    return pt.toString("utf8");
}
