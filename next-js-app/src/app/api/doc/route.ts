import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
    const filePath = path.join(process.cwd(), 'docs', 'swagger.yaml') // or wherever your file is
    let yamlContent: string

    try {
        yamlContent = fs.readFileSync(filePath, 'utf8')
    } catch (error) {
        console.error('Error reading swagger.yaml:', error)
        return new NextResponse('Unable to read swagger file', { status: 500 })
    }

    // Return as YAML
    return new NextResponse(yamlContent, {
        status: 200,
        headers: {
            'Content-Type': 'text/yaml; charset=utf-8',
        },
    })
}
