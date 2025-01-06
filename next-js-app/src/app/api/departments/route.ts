import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/app/api/utils/adminCheck";
import { handleSupabaseError } from "@/app/api/handleSupabaseError";

// GET Departments
export async function GET(request: NextRequest) {
    const supabase = await createClient();

    // Parse the query parameter from the request URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    let data, error;

    if (id) {
        // Fetch a specific department by ID
        const response = await supabase
            .from("department")
            .select("*")
            .eq("id", id)
            .single(); // Retrieve a single row if `id` is unique
        data = response.data;
        error = response.error;
    } else {
        // Fetch all departments
        const response = await supabase
            .from("department")
            .select("*");
        data = response.data;
        error = response.error;
    }

    // Handle errors from Supabase
    if (error) {
        return handleSupabaseError(error);
    }

    // Respond with the retrieved department(s)
    return NextResponse.json({ data });
}

// POST Create Department
export async function POST(req: NextRequest) {
    // Check if the user has admin privileges
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body to extract the department name
    const { name } = await req.json();

    // Validate the department name
    if (!name || !name.trim()) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Insert the new department into the database
    const { data, error } = await supabase
        .from("department")
        .insert({ name })
        .select("*");

    // Handle potential errors
    if (error) {
        return handleSupabaseError(error);
    }

    // Respond with the created department
    return NextResponse.json({ data }, { status: 201 });
}

// DELETE Department
export async function DELETE(req: NextRequest) {
    // Check if the user has admin privileges
    if (!(await isAdmin())) {
        console.log("Unauthorized");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract the department ID from query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Validate the presence of the department ID
    if (!id) {
        return NextResponse.json({ error: "Department ID is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Check if the department has connected questions
    const { count: questionCount, error: checkError } = await supabase
        .from("department_question")
        .select("*", { count: "exact" })
        .eq("department_id", id);

    // Prevent deletion if connected questions exist
    if (checkError || (questionCount && questionCount > 0)) {
        return NextResponse.json(
            { error: "Cannot delete department with connected questions" },
            { status: 400 }
        );
    }

    // Delete the department from the database
    const { error } = await supabase
        .from("department")
        .delete()
        .eq("id", id);

    // Handle potential errors
    if (error) {
        return handleSupabaseError(error);
    }

    // Respond with a success message
    return NextResponse.json({ message: "Department deleted successfully" });
}

// PUT Update Department
export async function PUT(req: NextRequest) {
    // Check if the user has admin privileges
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body to extract department details
    const { id, name } = await req.json();

    // Validate that both ID and name are provided
    if (!id || !name || !name.trim()) {
        return NextResponse.json(
            { error: "Department ID and name are required" },
            { status: 400 }
        );
    }

    const supabase = await createClient();

    // Update the department name in the database
    const { error } = await supabase
        .from("department")
        .update({ name })
        .eq("id", id);

    // Handle potential errors
    if (error) {
        return handleSupabaseError(error);
    }

    // Respond with a success message
    return NextResponse.json({ message: "Department updated successfully" });
}
