import {NextRequest, NextResponse} from 'next/server';
import {createClient} from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
    console.log('GET /api/questions/');
    const supabase = await createClient();

    // Get parameters
    const {searchParams} = new URL(req.url);
    const department = searchParams.get('department');
    const exclude = searchParams.get('exclude')?.split(';') || [];

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

    let questionIds: number[] = [];

    if (departmentId !== null) {
        // Fetch question IDs associated with the department
        const {data: questionIdsData, error: questionIdsError} = await supabase
            .from('department_question')
            .select('question_id')
            .eq('department_id', departmentId);

        if (questionIdsError) {
            console.error('Error fetching question IDs:', questionIdsError);
            return NextResponse.json({error: questionIdsError.message}, {status: 500});
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
        category:category (
          id,
          name
        )
      ),
      departments:department (
        id,
        name
      )
    `)
        .not('id', 'in', excludeIds);

    if (departmentId !== null) {
        if (questionIds.length > 0) {
            query = query.in('id', questionIds);
        } else {
            // No questions associated with the department
            return NextResponse.json({data: []}, {status: 200});
        }
    }

    const {data: questionsData, error} = await query;

    if (error) {
        console.error('Error fetching questions:', error);
        return NextResponse.json({error: error.message}, {status: 500});
    }

    return NextResponse.json({data: questionsData}, {status: 200});
}
