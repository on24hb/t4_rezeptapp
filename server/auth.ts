import { SignJWT, jwtVerify, type JWTPayload } from "jose"; 
import { JWT_SECRET_KEY } from "./config.ts"; 
import { type Context, Middleware } from "oak"; //

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

// Verarbeitung von POST-Anfragen an die /login Route & Prüfung Anmeldedaten
/** @param ctx */
export const loginHandler = async (ctx: Context) => {
  try {
    if (!ctx.request.hasBody || ctx.request.headers.get("content-type")?.toLowerCase() !== "application/json") {
      ctx.response.status = 400; 
      ctx.response.body = { message: "Anfrage muss einen JSON Body mit username und password enthalten." };
      return;
    }

    const body = await ctx.request.body().value; // Liest JSON Body: { username: "...", password: "..." }

    if (!body || typeof body.username !== 'string' || typeof body.password !== 'string') {
      ctx.response.status = 400; 
      ctx.response.body = { message: "username und password müssen als Strings im JSON Body gesendet werden." };
      return;
    }

    const { username, password } = body;

    // --- Simpler Test-Login 
    // TODO: Später ggf. durch Datenbankabfrage oder bcrypt-Vergleich ersetzen
    if (username === "t4exam" && password === "SuperKurs") {
      // Payload für das JWT erstellen (userId identifiziert den Benutzer eindeutig)
      const payload = { userId: username };
      const token = await createJWT(payload);

      ctx.response.body = { token: token };
      ctx.response.status = 200; 
      console.log(`Benutzer '${username}' erfolgreich eingeloggt.`); // Log für Debugging
    } else {
      ctx.response.status = 401; 
      ctx.response.body = { message: "Ungültiger Benutzername oder Passwort." };
      console.warn(`Fehlgeschlagener Login-Versuch für Benutzer '${username}'.`); // Log für Debugging
    }
  } catch (error) {
    console.error("Fehler im loginHandler:", error);
    ctx.response.status = 400; 
    ctx.response.body = { message: "Ungültige Anfrage: " + error};
  }
};

/**
 * Oak Middleware zur Überprüfung des JWT im Authorization Header
 * @param ctx
 * @param next
 */
export const jwtMiddleware: Middleware = async (ctx, next) => {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401; 
    ctx.response.body = { message: "Authentifizierungstoken fehlt oder ist im falschen Format (Bearer)." };
    return;
  }

  const token = authHeader.substring(7);
  const payload = await verifyJWT(token);

  if (!payload || !payload.userId) {
    ctx.response.status = 401; 
    ctx.response.body = { message: "Authentifizierungstoken ungültig, abgelaufen oder enthält keine Benutzer-ID." };
    return;
  }

  ctx.state.user = payload; 
  console.log("Token gültig, Benutzer:", ctx.state.user); 

  await next();
};