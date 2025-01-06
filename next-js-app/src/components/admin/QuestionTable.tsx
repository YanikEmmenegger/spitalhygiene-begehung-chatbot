'use client';

import React from 'react';
import Table from '@/components/Table';
import Button from '@/components/Button';
import ConfirmDelete from '@/components/ConfirmDelete';
import { Question } from '@/types';

interface QuestionTableProps {
    questions: Question[]; // List of questions to display
    loading: boolean; // Loading state for the table
    deletingId: number | null; // ID of the question being deleted
    onEdit: (question: Question) => void; // Callback for editing a question
    onDelete: (id: number) => void; // Callback for deleting a question
    emptyMessage?: string; // Message to show when no data is available
    showEdit?: boolean; // Flag to control whether the edit button is shown
}

const QuestionTable: React.FC<QuestionTableProps> = ({
                                                         questions,
                                                         loading,
                                                         deletingId,
                                                         onEdit,
                                                         onDelete,
                                                         showEdit = true, // Default: show the edit button
                                                         emptyMessage = 'Keine Fragen verfügbar.', // Default empty message
                                                     }) => {
    return (
        <Table
            data={questions} // Pass the questions to the table
            columns={[
                // Define the columns for the table
                { header: 'Frage', accessor: item => item.question },
                { header: 'Kategorie', accessor: item => item.subcategory.category.name },
                { header: 'Unterkategorie', accessor: item => item.subcategory.name },
                { header: 'Typ', accessor: item => item.type || 'N/A' },
                { header: 'Kritisch', accessor: item => (item.critical ? 'Ja' : 'Nein') },
                { header: 'Priorität', accessor: item => item.priority ?? 0 },
                {
                    header: 'Link', // Optional link column
                    accessor: item => {
                        if (!item.link_url) return ''; // No link
                        if (item.link_name) {
                            return `${item.link_name} (${item.link_url})`; // Show link name and URL
                        }
                        return item.link_url; // Show URL only
                    },
                },
            ]}
            actions={item => (
                <div className="flex gap-2 justify-end items-center">
                    {/* Conditionally render the edit button */}
                    {showEdit && (
                        <Button onClick={() => onEdit(item)}>
                            Bearbeiten
                        </Button>
                    )}
                    {/* Delete button with confirmation */}
                    <ConfirmDelete
                        onDelete={() => onDelete(item.id)}
                        text={deletingId === item.id ? 'Löschen...' : 'Löschen'}
                        confirmText="Bestätigen"
                        disabled={deletingId === item.id} // Disable while deleting
                    />
                </div>
            )}
            loading={loading} // Pass the loading state to the table
            emptyMessage={emptyMessage} // Message when no questions are available
        />
    );
};

export default QuestionTable;
