import * as crypto from "crypto";
import * as dotenv from "dotenv";

dotenv.config();

const algorithm = "aes-256-cbc";
const rawKey = process.env.SECRET_KEY;
if (!rawKey) throw new Error("SECRET_KEY is missing in .env file");
if (rawKey.length !== 32) throw new Error("SECRET_KEY must be exactly 32 characters long");
const key = Buffer.from(rawKey);

/** เข้ารหัส → enc:v1:cbc:<iv_b64>:<ct_b64> */
export function encode(plain: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const ct = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return `enc:v1:cbc:${iv.toString("base64")}:${ct.toString("base64")}`;
}

/** ถอดรหัสจาก enc:v1:cbc:<iv_b64>:<ct_b64> */
export function decode(token: string): string {
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
