import {type EmailOtpType} from '@supabase/supabase-js';
import {type NextRequest, NextResponse} from 'next/server';
import {createClient} from '@/utils/supabase/server';
import {cookies} from 'next/headers';

export async function GET(request: NextRequest) {
    const {searchParams} = new URL(request.url);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as EmailOtpType | null;
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (type && (token_hash || (token && email))) {
        const supabase = await createClient();

        try {
            const verificationData = token_hash
                ? {token_hash, type}
                : {email: email as string, token: token as string, type};

            const {data, error} = await supabase.auth.verifyOtp(verificationData);

            if (error) {
                return NextResponse.json({error: 'OTP verification failed'}, {status: 401});
            }

            const cookieStore = await cookies();
            cookieStore.set({
                name: 'userAuthenticated',
                value: data.session?.access_token || '',
                httpOnly: true,
                path: '/',
                maxAge: 30 * 24 * 60 * 60,
            });

            return token_hash
                ? NextResponse.redirect(process.env.NEXT_PUBLIC_URL || '/')
                : NextResponse.json({message: 'User authenticated successfully'}, {status: 200});
        } catch (error) {
            console.log('Unexpected error:', error);
            return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
        }
    }

    return NextResponse.json({error: 'Unauthorized'}, {status: 401});
}
