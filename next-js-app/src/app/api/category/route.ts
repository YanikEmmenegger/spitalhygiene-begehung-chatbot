import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/utils/supabase/server";
import {isAdmin} from "@/app/api/utils/adminCheck";
import {handleSupabaseError} from "@/app/api/handleSupabaseError";

// GET Categories
export async function GET() {
    const supabase = await createClient();
    const {data, error} = await supabase.from("category").select("*").order("priority", {ascending: true});
    if (error) {
        return handleSupabaseError(error);
    }
    return NextResponse.json({data});
}

// POST Create Category
export async function POST(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const {name} = await req.json();
    if (!name || !name.trim()) {
        return NextResponse.json({error: "Name is required"}, {status: 400});
    }
    const supabase = await createClient();
    const {data, error} = await supabase.from("category").insert({name}).select("*");
    if (error) {
        return handleSupabaseError(error);
    }
    return NextResponse.json({data}, {status: 201});
}

// DELETE Category
export async function DELETE(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const {searchParams} = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
        return NextResponse.json({error: "Category ID is required"}, {status: 400});
    }
    const supabase = await createClient();
    const {count: subcategoryCount, error: checkError} = await supabase
        .from("subcategory")
        .select("*", {count: "exact"})
        .eq("category", id);
    if (checkError || (subcategoryCount && subcategoryCount > 0)) {
        return NextResponse.json({error: "Cannot delete category with connected subcategories"}, {status: 400});
    }
    const {error} = await supabase.from("category").delete().eq("id", id);
    if (error) {
        return handleSupabaseError(error);
    }
    return NextResponse.json({message: "Category deleted successfully"});
}

// PUT Update Category
export async function PUT(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const {id, name} = await req.json();
    if (!id || !name || !name.trim()) {
        return NextResponse.json({error: "Category ID and name are required"}, {status: 400});
    }
    const supabase = await createClient();
    const {error} = await supabase.from("category").update({name}).eq("id", id);
    if (error) {
        return handleSupabaseError(error);
    }
    return NextResponse.json({message: "Category updated successfully"});
}
