// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
      user: {
        id: number
        name: string
        surnames: string
        email: string
        profile: 'A' | 'T' | 'S'
      } | null
    }
		// interface PageData {}
		// interface PageState {}
		interface Platform {
      env: {
        DB: D1Database;
        CODES: KVNamespace;
      };
    }
	}
}

export {};
