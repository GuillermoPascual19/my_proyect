import crypto from "crypto";
import logger from "./logger";

const log = logger(module);

/**
 * Function to generate a random token for a user session
 * @param  {int} length   token length to generate
 */
const generateToken = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/**
 * Function to parse bytes to MB, GB or TB
 * @param  {int} bytes   token length to generate
 */
export const bytesToSize = (bytes: number) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Byte";
  const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
  return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
};

export const keysChecker = (obj: { [key: string]: any }, keys: string[]) => {
  return keys.every((key : string) => {
    return (
      Object.keys(obj).indexOf(key) !== -1 &&
      obj[key] !== null &&
      obj[key] !== undefined &&
      obj[key] !== ""
    );
  });
};

export const cypherText = (
  text: string
): { key: string; iv: string; data: string } => {
  const iv = crypto.randomBytes(16);
  const key = crypto.randomBytes(32);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
  const encrypted = cipher.update(text);
  const finalBuffer = Buffer.concat([encrypted, cipher.final()]);

  return {
    key: key.toString("hex"),
    iv: iv.toString("hex"),
    data: finalBuffer.toString("hex"),
  };
};

 export const decypherText = (cipherText: string, iv: string, key: string): string => {
  const keyTemp = Buffer.from(key, "hex");
  const ivTemp = Buffer.from(iv, "hex");
  const encryptedTextTemp = Buffer.from(cipherText, "hex");

  const decipherText = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(keyTemp),
    Buffer.from(ivTemp)
  );

  const decrypted = decipherText.update(encryptedTextTemp);
  const finalBuffer = Buffer.concat([decrypted, decipherText.final()]);

  return finalBuffer.toString();
};

export const cypherTextWithKey = (text: string, key: string, iv: string): string => {
  const keyTemp = Buffer.from(key, "hex");
  const ivTemp = Buffer.from(iv, "hex");
  const cipher = crypto.createCipheriv("aes-256-cbc", keyTemp, ivTemp);
  const encrypted = cipher.update(text);
  const finalBuffer = Buffer.concat([encrypted, cipher.final()]);

  return finalBuffer.toString("hex");
};

export default{
  generateToken,
  bytesToSize,
  keysChecker,
  cypherText,
  decypherText,
  cypherTextWithKey
};
