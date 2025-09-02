import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL!,
  import.meta.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!,
  {
    auth: {
      flowType: "pkce",
    },
  },
);