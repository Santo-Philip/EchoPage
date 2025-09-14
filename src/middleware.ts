import type { MiddlewareHandler } from "astro";
import { createHmac } from "node:crypto";
import { supabase } from "./lib/supabase";

const SECRET = import.meta.env.ANON_SECRET || "e725cc11bbcf0e94f130a6f86c3346fc97f470be1a014bd943d64fa24be73e9c";

function signAnonId(id: string): string {
  const hmac = createHmac("sha256", SECRET);
  hmac.update(id);
  return hmac.digest("hex");
}

function generateToken(): string {
  const anonId = crypto.randomUUID();
  const signature = signAnonId(anonId);
  return `${anonId}.${signature}`;
}

function verifyToken(token: string): boolean {
  const [anonId, signature] = token.split(".");
  if (!anonId || !signature) return false;

  const expected = signAnonId(anonId);
  return expected === signature;
}

export const onRequest: MiddlewareHandler = async (context, next) => {
  let anonToken = context.cookies.get("anon_id")?.value;

  if (!anonToken || !verifyToken(anonToken)) {
    anonToken = generateToken();
    context.cookies.set("anon_id", anonToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }
  const accessToken = context.cookies.get("sb-access-token")?.value;
  const refreshToken = context.cookies.get("sb-refresh-token")?.value;

  if (refreshToken) {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (!error && data.session) {
      context.cookies.set("sb-access-token", data.session.access_token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        maxAge: 60 * 60 * 24 * 30, // e.g., 30 days
      });
      context.cookies.set("sb-refresh-token", data.session.refresh_token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        maxAge: 60 * 60 * 24 * 30,
      });
    }
  }
  return next();
};
