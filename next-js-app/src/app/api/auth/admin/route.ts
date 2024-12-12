// app/api/auth/admin/route.ts

import {NextResponse} from 'next/server';
import {createClient} from "@/utils/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();

        // Check if the user is logged in
        const {
            data: {user},
            error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
            console.error('Error getting user:', userError);
            return NextResponse.json({error: 'Unauthorized'}, {status: 401});
        }

        if (!user) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401});
        }

        // Get the user's email
        const email = user.email;

        if (!email) {
            return NextResponse.json({error: 'Forbidden'}, {status: 403});
        }

        // Check if the email exists in the admin_users table
        const {data: adminUser, error: adminError} = await supabase
            .from('admin_users')
            .select('email')
            .eq('email', email)
            .maybeSingle();

        if (adminError) {
            console.error('Error checking admin user:', adminError);
            return NextResponse.json({error: 'Error checking admin status'}, {status: 500});
        }

        const isAdmin = adminUser !== null;

        return NextResponse.json({isAdmin}, {status: 200});
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}
