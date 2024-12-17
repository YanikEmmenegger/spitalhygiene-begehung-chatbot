'use client';

import React, {FC, useState} from "react";
import QuestionInfo from "@/components/admin/QuestionInfo";

interface QuestionDetailPageProps {
    id: string;
}

const QuestionDetailPage: FC<QuestionDetailPageProps> = ({id}) => {
    const [error, setError] = useState<string | null>(null);

    return (
        <div className="container mx-auto py-4 space-y-6">
            <h1 className="text-2xl font-bold">Fragedetails</h1>

            {/* Display errors */}
            {error && <div className="text-red-500 mb-4">{error}</div>}

            {/* Question Information Section */}
            <QuestionInfo id={id} setError={setError}/>

            {/* Connected Departments Section */}
            {/*
            <QuestionDepartments questionId={id} setError={setError} />
            */}
        </div>
    );
};

export default QuestionDetailPage;
