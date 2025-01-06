'use client';

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Department, Question, Review, ReviewItem } from "@/types";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/auth-js";
import { addReview } from "@/indexedDB/indexedDBService";
import RadioButton from "@/components/RadioButton";
import Button from "@/components/Button";

export default function Home() {
    // State for managing fetched departments
    const [departments, setDepartments] = useState<Department[] | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [errorDepartment, setErrorDepartment] = useState<string | null>(null);
    const [loadingDepartments, setLoadingDepartments] = useState<boolean>(true);

    // State for managing review creation
    const [creatingReview, setCreatingReview] = useState(false);

    // State for the currently logged-in user
    const [user, setUser] = useState<User | null>(null);

    const router = useRouter();

    // Fetch user details from Supabase
    const fetchUser = async () => {
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        setUser(user);
    };

    // Fetch the list of departments
    const fetchDepartments = async () => {
        setLoadingDepartments(true);
        setErrorDepartment(null);

        try {
            const response = await axios.get('/api/departments');
            if (response.status === 200) {
                setDepartments(response.data.data);
            } else {
                setErrorDepartment('Fehler beim Abrufen der Abteilungen.');
            }
        } catch (e: unknown) {
            const axiosError = e as AxiosError;
            setErrorDepartment(axiosError.message || 'An error occurred while fetching departments.');
            console.error(axiosError);
        } finally {
            setLoadingDepartments(false);
        }
    };

    // Fetch user and department data on mount
    useEffect(() => {
        fetchUser();
        fetchDepartments();
    }, []);

    // Handle the "Next" button click
    const handleNext = async () => {
        setCreatingReview(true);

        if (!selectedDepartment) {
            setCreatingReview(false);
            setErrorDepartment('Bitte wählen Sie eine Abteilung aus.');
            return;
        }

        const reviewItems: ReviewItem[] = [];

        try {
            const response = await axios.get(`/api/questions?department=${selectedDepartment.id}`);
            console.log('FETCHING /api/questions?department=' + selectedDepartment.id);

            if (response.status === 200) {
                const questions = response.data.data;

                // Map questions to review items
                reviewItems.push(...questions.map((question: Question): ReviewItem => ({
                    _id: uuidv4(),
                    question,
                    status: 'not reviewed',
                    persons: []
                })));

                const uuid = uuidv4();

                // Create the review object
                const reviewData: Review = {
                    _id: uuid,
                    department: selectedDepartment,
                    date: new Date().toISOString(),
                    reviewer: user?.email || 'Unknown',
                    status: 'incomplete',
                    reviewItems: reviewItems,
                };

                // Save the review locally
                const createReviewResponse = await addReview(reviewData);
                if (createReviewResponse) {
                    console.log('Review created successfully');
                }

                // Navigate to the review page
                router.replace(`/begehung/review/${uuid}`);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center gap-4 p-4">
            {/* Header */}
            <div className="w-full max-w-md">
                <h1 className="text-2xl text-center font-semibold mb-4">Bitte Abteilung auswählen</h1>

                {/* Loading, Error, and Departments */}
                {loadingDepartments ? (
                    <p className="text-gray-500">Laden der Abteilungen...</p>
                ) : errorDepartment ? (
                    <p className="text-red-500 font-medium">{errorDepartment}</p>
                ) : departments && departments.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {/* Render Radio Buttons for Departments */}
                        {departments.map((department, index) => (
                            <RadioButton
                                key={`department-${index}`}
                                label={department.name}
                                value={department.name}
                                checked={selectedDepartment === department}
                                disabled={creatingReview}
                                onChange={() => setSelectedDepartment(department)}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Keine Abteilungen verfügbar.</p>
                )}
            </div>

            {/* Next Button */}
            <Button
                className="max-w-md mt-2 w-full text-2xl"
                onClick={handleNext}
                disabled={!selectedDepartment || creatingReview}
            >
                {creatingReview ? 'Erstelle Begehung...' : 'Weiter'}
            </Button>
        </div>
    );
}
