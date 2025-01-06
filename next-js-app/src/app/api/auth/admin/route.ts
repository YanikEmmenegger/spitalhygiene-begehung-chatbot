import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";

// Handler for the GET request to check if a user has admin privileges
export async function GET() {
    try {
        // Initialize Supabase client
        const supabase = await createClient();

        // Retrieve the logged-in user details
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        // Handle authentication errors
        if (userError) {
            console.error('Error retrieving user:', userError);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Ensure a user is logged in
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Extract the user's email from the user data
        const email = user.email;

        // If the email is missing, deny access
        if (!email) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Query the admin_users table to verify if the email belongs to an admin
        const { data: adminUser, error: adminError } = await supabase
            .from('admin_users')
            .select('email')
            .eq('email', email)
            .maybeSingle();

        // Handle database errors during the admin check
        if (adminError) {
            console.error('Error checking admin status:', adminError);
            return NextResponse.json({ error: 'Error checking admin status' }, { status: 500 });
        }

        // Determine admin status based on the query result
        const isAdmin = adminUser !== null;

        // Respond with the admin status
        return NextResponse.json({ isAdmin }, { status: 200 });
    } catch (error) {
        // Catch and log any unexpected errors
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
