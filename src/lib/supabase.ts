import { createClient } from "@supabase/supabase-js";
// @ts-ignore
const { env } = Astro.locals.runtime;

export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  {
    auth: {
      flowType: "pkce",
    },
  },
);