import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/app/api/utils/adminCheck";
import { handleSupabaseError } from "@/app/api/handleSupabaseError";

// GET Subcategories
export async function GET() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("subcategory")
        // Now also select link_name, link_url
        .select("id, name, priority, link_name, link_url, category:category(*)")
        .order("priority", { ascending: true });

    if (error) {
        return handleSupabaseError(error);
    }

    // Optionally, order by category name
    data.sort((a, b) => {
        if (a.category && b.category) {
            if (a.category.name < b.category.name) {
                return -1;
            }
            if (a.category.name > b.category.name) {
                return 1;
            }
        }
        return 0;
    });

    return NextResponse.json({ data });
}

// POST Create Subcategory
export async function POST(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { name, category, priority, link_name, link_url } = await req.json();

    if (!name || !category) {
        return NextResponse.json(
            { error: "Name and Category ID are required" },
            { status: 400 }
        );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from("subcategory")
        .insert({
            name,
            category,
            priority: priority ?? 0, // default to 0 if not provided
            link_name: link_name ?? null,
            link_url: link_url ?? null,
        })
        .select("*");

    if (error) {
        return handleSupabaseError(error);
    }
    return NextResponse.json({ data }, { status: 201 });
}

// DELETE Subcategory
export async function DELETE(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
        return NextResponse.json(
            { error: "Subcategory ID is required" },
            { status: 400 }
        );
    }
    const supabase = await createClient();
    const {
        count: questionCount,
        error: checkError,
    } = await supabase
        .from("question")
        .select("*", { count: "exact" })
        .eq("subcategory", id);

    if (checkError || (questionCount && questionCount > 0)) {
        return NextResponse.json(
            { error: "Cannot delete subcategory with connected questions" },
            { status: 400 }
        );
    }
    const { error } = await supabase.from("subcategory").delete().eq("id", id);
    if (error) {
        return handleSupabaseError(error);
    }
    return NextResponse.json({ message: "Subcategory deleted successfully" });
}

// PUT Update Subcategory
export async function PUT(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, category, priority, link_name, link_url } = await req.json();

    // Validate presence of id, name, category, and priority
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
