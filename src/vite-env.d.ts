interface ImportMetaEnv {
  readonly VITE_XAI_API_KEY: string
  readonly VITE_NETWORK_ID: string
  readonly VITE_CDP_API_KEY_NAME: string
  readonly VITE_CDP_API_KEY_PRIVATE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}