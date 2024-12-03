'use server'

import {createClient} from '@/utils/supabase/server'

export async function login(email: string) {
    const supabase = await createClient()


    const data = {
        email: email,
        emailRedirectTo: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
    }


    const {error} = await supabase.auth.signInWithOtp(data)

    console.log(process.env.NEXT_PUBLIC_URL)

    return !error;


}
