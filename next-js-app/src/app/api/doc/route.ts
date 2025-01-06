import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
    const filePath = path.resolve(process.cwd(), 'src', 'docs', 'swagger.yaml'); // Correctly resolves the file path

    try {
        // Create a Supabase client
        const supabase = await createClient();

        // Check if the user is logged in by retrieving the session
        const { data: { session }, error } = await supabase.auth.getSession();

        // If no session exists or there's an error, return 401 Unauthorized
        if (!session || error) {
            console.error('Unauthorized access attempt:', error || 'No session found');
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Read the swagger.yaml file
        const yamlContent = await fs.readFile(filePath, 'utf8');

        // Return the YAML content if the user is authorized
        return new NextResponse(yamlContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/yaml; charset=utf-8',
            },
        });
    } catch (error) {
        console.error('Error reading swagger.yaml:', error);

        return new NextResponse('Unable to read swagger file', {
            status: 500,
        });
    }
}
