import { supabase } from './auth';

export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function checkAuth() {
  const session = await getSession();
  return !!session;
}
