import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { handleSupabaseError } from '@/app/api/handleSupabaseError';
import { isAdmin } from '@/app/api/utils/adminCheck';

// GET Questions
export async function GET(req: NextRequest) {
    console.log('GET /api/questions/');
    const supabase = await createClient();

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const department = searchParams.get('department');
    const exclude = searchParams.get('exclude')?.split(';') || [];
    const search = searchParams.get('search') || '';
    const id = searchParams.get('id'); // Filter by specific question ID

    // Convert exclude IDs to a formatted list
    const formatIds = (ids: Array<string | number>): string => {
        const filteredIds = ids
            .filter((id): id is string | number => id !== '' && id !== 'NaN' && !isNaN(Number(id)))
            .map((id) => Number(id));

        return `(${filteredIds.join(', ')})`;
    };

    const excludeIds = formatIds(exclude);

    let departmentId: number | null = null;
    if (department !== null && !isNaN(Number(department))) {
        departmentId = Number(department);
    }

    // Fetch question IDs associated with the department, if specified
    let questionIds: number[] = [];
    if (departmentId !== null) {
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
      priority,
      link_name,
      link_url,
      subcategory:subcategory (
        id,
        name,
        priority,
        link_name,
        link_url,
        category:category (
          id,
          name,
          priority
        )
      )
    `)
        .not('id', 'in', excludeIds); // Exclude specific question IDs

    if (id) {
        query = query.eq('id', id); // Filter by specific ID
    }

    if (search) {
        query = query.ilike('question', `%${search}%`); // Search by question text
    }

    if (departmentId !== null) {
        if (questionIds.length === 0) {
            return NextResponse.json({ data: [] }, { status: 200 }); // Early return if no questions
        }
        query = query.in('id', questionIds); // Filter by department's question IDs
    }

    const { data: questionsData, error } = await query;
    if (error) {
        console.error('Error fetching questions:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Sort questions by Category > Subcategory > Question priority
    questionsData.sort((a, b) => {
        const catDiff = a.subcategory!.category!.priority - b.subcategory!.category!.priority;
        if (catDiff !== 0) return catDiff;

        const subcatDiff = a.subcategory!.priority - b.subcategory!.priority;
        if (subcatDiff !== 0) return subcatDiff;

        return (a.priority ?? 0) - (b.priority ?? 0);
    });

    return NextResponse.json({ data: questionsData }, { status: 200 });
}

// POST Create Question
export async function POST(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { question, critical, subcategory, type, priority, link_name, link_url } = await req.json();

    if (!question || !subcategory) {
        return NextResponse.json(
            { error: 'Question and Subcategory are required' },
            { status: 400 }
        );
    }

    const insertData = {
        question,
        critical: !!critical,
        subcategory,
        type: type ?? null,
        priority: priority ?? 0,
        link_name: link_name ?? null,
        link_url: link_url ?? null,
    };

    const supabase = await createClient();
    const { data, error } = await supabase.from('question').insert(insertData).select('*');

    if (error) {
        return handleSupabaseError(error);
    }

    return NextResponse.json({ data }, { status: 201 });
}

// DELETE Question
export async function DELETE(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
        return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Check for connected departments
    const { count: questionCount, error: checkError } = await supabase
        .from('department_question')
        .select('*', { count: 'exact' })
        .eq('question_id', id);

    if (checkError || (questionCount && questionCount > 0)) {
        return NextResponse.json(
            { error: 'Cannot delete question with connected departments' },
            { status: 400 }
        );
    }

    const { error } = await supabase.from('question').delete().eq('id', id);
    if (error) {
        return handleSupabaseError(error);
    }

    return NextResponse.json({ message: 'Question deleted successfully' });
}

// PUT Update Question
export async function PUT(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { id, question, critical, subcategory, type, priority, link_name, link_url } = await req.json();

    if (!id || !question || !subcategory) {
        return NextResponse.json(
            { error: 'Question ID, Question text, and Subcategory are required' },
            { status: 400 }
        );
    }

    const updateData = {
        question,
        critical: !!critical,
        subcategory,
        type: type ?? null,
        priority: priority ?? 0,
        link_name: link_name ?? null,
        link_url: link_url ?? null,
    };

    const supabase = await createClient();
    const { error } = await supabase.from('question').update(updateData).eq('id', id);

    if (error) {
        return handleSupabaseError(error);
    }

    return NextResponse.json({ message: 'Question updated successfully' });
}
