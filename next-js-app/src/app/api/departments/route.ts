import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/utils/supabase/server";
import {isAdmin} from "@/app/api/utils/adminCheck";
import {handleSupabaseError} from "@/app/api/handleSupabaseError";

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

    if (error) {
        return handleSupabaseError(error);
    }

    return NextResponse.json({ data });
}

// POST Create Department
export async function POST(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const {name} = await req.json();
    if (!name || !name.trim()) {
        return NextResponse.json({error: "Name is required"}, {status: 400});
    }
    const supabase = await createClient();
    const {data, error} = await supabase.from("department").insert({name}).select("*");
    if (error) {
        return handleSupabaseError(error);
    }
    return NextResponse.json({data}, {status: 201});
}

// DELETE Department
export async function DELETE(req: NextRequest) {
    if (!(await isAdmin())) {
        console.log("Unauthorized");
        console.log("HIER HIER HIER")
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const {searchParams} = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
        return NextResponse.json({error: "Department ID is required"}, {status: 400});
    }
    const supabase = await createClient();
    const {count: questionCount, error: checkError} = await supabase
        .from("department_question")
        .select("*", {count: "exact"})
        .eq("department_id", id);
    if (checkError || (questionCount && questionCount > 0)) {
        return NextResponse.json({error: "Cannot delete department with connected questions"}, {status: 400});
    }
    const {error} = await supabase.from("department").delete().eq("id", id);
    if (error) {
        return handleSupabaseError(error);
    }
    return NextResponse.json({message: "Department deleted successfully"});
}

// PUT Update Department
export async function PUT(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const {id, name} = await req.json();
    if (!id || !name || !name.trim()) {
        return NextResponse.json({error: "Department ID and name are required"}, {status: 400});
    }
    const supabase = await createClient();
    const {error} = await supabase.from("department").update({name}).eq("id", id);
    if (error) {
        return handleSupabaseError(error);
    }
    return NextResponse.json({message: "Department updated successfully"});
}
