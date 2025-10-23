import { SignJWT, jwtVerify, type JWTPayload } from "jose"; 
import { JWT_SECRET_KEY } from "./config.ts"; 

// Secret Key vorbereiten (Uint8Array)
const secretKey = new TextEncoder().encode(JWT_SECRET_KEY);

// Nimmt Benutzerdaten (payload) und gibt einen signierten Token-String zurück.
export async function createJWT(payload: JWTPayload): Promise<string> {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secretKey);
  return jwt;
}

// Token überprüfen
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });
    console.log("JWT is valid:", payload);
    return payload;
  } catch (error) {
    console.error("Ungültiges JWT:", error);
    return null;
  }
}