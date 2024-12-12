import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/utils/supabase/server";
import {handleSupabaseError} from "@/app/api/handleSupabaseError";

export async function PATCH(req: NextRequest, {params}: { params: { id: string } }) {
    console.log(`PATCH /api/departments`);
    try {
        const supabase = await createClient();

        // Parse the department ID
        const {id} = await params
        const departmentId = parseInt(id, 10);
        if (isNaN(departmentId)) {
            return NextResponse.json({error: 'Invalid department ID'}, {status: 400});
        }

        // Get the updated data from the request body
        const {name} = await req.json();

        if (!name || !name.trim()) {
            return NextResponse.json({error: 'Name is required'}, {status: 400});
        }

        // Update the department
        const {data, error: updateError} = await supabase
            .from('department')
            .update({name: name.trim()})
            .eq('id', departmentId)
            .select()
            .single();

        if (updateError) {
            return handleSupabaseError(updateError);
        }

        return NextResponse.json({data}, {status: 200});
    } catch (e) {
        console.error('Error updating department:', e);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}

export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }
) {
    console.log(`DELETE /api/departments/`);
    try {
        const supabase = await createClient();

        // Check if user is an admin (if needed)
        // Ensure isAdmin function is defined inside the handler or pass params if outside
        const {id} = await params
        const departmentId = parseInt(id, 10);
        if (isNaN(departmentId)) {
            return NextResponse.json({error: 'Invalid department ID'}, {status: 400});
        }

        // Proceed with deletion
        const {error: deleteError} = await supabase
            .from('department')
            .delete()
            .eq('id', departmentId)


        if (deleteError) {
            console.log('Error deleting department:', deleteError);
            return handleSupabaseError(deleteError);
        }
        const {data} = await supabase.from('department').select('*').eq('id', departmentId)
        if (data && data.length > 0) {
            return NextResponse.json({error: 'Department not deleted'}, {status: 500});
        }

        return NextResponse.json({message: 'Department deleted'}, {status: 200});
    } catch (e) {
        console.error('Error deleting department:', e);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}
