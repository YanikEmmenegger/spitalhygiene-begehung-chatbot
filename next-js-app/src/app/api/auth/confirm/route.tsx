import {type EmailOtpType} from '@supabase/supabase-js'
import {type NextRequest, NextResponse} from 'next/server'

import {createClient} from '@/utils/supabase/server'
import {cookies} from "next/headers";

// Creating a handler to a GET request to route /auth/confirm
export async function GET(request: NextRequest) {
    console.log('GET /auth/confirm')
    const {searchParams} = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null


    if (token_hash && type) {
        const supabase = await createClient()

        const {error, data} = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })
        if (!error) {

            //set cookie for 30 days called userAuthenticated
            const cookieStore = await cookies()
            cookieStore.set({
                name: 'userAuthenticated',
                value: data.session?.access_token || '',
                httpOnly: true,
                path: '/',
            })

            return NextResponse.redirect(process.env.NEXT_PUBLIC_URL!)
        }

    }

    // return the user to an error page with some instructions
    return NextResponse.redirect(process.env.NEXT_PUBLIC_URL! + "/login?error=Etwas ist schief gelaufen")
}
