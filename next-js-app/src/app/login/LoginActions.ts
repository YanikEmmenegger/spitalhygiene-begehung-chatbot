'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from "next/headers";

// Function to send a login email with a one-time password (OTP)
export async function login(email: string) {
    const supabase = await createClient();

    // Data for the OTP email, including a redirect URL after successful login
    const data = {
        email: email,
        emailRedirectTo: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000', // Redirect to the app's home page
    };

    // Trigger the OTP email using Supabase
    const { error } = await supabase.auth.signInWithOtp(data);

    // Log any errors for debugging purposes
    console.log(error);

    // Return true if no errors occurred, false otherwise
    return !error;
}

// Function to verify the OTP provided by the user
export async function verifyOtp(email: string, token: string) {
    const supabase = await createClient();

    // Verify the OTP using Supabase
    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email', // Specify the OTP type as email
    });

    // Set an HTTP-only cookie for authentication, valid for 30 days
    const cookieStore = await cookies();
    cookieStore.set({
        name: 'userAuthenticated', // Cookie name
        value: data.session?.access_token || '', // Access token for the authenticated session
        httpOnly: true, // HTTP-only cookie for security
        path: '/', // Cookie is valid for the entire site
    });

    // Log any errors for debugging purposes
    if (error) {
        console.log(error);
        return false; // Return false if verification fails
    }

    // Return true on successful OTP verification
    return true;
}
