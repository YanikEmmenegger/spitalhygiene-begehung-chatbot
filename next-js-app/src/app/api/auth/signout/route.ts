import {createClient} from '@/utils/supabase/server'
import {revalidatePath} from 'next/cache'
import {NextResponse} from 'next/server'
import {cookies} from "next/headers";

export async function POST() {
    const supabase = await createClient()

    // Check if a user's logged in
    const {
        data: {user},
    } = await supabase.auth.getUser()

    if (user) {
        await supabase.auth.signOut()
    }
    const cookieStore = await cookies()
    cookieStore.delete('userAuthenticated')
    cookieStore.delete('disclaimerAccepted')

    revalidatePath('/', 'layout')
    return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_URL), {
        status: 302,
    })
}
