import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/utils/supabase/server";
import {isAdmin} from "@/app/api/utils/adminCheck";
import {handleSupabaseError} from "@/app/api/handleSupabaseError";

// GET Department Questions
export async function GET() {
    const supabase = await createClient();
    const {data, error} = await supabase
        .from("department_question")
        .select("department_id, question_id");
    if (error) {
        return handleSupabaseError(error);
    }
    return NextResponse.json({data});
}

// POST Add Department Question
export async function POST(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const {department_id, question_id} = await req.json();
    if (!department_id || !question_id) {
        return NextResponse.json(
            {error: "Department ID and Question ID are required"},
            {status: 400}
        );
    }
    const supabase = await createClient();
    const {data, error} = await supabase
        .from("department_question")
        .insert({department_id, question_id})
        .select("*");
    if (error) {
        return handleSupabaseError(error);
    }
    return NextResponse.json({data}, {status: 201});
}

// DELETE Department Question
export async function DELETE(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const {searchParams} = new URL(req.url);
    const department_id = searchParams.get("department_id");
    const question_id = searchParams.get("question_id");
    if (!department_id || !question_id) {
        return NextResponse.json(
            {error: "Department ID and Question ID are required"},
            {status: 400}
        );
    }
    const supabase = await createClient();
    const {error} = await supabase
        .from("department_question")
        .delete()
        .eq("department_id", department_id)
        .eq("question_id", question_id);
    if (error) {
        return handleSupabaseError(error);
    }
    return NextResponse.json({message: "Connection deleted successfully"});
}
