'use client';

import React, {KeyboardEvent, useState} from 'react';
import Button from '@/components/Button';
import {SubCategory} from '@/types';

interface QuestionFilterProps {
    subcategories: SubCategory[];
    onFilterChange: (filters: {
        search?: string;
        category?: number;
        subcategory?: number;
        critical?: boolean;
    }) => void;
}

const QuestionFilter: React.FC<QuestionFilterProps> = ({subcategories, onFilterChange}) => {
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>('');
    const [subcategoryId, setSubcategoryId] = useState<number | ''>('');
    const [critical, setCritical] = useState<boolean>(false);

    // Derive categories from subcategories
    const categoriesMap = subcategories.reduce((acc: { [catId: number]: string }, sc) => {
        acc[sc.category.id] = sc.category.name;
        return acc;
    }, {});
    const categories = Object.entries(categoriesMap).map(([id, name]) => ({id: Number(id), name}));

    // Filter subcategories by selected category
    const filteredSubcategories = categoryId
        ? subcategories.filter(sc => sc.category.id === categoryId)
        : subcategories;

    const handleSearch = () => {
        const filters: { search?: string; category?: number; subcategory?: number; critical?: boolean } = {};
        if (search.trim()) filters.search = search.trim();
        if (subcategoryId) {
            filters.subcategory = subcategoryId as number;
        } else if (categoryId) {
            filters.category = categoryId as number;
        }
        if (critical) filters.critical = true;

        onFilterChange(filters);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const resetFilters = () => {
        setSearch('');
        setCategoryId('');
        setSubcategoryId('');
        setCritical(false);
        onFilterChange({});
    };

    return (
        <div className="flex flex-col md:flex-row md:items-end gap-2 my-4">
            <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Name</label>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Fragen durchsuchen..."
                    className="border rounded px-3 py-2"
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Kategorie</label>
                <select
                    value={categoryId}
                    onChange={(e) => {
                        setCategoryId(Number(e.target.value) || '');
                        // Reset subcategory if category changed
                        setSubcategoryId('');
                    }}
                    className="border rounded px-3 py-2"
                >
                    <option value="">Alle Kategorien</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Unterkategorie</label>
                <select
                    value={subcategoryId}
                    onChange={(e) => setSubcategoryId(Number(e.target.value) || '')}
                    className="border rounded px-3 py-2"
                >
                    <option value="">Alle Unterkategorien</option>
                    {filteredSubcategories.map((sc) => (
                        <option key={sc.id} value={sc.id}>
                            {sc.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Kritisch</label>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={critical}
                        onChange={(e) => setCritical(e.target.checked)}
                        className="h-4 w-4"
                    />
                    <span>Ja</span>
                </div>
            </div>

            <div className="flex gap-2 mt-4 md:mt-0">
                <Button onClick={handleSearch}>Suchen</Button>
                <Button onClick={resetFilters} className="bg-gray-300 hover:bg-gray-400">
                    Reset
                </Button>
            </div>
        </div>
    );
};

export default QuestionFilter;
