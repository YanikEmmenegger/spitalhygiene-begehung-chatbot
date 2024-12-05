import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
    console.log(req)
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
