import {NextResponse} from "next/server";
import {PostgrestError} from "@supabase/supabase-js";

export function handleSupabaseError(error: PostgrestError): NextResponse {
    console.error('Supabase Error:', error);

    if (error.code === '42501') {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    } else if (error.code === '23505') {
        return NextResponse.json({error: 'Conflict: Resource already exists'}, {status: 409});
    } else {
        return NextResponse.json({error: error.message || 'Internal Server Error'}, {status: 500});
    }
}
