'use client';

import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import {Question, QUESTION_TYPES} from "@/types";

interface QuestionFilterProps {
    questions: Question[];
    onFilter: (filteredData: Question[]) => void;
}



const QuestionFilter: React.FC<QuestionFilterProps> = ({ questions, onFilter }) => {
    const [search, setSearch] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
    const [selectedType, setSelectedType] = useState<string>("");

    const [categories, setCategories] = useState<string[]>([]);
    const [subcategories, setSubcategories] = useState<string[]>([]);

    // Extrahiere Kategorien und Unterkategorien dynamisch
    useEffect(() => {
        const uniqueCategories = new Set<string>();
        const uniqueSubcategories = new Set<string>();

        questions.forEach((q) => {
            uniqueCategories.add(q.subcategory.category.name);
            uniqueSubcategories.add(q.subcategory.name);
        });

        setCategories(Array.from(uniqueCategories));
        setSubcategories(Array.from(uniqueSubcategories));
    }, [questions]);

    // Filter anwenden
    const handleFilter = () => {
        let filtered = questions;

        if (search) {
            filtered = filtered.filter((q) =>
                q.question.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(
                (q) => q.subcategory.category.name === selectedCategory
            );
        }

        if (selectedSubcategory) {
            filtered = filtered.filter(
                (q) => q.subcategory.name === selectedSubcategory
            );
        }

        if (selectedType) {
            filtered = filtered.filter((q) => q.type === selectedType);
        }

        onFilter(filtered);
    };

    // Filter zurücksetzen
    const resetFilters = () => {
        setSearch("");
        setSelectedCategory("");
        setSelectedSubcategory("");
        setSelectedType("");
        onFilter(questions);
    };

    return (
        <div className="p-4 rounded-md shadow-md bg-neutral-50 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Fragen filtern</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Suchfeld */}
                <div>
                    <label className="block text-sm font-medium">Frage suchen</label>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border p-2 rounded-md w-full"
                        placeholder="Frage eingeben..."
                    />
                </div>

                {/* Kategorie Filter */}
                <div>
                    <label className="block text-sm font-medium">Kategorie</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border p-2 rounded-md w-full"
                    >
                        <option value="">Alle Kategorien</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Unterkategorie Filter */}
                <div>
                    <label className="block text-sm font-medium">Unterkategorie</label>
                    <select
                        value={selectedSubcategory}
                        onChange={(e) => setSelectedSubcategory(e.target.value)}
                        className="border p-2 rounded-md w-full"
                    >
                        <option value="">Alle Unterkategorien</option>
                        {subcategories.map((sub) => (
                            <option key={sub} value={sub}>
                                {sub}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Frage Typ Filter */}
                <div>
                    <label className="block text-sm font-medium">Fragentyp</label>
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="border p-2 rounded-md w-full"
                    >
                        <option value="">Alle Fragentypen</option>
                        {QUESTION_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Filter Buttons */}
            <div className="mt-4 flex gap-2">
                <Button onClick={handleFilter} className="bg-lightGreen hover:bg-darkGreen">
                    Filtern
                </Button>
                <Button
                    onClick={resetFilters}
                    className="bg-gray-300 hover:bg-gray-400"
                >
                    Filter aufheben
                </Button>
            </div>
        </div>
    );
};

export default QuestionFilter;
