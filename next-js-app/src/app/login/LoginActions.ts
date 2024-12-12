'use server';

import {createClient} from '@/utils/supabase/server';

export async function login(email: string) {
    const supabase = await createClient();

    const data = {
        email: email,
        emailRedirectTo: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
    };

    const {error} = await supabase.auth.signInWithOtp(data);

    console.log(error);
    return !error;
}

export async function verifyOtp(email: string, token: string) {
    const supabase = await createClient();

    const {error} = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
    });

    if (error) {
        console.log(error);
        return false;
    }

    // Store the access token in a secure cookie or session
    return true;
}
