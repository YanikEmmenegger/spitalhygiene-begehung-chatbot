import {NextResponse} from 'next/server'
import {createClient} from '@/utils/supabase/server'
import {swaggerYaml} from "@/app/api/doc/swaggerYaml";

export async function GET() {
    const supabase = await createClient()
    const {data: {session}, error} = await supabase.auth.getSession()
    if (!session || error) {
        return new NextResponse('Unauthorized', {status: 401})
    }

    return new NextResponse(swaggerYaml, {
        status: 200,
        headers: {
            'Content-Type': 'text/yaml; charset=utf-8',
        },
    })
}
