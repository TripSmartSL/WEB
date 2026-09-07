/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API origin, no path. e.g. http://localhost:3000 — used to build image URLs. */
  readonly VITE_API_BASE_URL?: string;
  /** Full API base including the version prefix. e.g. http://localhost:3000/api/v1 */
  readonly VITE_APP_API_BASE_URL?: string;
  /** Stripe publishable (client-side) key. */
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
  /** Legacy name, kept so older references keep type-checking. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
