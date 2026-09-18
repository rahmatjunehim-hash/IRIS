import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { UserRole } from "./constants";

export interface SessionUser {
  id: string;
  name: string;
  username: string;
  email?: string | null;
  role: UserRole;
  cabangId?: string | null;
  cabangName?: string | null;
  cabangKode?: string | null;
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "iris-secret-key-optik-i-see-you-for-every-you-2026"
);

export const SESSION_COOKIE_NAME = "iris_session";

export async function signSession(payload: SessionUser): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySession(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}
