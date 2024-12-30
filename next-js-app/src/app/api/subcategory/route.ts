import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/utils/supabase/server";
import {isAdmin} from "@/app/api/utils/adminCheck";
import {handleSupabaseError} from "@/app/api/handleSupabaseError";

// GET Subcategories
export async function GET() {
    const supabase = await createClient();
    const {
        data,
        error
    } = await supabase.from("subcategory").select("id, name,priority, category:category(*)").order("priority", {ascending: true});
    if (error) {
        return handleSupabaseError(error);
    }

    //order by category name
    data.sort((a, b) => {
        if (a.category!.name < b.category!.name) {
            return -1;
        }
        if (a.category!.name > b.category!.name) {
            return 1;
        }
        return 0;
    });

    return NextResponse.json({data});
}

// POST Create Subcategory
export async function POST(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const {name, category} = await req.json();
    if (!name || !category) {
        return NextResponse.json({error: "Name and Category ID are required"}, {status: 400});
    }
    const supabase = await createClient();
    const {data, error} = await supabase
        .from("subcategory")
        .insert({name, category})
        .select("*");
    if (error) {
        return handleSupabaseError(error);
    }
    return NextResponse.json({data}, {status: 201});
}

// DELETE Subcategory
export async function DELETE(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const {searchParams} = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
        return NextResponse.json({error: "Subcategory ID is required"}, {status: 400});
    }
    const supabase = await createClient();
    const {count: questionCount, error: checkError} = await supabase
        .from("question")
        .select("*", {count: "exact"})
        .eq("subcategory", id);
    if (checkError || (questionCount && questionCount > 0)) {
        return NextResponse.json({error: "Cannot delete subcategory with connected questions"}, {status: 400});
    }
    const {error} = await supabase.from("subcategory").delete().eq("id", id);
    if (error) {
        return handleSupabaseError(error);
    }
    return NextResponse.json({message: "Subcategory deleted successfully"});
}

// PUT Update Subcategory
export async function PUT(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Expect `id, name, category, priority` from the request body
    const { id, name, category, priority } = await req.json();

    // Validate that they are all provided (treat `priority===0` as valid)
    if (!id || !name || !name.trim() || !category || priority == null) {
        return NextResponse.json(
            { error: "Subcategory ID, name, category, and priority are required" },
            { status: 400 }
        );
    }

    const supabase = await createClient();

    // Run the update
    const { error } = await supabase
        .from("subcategory")
        .update({ name, category, priority })
        .eq("id", id);

    if (error) {
        return handleSupabaseError(error);
    }
    return NextResponse.json({ message: "Subcategory updated successfully" });
}
