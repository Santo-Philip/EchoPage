interface ImportMetaEnv {
  readonly SUPABASE_URL: string
  readonly SUPABASE_ANON_KEY: string
  readonly NAME : string
  readonly EMAIL : string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}