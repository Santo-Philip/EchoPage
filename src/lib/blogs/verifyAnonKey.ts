import { createHmac } from "node:crypto";

function verifyAnonToken(token: string, secret: string): { valid: boolean; anonId?: string } {
  const [anonId, signature] = token.split(".");
  if (!anonId || !signature) return { valid: false };

  const expected = createHmac("sha256", secret).update(anonId).digest("hex");
  if (signature !== expected) return { valid: false };

  return { valid: true, anonId };
}

export default verifyAnonToken;