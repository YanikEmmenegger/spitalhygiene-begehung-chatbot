import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/utils/supabase/server";
import {isAdmin} from "@/app/api/utils/adminCheck";
import {handleSupabaseError} from "@/app/api/handleSupabaseError";

// GET Person Types
export async function GET() {
    const supabase = await createClient();
    const {data, error} = await supabase.from("person_types").select("*");
    if (error) {
        return handleSupabaseError(error);
    }
    return NextResponse.json({data});
}

// POST Create Person Type
export async function POST(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const {name} = await req.json();
    if (!name || !name.trim()) {
        return NextResponse.json({error: "Name is required"}, {status: 400});
    }
    const supabase = await createClient();
    const {data, error} = await supabase.from("person_types").insert({name}).select("*");
    if (error) {
        return handleSupabaseError(error);
    }
    return NextResponse.json({data}, {status: 201});
}

// DELETE Person Type
export async function DELETE(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const {searchParams} = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
        return NextResponse.json({error: "Person Type ID is required"}, {status: 400});
    }
    const supabase = await createClient();
    const {error} = await supabase.from("person_types").delete().eq("id", id);
    if (error) {
        return handleSupabaseError(error);
    }
    return NextResponse.json({message: "Person Type deleted successfully"});
}

// PUT Update Person Type
export async function PUT(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const {id, name} = await req.json();
    if (!id || !name || !name.trim()) {
        return NextResponse.json({error: "Person Type ID and name are required"}, {status: 400});
    }
    const supabase = await createClient();
    const {error} = await supabase.from("person_types").update({name}).eq("id", id);
    if (error) {
        return handleSupabaseError(error);
    }
    return NextResponse.json({message: "Person Type updated successfully"});
}
