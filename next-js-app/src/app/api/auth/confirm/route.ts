import {type EmailOtpType} from '@supabase/supabase-js';
import {type NextRequest, NextResponse} from 'next/server';

import {createClient} from '@/utils/supabase/server';
import {cookies} from 'next/headers';

// Creating a handler to a GET request to route /auth/confirm
export async function GET(request: NextRequest) {
    console.log('GET /auth/confirm');
    const {searchParams} = new URL(request.url);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as EmailOtpType | null;
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    console.log('Auth Parameters:', {type, token, token_hash, email});

    if (type && (token_hash || (token && email))) {
        const supabase = await createClient();

        try {
            // Validate email if using email/token flow
            if (token && email === null) {
                return NextResponse.json({error: 'Email is required for token authentication'}, {status: 400});
            }

            // Prepare the payload for OTP verification
            const verificationData = token_hash
                ? {token_hash, type}
                : {email: email as string, token: token as string, type};

            // Perform OTP verification
            const {data, error} = await supabase.auth.verifyOtp(verificationData);

            if (error) {
                console.error('OTP Verification Error:', error);
                return NextResponse.json({error: 'OTP verification failed'}, {status: 401});
            }

            // Set an authentication cookie for 30 days
            const cookieStore = await cookies();
            cookieStore.set({
                name: 'userAuthenticated',
                value: data.session?.access_token || '',
                httpOnly: true,
                path: '/',
                maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
            });

            console.log('User authenticated successfully');
            //return NextResponse.redirect(process.env.NEXT_PUBLIC_URL || '/');
            if (token_hash) {
                return NextResponse.redirect(process.env.NEXT_PUBLIC_URL || '/');
            }else {
                return NextResponse.redirect(process.env.NEXT_PUBLIC_URL || '/');
            }


        } catch (e) {
            console.error('Internal Error:', e);
            return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
        }
    }

    console.warn('Invalid request parameters');
    return NextResponse.json({error: 'Unauthorized'}, {status: 401});
}
