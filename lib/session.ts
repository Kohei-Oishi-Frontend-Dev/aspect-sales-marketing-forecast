import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

type SessionPayload = {
  user_id: string;
  account_id: string;
};

const DEFAULT_COOKIE_NAME = "session";
// 7 days JWT token expirery date.
const EXPIRY_DATE = 60 * 60 * 24 * 7;

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT secret. Set JWT_SECRET in your .env");
  }
  return new TextEncoder().encode(secret);
}

// Sign a JWT from user_id and account_id
export async function encrypt(
  payload: SessionPayload,
  expiresInSeconds = EXPIRY_DATE
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  //using account_id as a JWT claim, can be modified depending on the actual payload from the server.
  return await new SignJWT({ account_id: payload.account_id })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(payload.user_id)
    .setIssuedAt(now)
    .setExpirationTime(now + expiresInSeconds)
    .sign(getSecret());
}

//decrypt the jwt token and return the user_id and account_id
export async function decrypt(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, getSecret());
        const user_id = typeof payload.sub === "string" ? payload.sub : null;
        const account_id =
            typeof (payload as Record<string, unknown>).account_id === "string"
                ? (payload as Record<string, string>).account_id
                : null;
        if (!user_id || !account_id) return null;
        return { user_id, account_id };
    } catch {
        return null;
    }
}

// Create session cookie (secure, HttpOnly) — call from a server action or route handler
export async function createSession(
  user_id: string,
  account_id: string,
  opts?: {
    name?: string;
    maxAge?: number;
    path?: string;
    sameSite?: "lax" | "strict" | "none";
    domain?: string;
  }
): Promise<string> {
  const name = opts?.name ?? DEFAULT_COOKIE_NAME;
  const maxAge = opts?.maxAge ?? EXPIRY_DATE;

  const token = await encrypt({ user_id, account_id }, maxAge);

  (await cookies()).set(name, token, {
    httpOnly: true,
        secure: true,
    sameSite: opts?.sameSite ?? "lax",
    path: opts?.path ?? "/",
    maxAge,
    domain: opts?.domain,
  });

  return token;
}

export async function deleteSession(){
  (await cookies()).delete("session");
}

export async function getCurrentSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  return decrypt(token);
}