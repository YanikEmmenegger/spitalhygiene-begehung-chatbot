import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/app/api/utils/adminCheck";
import { handleSupabaseError } from "@/app/api/handleSupabaseError";

// GET Subcategories
export async function GET() {
    const supabase = await createClient();

    // Fetch all subcategories with their related category details
    const { data, error } = await supabase
        .from("subcategory")
        .select("id, name, priority, link_name, link_url, category:category(*)")
        .order("priority", { ascending: true }); // Order subcategories by priority

    if (error) {
        return handleSupabaseError(error);
    }

    // Optionally sort subcategories by category name
    data.sort((a, b) => {
        if (a.category && b.category) {
            return a.category.name.localeCompare(b.category.name);
        }
        return 0;
    });

    return NextResponse.json({ data });
}

// POST Create Subcategory
export async function POST(req: NextRequest) {
    // Check if the user has admin privileges
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body to get subcategory details
    const { name, category, priority, link_name, link_url } = await req.json();

    // Validate required fields
    if (!name || !category) {
        return NextResponse.json(
            { error: "Name and Category ID are required" },
            { status: 400 }
        );
    }

    const supabase = await createClient();

    // Insert the new subcategory into the database
    const { data, error } = await supabase
        .from("subcategory")
        .insert({
            name,
            category,
            priority: priority ?? 0, // Default priority to 0 if not provided
            link_name: link_name ?? null, // Default link_name to null
            link_url: link_url ?? null, // Default link_url to null
        })
        .select("*");

    if (error) {
        return handleSupabaseError(error);
    }

    return NextResponse.json({ data }, { status: 201 });
}

// DELETE Subcategory
export async function DELETE(req: NextRequest) {
    // Check if the user has admin privileges
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the query parameter to get the subcategory ID
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Validate that the subcategory ID is provided
    if (!id) {
        return NextResponse.json(
            { error: "Subcategory ID is required" },
            { status: 400 }
        );
    }

    const supabase = await createClient();

    // Check if the subcategory is linked to any questions
    const { count: questionCount, error: checkError } = await supabase
        .from("question")
        .select("*", { count: "exact" })
        .eq("subcategory", id);

    if (checkError || (questionCount && questionCount > 0)) {
        return NextResponse.json(
            { error: "Cannot delete subcategory with connected questions" },
            { status: 400 }
        );
    }

    // Delete the subcategory from the database
    const { error } = await supabase.from("subcategory").delete().eq("id", id);

    if (error) {
        return handleSupabaseError(error);
    }

    return NextResponse.json({ message: "Subcategory deleted successfully" });
}

// PUT Update Subcategory
export async function PUT(req: NextRequest) {
    // Check if the user has admin privileges
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body to get updated subcategory details
    const { id, name, category, priority, link_name, link_url } = await req.json();

    // Validate required fields
    if (!id || !name || !name.trim() || !category || priority == null) {
        return NextResponse.json(
            {
                error:
                    "Subcategory ID, name, category, and priority are required (link_name/link_url optional)",
            },
            { status: 400 }
        );
    }

    const supabase = await createClient();

    // Update the subcategory in the database
    const { error } = await supabase
        .from("subcategory")
        .update({
            name,
            category,
            priority,
            link_name: link_name ?? null,
            link_url: link_url ?? null,
        })
        .eq("id", id);

    if (error) {
        return handleSupabaseError(error);
    }

    return NextResponse.json({ message: "Subcategory updated successfully" });
}
