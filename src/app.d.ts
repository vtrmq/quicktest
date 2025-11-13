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
        phone?: string
        photo?: string
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

    interface KVNamespace {
    get(key: string): Promise<string | null>;
    put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
    delete(key: string): Promise<void>;
    list(options?): Promise<{ keys: any[] }>;
  }

  // ============= D1 =========================

  interface D1ResultMeta {
    duration: number;
    last_row_id: number;
    changes: number;
    served_by: string;
  }

  interface D1Result<T = any> {
    results?: T[];
    success: boolean;
    meta: D1ResultMeta;
    error?: string;
  }

  interface D1Database {
    prepare(query: string): {
      bind(...params: any[]): any;
      all(): Promise<{ results: any[]; success: boolean }>;
      first(): Promise<any>;
      run(): Promise<D1Result>;
      //run(): Promise<{ success: boolean; error?: string }>;
    };
  }

  interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }

  // Declarar variables de entorno
  declare namespace NodeJS {
    interface ProcessEnv {
      GMAIL_USER: string;
      GMAIL_APP_PASS: string;
    }
  }

}

export {};
