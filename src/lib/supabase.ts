// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Vite exposes env variables prefixed with `VITE_` via import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let supabase: unknown;

// Helper to detect common placeholder values so we don't try to initialize
// the real Supabase client against an invalid host/key (which causes DNS
// and websocket errors in the browser). Treat placeholders as "missing".
const isPlaceholder = (v?: string) => {
  if (!v) return true;
  const lower = v.toLowerCase();
  return (
    lower.includes('your-project-ref') ||
    lower.includes('replace_with') ||
    lower.includes('your-anon-key') ||
    lower.includes('your-anon') ||
    lower.includes('example')
  );
};

if (!supabaseUrl || !supabaseAnonKey || isPlaceholder(supabaseUrl) || isPlaceholder(supabaseAnonKey)){
  // If env vars are missing, provide a safe development stub that won't throw
  // This allows the app to run locally without crashing; it simulates the
  // minimal supabase API used by the app (from(...).select(), update().eq().select().single(),
  // channel().on().subscribe(), removeChannel()).
  // Silent dev stub when env vars are missing — avoid noisy console output

  type Seat = { id: string; status?: string | null; vacant_at?: string | null; [k: string]: unknown };

  // bootstrap some dummy seats to make the UI interactive during development
  const seedSeats = (): Map<string, Seat> => {
    const m = new Map<string, Seat>();
    // Sofa 1..6
    for (let i = 1; i <= 6; i++) m.set(`Sofa-${i}`, { id: `Sofa-${i}`, status: 'Available' });
    // Group tables left/right: GT-L1..7 GT-R1..7 each with 10 seats
  for (const side of ['L', 'R']) {
      for (let t = 1; t <= 7; t++) {
        for (let s = 1; s <= 10; s++) {
          const id = `GT-${side}${t}-S${s}`;
          m.set(id, { id, status: 'Available' });
        }
      }
    }
    // Individual I-1..48
    for (let i = 1; i <= 48; i++) m.set(`I-${i}`, { id: `I-${i}`, status: 'Available' });
    return m;
  };

  const seats = seedSeats();

  const listeners: Array<(payload: { new: Seat }) => void> = [];


    const devSupabase = {
      from: (table: string) => ({
        select: async (/* fields?: string */) => {
          // return all seats for lrc_seats
          if (table === 'lrc_seats') return { data: Array.from(seats.values()), error: null };
          return { data: [], error: null };
        },
        update: (payload: Record<string, unknown>) => ({
          eq: (field: string, value: string | number) => ({
            select: async () => {
              if (table === 'lrc_seats' && field === 'id') {
                const id = String(value);
                const existing = seats.get(id) || { id };
                const updated = { ...existing, ...payload } as Seat;
                seats.set(id, updated);
                // notify listeners about update
                const payloadObj = { new: updated };
                listeners.forEach((cb) => {
                  try {
                    cb(payloadObj);
                  } catch (_) {
                    // intentionally silent in dev stub
                  }
                });
                return { data: [updated], error: null };
              }
              return { data: [], error: null };
            },
            single: async () => {
              const res = await (devSupabase.from(table).update(payload).eq(field, value).select());
              return { data: res.data?.[0] ?? null, error: null };
            },
          }),
        }),
      }),
      // minimal channel API used in the app
      channel: (name: string) => ({
        on: (_event: string, _opts: unknown, cb: (p: { new: Seat }) => void) => {
          listeners.push(cb);
          return { subscribe: () => ({ id: name }) } as { subscribe: () => { id: string } };
        },
        subscribe: () => ({ id: name }),
      }),
      removeChannel: (_channel: unknown) => {
        // no-op for dev stub; clearing listeners could remove all to avoid leaks
        // listeners.length = 0; // keep listeners so UI updates when we call update
        return;
      },
    };

  supabase = devSupabase;
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };