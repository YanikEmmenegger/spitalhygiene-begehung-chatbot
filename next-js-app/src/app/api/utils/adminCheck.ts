import { createClient } from "@/utils/supabase/server";

// Utility function to check if the current user is an admin
export const isAdmin = async (): Promise<boolean> => {
    try {
        const supabase = await createClient();

        // Retrieve the currently logged-in user
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        // Handle potential errors when fetching the user
        if (userError) {
            console.error("Error getting user:", userError);
            return false;
        }

        // If no user is logged in, return false
        if (!user) {
            return false;
        }

        // Extract the user's email address
        const email = user.email;

        // If the email is missing, return false
        if (!email) {
            return false;
        }

        // Check if the user's email exists in the "admin_users" table
        const { data: adminUser, error: adminError } = await supabase
            .from("admin_users")
            .select("email")
            .eq("email", email)
            .maybeSingle(); // Retrieve a single record if the email exists

        // Handle potential errors when querying the admin_users table
        if (adminError) {
            console.error("Error checking admin user:", adminError);
            return false;
        }

        // Return true if the user is an admin, otherwise false
        return adminUser !== null;
    } catch (e) {
        // Log unexpected errors and return false
        console.error("Unexpected error:", e);
        return false;
    }
};
