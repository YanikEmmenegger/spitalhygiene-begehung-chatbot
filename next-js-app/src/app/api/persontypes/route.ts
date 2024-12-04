import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/utils/supabase/server";
import {persons} from "@/app/api/TEMP/person";

export async function GET(req: NextRequest) {
    console.log(req)
    console.log("GET /api/persontypes/")
    const supabase = await createClient()

    //create supabase client
    //check if user is logged in
    const {data: {session},} = await supabase.auth.getSession()
    //if not logged in return 401
    if (!session) {
        return NextResponse.json(
            "Unauthorized",
            {
                status: 401
            }
        )
    } else {
        return NextResponse.json(
            {data: persons},
            {
                status: 200
            }
        )
    }
}
