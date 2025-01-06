// app/swagger-docs/page.tsx (example path)

import 'swagger-ui-react/swagger-ui.css'
import SwaggerUI from "swagger-ui-react";
import AdminChecker from "@/components/AdminChecker";

export default async function SwaggerDocsPage() {

    return (
        <AdminChecker>
        <div style={{minHeight: '100vh'}}>
            <SwaggerUI url="/api/doc"/>
        </div>
        </AdminChecker>
    )
}
