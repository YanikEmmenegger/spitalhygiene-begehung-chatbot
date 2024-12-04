'use client';
import {FC, useEffect, useState} from "react";
import axios from "axios";

interface PersonTypeSelectProps {
    value: string;
    onChange: (value: string) => void;
}

const PersonTypeSelect: FC<PersonTypeSelectProps> = ({value, onChange}) => {
    const [options, setOptions] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPersonTypes = async () => {
            try {
                const response = await axios.get('/api/persontypes');
                setOptions(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching person types:", error);
                setError("Fehler beim Laden der Personentypen.");
                setLoading(false);
            }
        };

        fetchPersonTypes();
    }, []);

    return (
        <div>
            {loading ? (
                <p>Laden...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full p-3 bg-gray-100 outline-none cursor-pointer"
                >
                    {options && options.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default PersonTypeSelect;
