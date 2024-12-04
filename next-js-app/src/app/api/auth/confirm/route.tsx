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
    const next = '/'

    // Create redirect link without the secret token
    const redirectTo = request.nextUrl.clone()
    redirectTo.pathname = next
    redirectTo.hostname = process.env.NEXT_PUBLIC_URL!
    redirectTo.host = process.env.NEXT_PUBLIC_URL!
    redirectTo.searchParams.delete('token_hash')
    redirectTo.searchParams.delete('type')

    //set cookie for 30 days called userAuthenticated
    const cookieStore = await cookies()
    cookieStore.set({
        name: 'userAuthenticated',
        value: 'true',
        httpOnly: true,
        path: '/',
    })


    if (token_hash && type) {
        const supabase = await createClient()

        const {error} = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })
        if (!error) {
            redirectTo.searchParams.delete('next')
            return NextResponse.redirect(redirectTo)
        }
    }

    // return the user to an error page with some instructions
    redirectTo.pathname = '/error'
    return NextResponse.redirect(redirectTo)
}
