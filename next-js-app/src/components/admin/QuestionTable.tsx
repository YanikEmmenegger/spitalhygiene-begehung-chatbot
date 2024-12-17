'use client';

import React, {FC} from "react";
import ConfirmDelete from "@/components/ConfirmDelete";
import Link from "next/link";
import {Question} from "@/types";
import {twMerge} from "tailwind-merge";


interface QuestionTableProps {
    questions: Question[];
    deletingId: number | null;
    onDelete: (id: number) => void;
}

const QuestionTable: FC<QuestionTableProps> = ({
                                                   questions,
                                                   deletingId,
                                                   onDelete,
                                               }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                <tr className="bg-gray-200">
                    <th className="border p-2 text-left">Frage</th>
                    <th className="border p-2 text-left">Typ</th>
                    <th className="border p-2 text-left">Kategorie</th>
                    <th className="border p-2 text-center"></th>
                </tr>
                </thead>
                <tbody>
                {questions.map((q) => (
                    <tr key={q.id} className={twMerge("", q.critical ? "bg-amber-100" : "bg-neutral-50")}>
                        <td className="border p-2">
                            <Link href={"/begehung/admin/questions/" + q.id}>
                                <div className={"w-full"}>
                                    {q.question}
                                </div>
                            </Link>
                        </td>
                        <td className="border p-2">
                            <p>{q.type}</p>
                        </td>
                        <td className="border p-2">
                            <p className="font-bold">{q.subcategory.category.name}</p>
                            <p>{q.subcategory.name}</p>
                        </td>
                        <td className="border p-2 text-right">
                            <div className="flex justify-end items-center gap-2 w-[180px]">
                                <div className="w-[100px] flex justify-end">
                                    <ConfirmDelete
                                        onDelete={() => onDelete(q.id)}
                                        text={deletingId === q.id ? "Löschen..." : "Löschen"}
                                        disabled={deletingId === q.id}
                                        confirmText="Bestätigen"
                                    />
                                </div>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default QuestionTable;
