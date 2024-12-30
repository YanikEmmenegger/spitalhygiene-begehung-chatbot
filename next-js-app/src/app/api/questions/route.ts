import {NextRequest, NextResponse} from 'next/server';
import {createClient} from '@/utils/supabase/server';
import {handleSupabaseError} from "@/app/api/handleSupabaseError";
import {isAdmin} from "@/app/api/utils/adminCheck";

export async function GET(req: NextRequest) {
    console.log('GET /api/questions/');
    const supabase = await createClient();

    // Get parameters
    const { searchParams } = new URL(req.url);
    const department = searchParams.get('department');
    const exclude = searchParams.get('exclude')?.split(';') || [];
    const search = searchParams.get('search') || '';
    const id = searchParams.get('id'); // NEW: Search by ID

    // Convert exclude IDs to numbers
    const formatIds = (ids: Array<string | number>): string => {
        const filteredIds = ids
            .filter((id): id is string | number => {
                return id !== '' && id !== 'NaN' && !isNaN(Number(id));
            })
            .map(id => Number(id));

        return `(${filteredIds.join(', ')})`;
    };

    const excludeIds = formatIds(exclude);

    let departmentId: number | null = null;
    if (department !== null && !isNaN(Number(department))) {
        departmentId = Number(department);
    }

    let questionIds: number[] = [];
    if (departmentId !== null) {
        // Fetch question IDs associated with the department
        const { data: questionIdsData, error: questionIdsError } = await supabase
            .from('department_question')
            .select('question_id')
            .eq('department_id', departmentId);

        if (questionIdsError) {
            console.error('Error fetching question IDs:', questionIdsError);
            return NextResponse.json({ error: questionIdsError.message }, { status: 500 });
        }

        questionIds = questionIdsData.map((item) => item.question_id);
    }

    // Build the query to fetch questions
    let query = supabase
        .from('question')
        .select(`
          id,
          question,
          critical,
          type,
          subcategory:subcategory (
            id,
            name,
            priority,
            category:category (
              id,
              name, 
              priority
            )
          )
        `)
        .not('id', 'in', excludeIds)//.order('category.priority', { ascending: true });

    // NEW: If "id" parameter exists, filter by ID
    if (id) {
        query = query.eq('id', id);
    }

    // Search by question text
    if (search) {
        query = query.ilike('question', `%${search}%`);
    }

    // Filter by department
    if (departmentId !== null) {
        if (questionIds.length > 0) {
            query = query.in('id', questionIds);
        } else {
            // No questions associated with the department
            return NextResponse.json({ data: [] }, { status: 200 });
        }
    }

    const { data: questionsData, error } = await query;

    if (error) {
        console.error('Error fetching questions:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    //order by category priority then by subcategory priority
    questionsData.sort((a, b) => {
        if (a.subcategory!.category!.priority === b.subcategory!.category!.priority) {
            return a.subcategory!.priority - b.subcategory!.priority;
        }
        return a.subcategory!.category!.priority - b.subcategory!.category!.priority;
    });

    return NextResponse.json({ data: questionsData }, { status: 200 });
}
// POST Create Question

export async function POST(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const {question, critical, subcategory, type} = await req.json();
    if (!question || !subcategory) {
        return NextResponse.json({error: "Question and Subcategory are required"}, {status: 400});
    }
    const supabase = await createClient();
    const {data, error} = await supabase
        .from("question")
        .insert({question, critical, subcategory, type})
        .select("*");
    if (error) {
        return handleSupabaseError(error);
    }
    return NextResponse.json({data}, {status: 201});
}

// DELETE Question
export async function DELETE(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const {searchParams} = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
        return NextResponse.json({error: "Question ID is required"}, {status: 400});
    }
    const supabase = await createClient();
    const {count: questionCount, error: checkError} = await supabase
        .from("department_question")
        .select("*", {count: "exact"})
        .eq("question_id", id);
    if (checkError || (questionCount && questionCount > 0)) {
        return NextResponse.json({error: "Cannot delete question with connected departments"}, {status: 400});
    }
    const {error} = await supabase.from("question").delete().eq("id", id);
    if (error) {
        return handleSupabaseError(error);
    }
    return NextResponse.json({message: "Question deleted successfully"});
}

// PUT Update Question
export async function PUT(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const {id, question, critical, subcategory, type} = await req.json();
    if (!id || !question || !subcategory) {
        return NextResponse.json(
            {error: "Question ID, Question text, and Subcategory are required"},
            {status: 400}
        );
    }
    const supabase = await createClient();
    const {error} = await supabase
        .from("question")
        .update({question, critical, subcategory, type})
        .eq("id", id);
    if (error) {
        return handleSupabaseError(error);
    }
    return NextResponse.json({message: "Question updated successfully"});
}
