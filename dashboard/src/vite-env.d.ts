interface ImportMetaEnv {
  readonly VITE_CLIENT_ID: string;
  readonly VITE_OAUTH_REDIRECT_URI: string;
  readonly VITE_CLIENT_SECRET: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface CustomWindow extends Window {
  google?: array;
}

declare const window: CustomWindow;
