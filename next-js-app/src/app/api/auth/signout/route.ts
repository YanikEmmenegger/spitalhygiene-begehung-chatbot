import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { cookies } from "next/headers";

// Handler for the POST request to log out a user
export async function POST() {
    const supabase = await createClient();

    // Retrieve the currently logged-in user
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // If a user is logged in, sign them out
    if (user) {
        await supabase.auth.signOut();
    }

    // Access the cookie store and clear relevant cookies
    const cookieStore = await cookies();
    cookieStore.delete('userAuthenticated'); // Delete the authentication cookie
    cookieStore.delete('disclaimerAccepted'); // Delete the disclaimer cookie if set

    // Revalidate the root path and layout to ensure the UI reflects the logout state
    revalidatePath('/', 'layout');

    // Redirect the user to the login page with a 302 status (Found)
    return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_URL), {
        status: 302,
    });
}
