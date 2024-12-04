import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/utils/supabase/server";
import {questions} from "@/app/api/TEMP/questions";


export async function GET(req: NextRequest) {
    console.log("GET /api/departments/");
    const supabase = await createClient();

    // Get parameters
    const {searchParams} = new URL(req.url);
    const departments = searchParams.get("departments")?.split(";") || [];
    const exclude = searchParams.get("exclude")?.split(";") || [];

    // Check if the user is logged in
    const {data: {session}} = await supabase.auth.getSession();
    if (!session) {
        return NextResponse.json("Unauthorized", {status: 401});
    }

    let _questions;
    // Get questions based on departments and exclude IDs
    if (departments.length > 0) {
        _questions = questions.filter(question => {
            const matchesDepartment = question.departments.some(department => departments.includes(department));
            const isExcluded = exclude.includes(question._id);
            return matchesDepartment && !isExcluded; // Include only if it matches department and is not excluded
        });
    } else {
        // Return all questions, excluding those with IDs in the exclude list
        _questions = questions.filter(question => !exclude.includes(question._id));
    }

    return NextResponse.json({data: _questions}, {status: 200});
}
