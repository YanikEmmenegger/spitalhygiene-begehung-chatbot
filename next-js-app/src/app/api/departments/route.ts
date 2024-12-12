import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/utils/supabase/server";
import {handleSupabaseError} from "@/app/api/handleSupabaseError";

export async function GET() {
    console.log("GET /api/departments/")

    try {
        const supabase = await createClient()

        //create supabase client
        //check if user is logged in
        const {data: {user}} = await supabase.auth.getUser()
        //if not logged in return 401
        if (!user) {
            return NextResponse.json(
                "Unauthorized",
                {
                    status: 401
                }
            )
        }
        //get all departments
        const {data, error} = await supabase.from('department').select('*')
        if (error) {
            return NextResponse.json(
                error,
                {
                    status: 500
                }
            )
        }
        return NextResponse.json({data: data})
    } catch (e) {
        return NextResponse.json(
            e,
            {
                status: 500
            }
        )
    }

}


export async function POST(req: NextRequest) {
    console.log('POST /api/departments/');
    try {
        const supabase = await createClient();

        // Get the department data from the request body
        const { name } = await req.json();

        if (!name || !name.trim()) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Insert the new department
        const { data, error: insertError } = await supabase
            .from('department')
            .insert({ name: name.trim() })
            .select()
            .single();

        if (insertError) {
            return handleSupabaseError(insertError);
        }

        return NextResponse.json({ data }, { status: 201 });
    } catch (e) {
        console.error('Error adding department:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
