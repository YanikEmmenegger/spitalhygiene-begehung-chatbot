'use client';

import React from 'react';
import Table from '@/components/Table';
import {Question} from '@/types';
import Button from '@/components/Button';
import ConfirmDelete from '@/components/ConfirmDelete';

interface QuestionTableProps {
    questions: Question[];
    loading: boolean;
    deletingId: number | null;
    onEdit: (question: Question) => void;
    onDelete: (id: number) => void;
    emptyMessage?: string;
    showEdit?: boolean;
}

const QuestionTable: React.FC<QuestionTableProps> = ({
                                                         questions,
                                                         loading,
                                                         deletingId,
                                                         onEdit,
                                                         onDelete,
                                                         showEdit = true,
                                                         emptyMessage = "Keine Fragen verfügbar."
                                                     }) => {
    return (
        <Table
            data={questions}
            columns={[
                {header: 'Name', accessor: (item) => item.question},
                {header: 'Kategorie', accessor: (item) => item.subcategory.category.name},
                {header: 'Unterkategorie', accessor: (item) => item.subcategory.name},
                {header: 'Typ', accessor: (item) => item.type || 'N/A'},
                {header: 'Kritisch', accessor: (item) => (item.critical ? 'Ja' : 'Nein')},
            ]}
            actions={(item) => (
                <div className="flex gap-2 justify-end items-center">
                    {
                        showEdit && (
                            <Button onClick={() => onEdit(item)}>
                                Bearbeiten
                            </Button>
                        )
                    }
                    <ConfirmDelete
                        onDelete={() => onDelete(item.id)}
                        text={deletingId === item.id ? 'Löschen...' : 'Löschen'}
                        confirmText="Bestätigen"
                        disabled={deletingId === item.id}
                    />
                </div>
            )}
            loading={loading}
            emptyMessage={emptyMessage}
        />
    );
};

export default QuestionTable;