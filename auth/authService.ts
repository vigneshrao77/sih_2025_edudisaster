import { User, UserRole } from '../types';
import { supabase } from '../services/supabaseClient';

const USER_SESSION_KEY = 'edu_disaster_user';

// --- Authentication Functions using Supabase Auth & Profiles ---

export const login = async (role: UserRole, username: string, password: string): Promise<User | null> => {
  // Supabase Auth requires an email, so we construct a deterministic synthetic email from the username.
  const email = `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}@edudisaster.local`;

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    console.error("Login failed:", authError?.message);
    return null;
  }

  // Fetch the profile to confirm the role matches
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (profileError || !profile) {
    console.error("Failed to fetch user profile", profileError);
    return null;
  }

  if (profile.role !== role && role !== UserRole.GUEST) {
    console.error("Role mismatch");
    return null;
  }

  const user: User = {
    id: profile.id,
    username: profile.username,
    role: profile.role as UserRole,
  };

  sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
  return user;
};

interface RegisterData {
    username: string;
    role: UserRole;
    password?: string;
}

export const register = async (data: RegisterData): Promise<{ success: boolean, message: string }> => {
    if (!data.password) {
        return { success: false, message: 'Password is required' };
    }

    const email = `${data.username.toLowerCase().replace(/[^a-z0-9]/g, '')}@edudisaster.local`;

    // 1. Check if username is already taken in profiles table
    const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .ilike('username', data.username)
        .single();
        
    if (existingUser) {
        return { success: false, message: 'Username already exists. Please choose another one.' };
    }

    // 2. Create the user in Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: data.password,
    });

    if (signUpError || !authData.user) {
        return { success: false, message: signUpError?.message || 'Failed to register user.' };
    }

    // 3. Insert the profile data
    const { error: profileError } = await supabase
        .from('profiles')
        .insert([
            { id: authData.user.id, username: data.username, role: data.role }
        ]);

    if (profileError) {
        return { success: false, message: 'Account created, but failed to save profile data.' };
    }

    return { success: true, message: 'Account created successfully! You can now log in.' };
};

export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
  sessionStorage.removeItem(USER_SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
  const userJson = sessionStorage.getItem(USER_SESSION_KEY);
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch (e) {
      console.error("Failed to parse user from session storage", e);
      return null;
    }
  }
  return null;
};