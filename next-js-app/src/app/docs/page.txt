'use client';

import React from 'react';
import 'swagger-ui-react/swagger-ui.css';
import SwaggerUI from 'swagger-ui-react';
import yaml from 'js-yaml';
import {swaggerYaml} from "@/lib/swaggerYaml";


export default function SwaggerDocPage() {
    // Assert that the result is an object
    const specObject = yaml.load(swaggerYaml) as Record<string, never>;

    return (
        <main style={{ padding: '1rem' }}>
            <h1>Begehungstool API Docs</h1>
            <SwaggerUI spec={specObject} />
        </main>
    );
}
