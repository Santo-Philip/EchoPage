interface ImportMetaEnv {
  readonly SUPABASE_URL: string
  readonly SUPABASE_ANON_KEY: string
  readonly NAME : string
  readonly EMAIL : string
  readonly PUBLIC_AI_API : string
  readonly PUBLIC_AI_API_KEY : string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}