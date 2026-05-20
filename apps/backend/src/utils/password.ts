import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const HASH_ALGORITHM = "scrypt";
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

const deriveKey = (
  password: string,
  salt: Buffer,
  options: { N: number; r: number; p: number }
) =>
  new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, options, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey as Buffer);
    });
  });

export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(SALT_LENGTH);
  const derivedKey = await deriveKey(password, salt, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P
  });

  return [
    HASH_ALGORITHM,
    String(SCRYPT_N),
    String(SCRYPT_R),
    String(SCRYPT_P),
    salt.toString("base64"),
    derivedKey.toString("base64")
  ].join("$");
};

export const verifyPassword = async (
  password: string,
  passwordHash: string
): Promise<boolean> => {
  const parts = passwordHash.split("$");

  if (parts.length !== 6) {
    return false;
  }

  const [algorithm, nValue, rValue, pValue, saltBase64, keyBase64] = parts;

  if (algorithm !== HASH_ALGORITHM) {
    return false;
  }

  const parsedN = Number(nValue);
  const parsedR = Number(rValue);
  const parsedP = Number(pValue);

  if (
    !Number.isInteger(parsedN) ||
    !Number.isInteger(parsedR) ||
    !Number.isInteger(parsedP) ||
    parsedN <= 1 ||
    parsedR <= 0 ||
    parsedP <= 0
  ) {
    return false;
  }

  let salt: Buffer;
  let expectedKey: Buffer;

  try {
    salt = Buffer.from(saltBase64, "base64");
    expectedKey = Buffer.from(keyBase64, "base64");
  } catch {
    return false;
  }

  if (salt.length === 0 || expectedKey.length !== KEY_LENGTH) {
    return false;
  }

  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    scrypt(
      password,
      salt,
      expectedKey.length,
      { N: parsedN, r: parsedR, p: parsedP },
      (error, key) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(key as Buffer);
      }
    );
  });

  return timingSafeEqual(expectedKey, derivedKey);
};
