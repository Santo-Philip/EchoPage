interface ImportMetaEnv {
  readonly SUPABASE_URL: string
  readonly SUPABASE_ANON_KEY: string
  readonly NAME : string
  readonly EMAIL : string
  readonly AI_API : string
  readonly AI_API_KEY : string
  readonly SITE : string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}