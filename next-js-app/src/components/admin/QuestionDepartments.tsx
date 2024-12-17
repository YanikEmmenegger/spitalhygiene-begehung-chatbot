'use client';

import React, {FC, useEffect, useState} from "react";
import axios from "axios";
import ConfirmDelete from "@/components/ConfirmDelete";
import {Department} from "@/types";

interface QuestionDepartmentsProps {
    questionId: string;
    setError: (error: string | null) => void;
}

const QuestionDepartments: FC<QuestionDepartmentsProps> = ({questionId, setError}) => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get(`/api/departments?question_id=${questionId}`);
            setDepartments(response.data.data || []);
        } catch {
            setError("Fehler beim Laden der verbundenen Abteilungen.");
        }
    };

    const unlinkDepartment = async (departmentId: number) => {
        setDeletingId(departmentId);
        try {
            await axios.delete(`/api/department_question?department_id=${departmentId}&question_id=${questionId}`);
            fetchDepartments();
        } catch {
            setError("Fehler beim Entfernen der Abteilung.");
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, [questionId]);

    return (
        <div className="p-4 rounded-md shadow-md bg-neutral-100 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Verbundene Abteilungen</h2>
            {departments.map((dept) => (
                <div key={dept.id} className="flex justify-between items-center">
                    <p>{dept.name}</p>
                    <ConfirmDelete confirmText={"Bestätigen"}
                        onDelete={() => unlinkDepartment(dept.id)}
                        text={deletingId === dept.id ? "Löschen..." : "Löschen"}
                    />
                </div>
            ))}
        </div>
    );
};

export default QuestionDepartments;
