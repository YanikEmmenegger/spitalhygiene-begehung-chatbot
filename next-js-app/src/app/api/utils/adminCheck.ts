// app/api/utils/adminCheck.ts
import {createClient} from "@/utils/supabase/server";

export const isAdmin = async (): Promise<boolean> => {
    try {
        const supabase = await createClient();

        // Check if the user is logged in
        const {
            data: {user},
            error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
            console.error('Error getting user:', userError);
            return false
        }

        if (!user) {
            return false
        }

        // Get the user's email
        const email = user.email;

        if (!email) {
            return false
        }

        // Check if the email exists in the admin_users table
        const {data: adminUser, error: adminError} = await supabase
            .from('admin_users')
            .select('email')
            .eq('email', email)
            .maybeSingle();

        if (adminError) {
            console.error('Error checking admin user:', adminError);
            return false
        }

        return adminUser !== null
    } catch (e) {
        console.error('Unexpected error:', e);
        return false
    }

}
