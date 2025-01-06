// app/swagger-docs/page.tsx (example path)

import 'swagger-ui-react/swagger-ui.css'
import SwaggerUI from "swagger-ui-react";

export default async function SwaggerDocsPage() {

    return (
        <div style={{minHeight: '100vh'}}>
            <SwaggerUI url="/api/doc"/>
        </div>
    )
}
