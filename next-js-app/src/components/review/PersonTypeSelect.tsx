'use client';
import { FC, useEffect, useState } from "react";
import axios from "axios";
import { PersonType } from "@/types";

interface PersonTypeSelectProps {
    value: string; // Current selected value
    onChange: (value: string) => void; // Callback for when the selected value changes
}

const PersonTypeSelect: FC<PersonTypeSelectProps> = ({ value, onChange }) => {
    const [options, setOptions] = useState<PersonType[]>([]); // List of person types
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    // Fetch person types on component mount
    useEffect(() => {
        const fetchPersonTypes = async () => {
            try {
                const response = await axios.get('/api/persontypes'); // API call
                setOptions(response.data.data); // Set person types
            } catch (error) {
                console.error("Error fetching person types:", error);
                setError("Fehler beim Laden der Personentypen."); // Set error message
            } finally {
                setLoading(false); // Disable loading state
            }
        };

        fetchPersonTypes();
    }, []);

    return (
        <div>
            {/* Loading state */}
            {loading ? (
                <p>Laden...</p>
            ) : error ? (
                // Error state
                <p className="text-red-500">{error}</p>
            ) : (
                // Render dropdown when data is loaded
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)} // Trigger onChange callback
                    className="w-full p-3 bg-gray-100 outline-none cursor-pointer"
                >
                    {/* Map over options to generate dropdown */}
                    {options.map((person: PersonType) => (
                        <option key={person.name} value={person.name}>
                            {person.name}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default PersonTypeSelect;
