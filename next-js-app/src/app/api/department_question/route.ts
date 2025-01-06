import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/app/api/utils/adminCheck";
import { handleSupabaseError } from "@/app/api/handleSupabaseError";

// GET Department Questions
export async function GET() {
    const supabase = await createClient();

    // Fetch all department-question connections
    const { data, error } = await supabase
        .from("department_question")
        .select("department_id, question_id");

    // Handle potential errors
    if (error) {
        return handleSupabaseError(error);
    }

    // Respond with the retrieved data
    return NextResponse.json({ data });
}

// POST Add Department Question
export async function POST(req: NextRequest) {
    // Verify if the user has admin privileges
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body to extract department and question IDs
    const { department_id, question_id } = await req.json();

    // Validate that both IDs are provided
    if (!department_id || !question_id) {
        return NextResponse.json(
            { error: "Department ID and Question ID are required" },
            { status: 400 }
        );
    }

    const supabase = await createClient();

    // Insert a new department-question connection into the database
    const { data, error } = await supabase
        .from("department_question")
        .insert({ department_id, question_id })
        .select("*");

    // Handle potential errors
    if (error) {
        return handleSupabaseError(error);
    }

    // Respond with the created connection and a 201 status
    return NextResponse.json({ data }, { status: 201 });
}

// DELETE Department Question
export async function DELETE(req: NextRequest) {
    // Verify if the user has admin privileges
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract department and question IDs from the query parameters
    const { searchParams } = new URL(req.url);
    const department_id = searchParams.get("department_id");
    const question_id = searchParams.get("question_id");

    // Validate that both IDs are provided
    if (!department_id || !question_id) {
        return NextResponse.json(
            { error: "Department ID and Question ID are required" },
            { status: 400 }
        );
    }

    const supabase = await createClient();

    // Delete the specified department-question connection from the database
    const { error } = await supabase
        .from("department_question")
        .delete()
        .eq("department_id", department_id)
        .eq("question_id", question_id);

    // Handle potential errors
    if (error) {
        return handleSupabaseError(error);
    }

    // Respond with a success message
    return NextResponse.json({ message: "Connection deleted successfully" });
}
