import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

// Handler for the GET request to verify OTP for email-based authentication
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    // Extract query parameters from the request
    const token_hash = searchParams.get('token_hash'); // Token hash for verification
    const type = searchParams.get('type') as EmailOtpType | null; // OTP type (e.g., email)
    const token = searchParams.get('token'); // OTP token
    const email = searchParams.get('email'); // User's email address

    // Ensure that the required parameters are present
    if (type && (token_hash || (token && email))) {
        const supabase = await createClient();

        try {
            // Prepare data for OTP verification based on the presence of `token_hash` or `token` + `email`
            const verificationData = token_hash
                ? { token_hash, type }
                : { email: email as string, token: token as string, type };

            // Call Supabase to verify the OTP
            const { data, error } = await supabase.auth.verifyOtp(verificationData);

            // Handle verification errors
            if (error) {
                return NextResponse.json({ error: 'OTP verification failed' }, { status: 401 });
            }

            // Store the user's session token in a secure cookie if verification succeeds
            const cookieStore = await cookies();
            cookieStore.set({
                name: 'userAuthenticated', // Cookie name
                value: data.session?.access_token || '', // Access token from the session
                httpOnly: true, // Make the cookie inaccessible to client-side scripts
                path: '/', // Cookie available across the entire site
                maxAge: 30 * 24 * 60 * 60, // Expire in 30 days
            });

            // Redirect to the home page if `token_hash` was used, otherwise send a success response
            return token_hash
                ? NextResponse.redirect(process.env.NEXT_PUBLIC_URL || '/')
                : NextResponse.json({ message: 'User authenticated successfully' }, { status: 200 });
        } catch (error) {
            // Log unexpected errors and return a generic server error response
            console.log('Unexpected error:', error);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    }

    // Respond with unauthorized if required parameters are missing
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
