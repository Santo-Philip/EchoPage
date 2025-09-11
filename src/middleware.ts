import type { MiddlewareHandler } from "astro";
import { createHmac } from "node:crypto";

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

  return next();
};
