import type { MiddlewareHandler } from "astro";
import { createHmac } from "node:crypto";
import { createServerClient } from '@supabase/ssr'


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

   const supabase = createServerClient(
  import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL!,
  import.meta.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!,

    {
      cookies: {
        get(name) {
          return context.cookies.get(name)?.value
        },
        remove(name, options) {
          context.cookies.delete(name, options)
        },
        set(name, value, options) {
          context.cookies.set(name, value, options)
        },
      },
    }
  )

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
