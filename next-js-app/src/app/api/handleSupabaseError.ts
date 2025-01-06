import { NextResponse } from "next/server";
import { PostgrestError } from "@supabase/supabase-js";

// Utility function to handle Supabase errors and generate appropriate HTTP responses
export function handleSupabaseError(error: PostgrestError): NextResponse {
    console.error("Supabase Error:", error); // Log the error for debugging

    // Handle specific Supabase error codes
    if (error.code === "42501") {
        // Error 42501: Unauthorized access (e.g., insufficient privileges)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else if (error.code === "23505") {
        // Error 23505: Unique constraint violation (e.g., duplicate entry)
        return NextResponse.json(
            { error: "Conflict: Resource already exists" },
            { status: 409 }
        );
    } else {
        // Default error handling for other cases
        // Return the error message from Supabase or a generic message
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
