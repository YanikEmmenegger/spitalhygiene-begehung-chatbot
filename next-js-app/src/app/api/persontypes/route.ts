import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/app/api/utils/adminCheck";
import { handleSupabaseError } from "@/app/api/handleSupabaseError";

// GET Person Types
export async function GET() {
    const supabase = await createClient();

    // Fetch all person types from the database
    const { data, error } = await supabase.from("person_types").select("*");

    // Handle potential errors
    if (error) {
        return handleSupabaseError(error);
    }

    // Respond with the list of person types
    return NextResponse.json({ data });
}

// POST Create Person Type
export async function POST(req: NextRequest) {
    // Verify if the user has admin privileges
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body to extract the person type name
    const { name } = await req.json();

    // Validate that the name is provided and not empty
    if (!name || !name.trim()) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Insert a new person type into the database
    const { data, error } = await supabase
        .from("person_types")
        .insert({ name })
        .select("*");

    // Handle potential errors
    if (error) {
        return handleSupabaseError(error);
    }

    // Respond with the created person type
    return NextResponse.json({ data }, { status: 201 });
}

// DELETE Person Type
export async function DELETE(req: NextRequest) {
    // Verify if the user has admin privileges
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract the person type ID from query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Validate that the person type ID is provided
    if (!id) {
        return NextResponse.json(
            { error: "Person Type ID is required" },
            { status: 400 }
        );
    }

    const supabase = await createClient();

    // Delete the person type from the database
    const { error } = await supabase
        .from("person_types")
        .delete()
        .eq("id", id);

    // Handle potential errors
    if (error) {
        return handleSupabaseError(error);
    }

    // Respond with a success message
    return NextResponse.json({ message: "Person Type deleted successfully" });
}

// PUT Update Person Type
export async function PUT(req: NextRequest) {
    // Verify if the user has admin privileges
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body to extract person type details
    const { id, name } = await req.json();

    // Validate that both the ID and name are provided
    if (!id || !name || !name.trim()) {
        return NextResponse.json(
            { error: "Person Type ID and name are required" },
            { status: 400 }
        );
    }

    const supabase = await createClient();

    // Update the person type name in the database
    const { error } = await supabase
        .from("person_types")
        .update({ name })
        .eq("id", id);

    // Handle potential errors
    if (error) {
        return handleSupabaseError(error);
    }

    // Respond with a success message
    return NextResponse.json({ message: "Person Type updated successfully" });
}
