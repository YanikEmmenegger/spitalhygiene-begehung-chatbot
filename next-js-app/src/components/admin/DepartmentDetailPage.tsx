'use client';

import {FC, useState} from "react";
import DepartmentQuestions from "@/components/admin/DepartmentQuestion";
import DepartmentInfo from "@/components/admin/DepartmentInfo";

interface DepartmentDetailPageProps {
    id: string;
}

const DepartmentDetailPage: FC<DepartmentDetailPageProps> = ({id}) => {
    const [error, setError] = useState<string | null>(null);


    return (
        <div className="container mx-auto py-4 space-y-6">
            <h1 className="text-2xl font-bold">Abteilungsdetails</h1>

            {/* Display errors */}
            {error && <div className="text-red-500 mb-4">{error}</div>}

            {/* Department Name Section */}
            <DepartmentInfo id={id} setError={setError}/>

            {/* Connected Questions Section */}
            <DepartmentQuestions departmentId={id} setError={setError}/>
        </div>
    );
};

export default DepartmentDetailPage;
