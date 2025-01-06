import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/app/api/utils/adminCheck";
import { handleSupabaseError } from "@/app/api/handleSupabaseError";

// GET Categories
export async function GET() {
    const supabase = await createClient();

    // Fetch all categories ordered by their priority
    const { data, error } = await supabase
        .from("category")
        .select("*")
        .order("priority", { ascending: true });

    // Handle errors with a centralized error handler
    if (error) {
        return handleSupabaseError(error);
    }

    // Return the list of categories as JSON
    return NextResponse.json({ data });
}

// POST Create Category
export async function POST(req: NextRequest) {
    // Verify if the user has admin privileges
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body to get the category name
    const { name } = await req.json();

    // Validate that the name is provided and not empty
    if (!name || !name.trim()) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Insert the new category into the database
    const { data, error } = await supabase
        .from("category")
        .insert({ name })
        .select("*");

    // Handle potential errors
    if (error) {
        return handleSupabaseError(error);
    }

    // Respond with the created category and a 201 status
    return NextResponse.json({ data }, { status: 201 });
}

// DELETE Category
export async function DELETE(req: NextRequest) {
    // Verify if the user has admin privileges
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract the category ID from the query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Ensure the category ID is provided
    if (!id) {
        return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Check if the category has any connected subcategories
    const { count: subcategoryCount, error: checkError } = await supabase
        .from("subcategory")
        .select("*", { count: "exact" })
        .eq("category", id);

    // Prevent deletion if subcategories exist or there is an error
    if (checkError || (subcategoryCount && subcategoryCount > 0)) {
        return NextResponse.json(
            { error: "Cannot delete category with connected subcategories" },
            { status: 400 }
        );
    }

    // Delete the category from the database
    const { error } = await supabase.from("category").delete().eq("id", id);

    // Handle potential errors
    if (error) {
        return handleSupabaseError(error);
    }

    // Respond with a success message
    return NextResponse.json({ message: "Category deleted successfully" });
}

// PUT Update Category
export async function PUT(req: NextRequest) {
    // Verify if the user has admin privileges
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body to get category details
    const { id, name, priority } = await req.json();

    console.log("PUT /api/category =>", { id, name, priority });

    // Validate that all required fields are provided and valid
    if (!id || !name || !name.trim() || priority == null) {
        return NextResponse.json(
            { error: "Category ID, name, and priority are required" },
            { status: 400 }
        );
    }

    const supabase = await createClient();

    // Update the category details in the database
    const { error } = await supabase
        .from("category")
        .update({ name, priority })
        .eq("id", id);

    // Handle potential errors
    if (error) {
        return handleSupabaseError(error);
    }

    // Respond with a success message
    return NextResponse.json({ message: "Category updated successfully" });
}
