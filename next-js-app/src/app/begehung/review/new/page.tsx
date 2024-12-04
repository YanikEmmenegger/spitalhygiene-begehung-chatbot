'use client';

import {useEffect, useState} from "react";
import axios, {AxiosError} from "axios";

import {Question, Review, ReviewItem} from "@/types";
import {v4 as uuidv4} from 'uuid';
import {useRouter} from "next/navigation";
import {createClient} from "@/utils/supabase/client";
import {User} from "@supabase/auth-js";
import {addReview} from "@/indexedDB/indexedDBService";
import RadioButton from "@/components/RadioButton";
import Button from "@/components/Button";


export default function Home() {
    const [departments, setDepartments] = useState<string[] | null>(null);
    const [locations, setLocations] = useState<string[] | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [errorDepartment, setErrorDepartment] = useState<string | null>(null);
    const [errorLocation, setErrorLocation] = useState<string | null>(null);
    const [loadingDepartments, setLoadingDepartments] = useState<boolean>(true);
    const [loadingLocations, setLoadingLocations] = useState<boolean>(true);
    const [creatingReview, setCreatingReview] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const router = useRouter();


    const fetchUser = async () => {
        const supabase = await createClient()

        const {
            data: {user},
        } = await supabase.auth.getUser()
        setUser(user)
    }


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

    const fetchLocations = async () => {
        setLoadingLocations(true);
        setErrorLocation(null);
        try {
            const response = await axios.get('/api/locations');
            if (response.status === 200) {
                setLocations(response.data.data);
            } else {
                setErrorLocation('Fehler beim Abrufen der Standorte.');
            }
        } catch (e: unknown) {
            const axiosError = e as AxiosError;
            setErrorLocation(axiosError.message || 'An error occurred while fetching locations.');
            console.error(axiosError);
        } finally {
            setLoadingLocations(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
        fetchUser();
        fetchLocations();
    }, []);

    const handleNext = async () => {
        setCreatingReview(true);
        if (!selectedDepartment) {
            setCreatingReview(false);
            setErrorDepartment('Bitte wählen Sie eine Abteilung aus.');
            return;
        }
        if (!selectedLocation) {
            setCreatingReview(false);
            setErrorLocation('Bitte wählen Sie einen Standort aus.');
            return;
        }

        const reviewItems: ReviewItem[] = [];
        try {
            const response = await axios.get('/api/questions?departments=' + selectedDepartment);
            console.log('/api/questions?department=' + selectedDepartment)
            if (response.status === 200) {
                const questions = response.data.data;
                reviewItems.push(...questions.map((question: Question): ReviewItem => ({
                    question,
                    status: 'not reviewed',
                    persons: []
                })));

                const uuid = uuidv4();

                const reviewData: Review = {
                    _id: uuid,
                    department: selectedDepartment,
                    location: selectedLocation,
                    date: new Date().toISOString(),
                    reviewer: user?.email || 'Unknown',
                    status: 'incomplete',
                    reviewItems: reviewItems
                };
                const createReviewResponse = await addReview(reviewData);
                if (createReviewResponse) {
                    console.log('Review created successfully');
                }

                // Use router.push to navigate
                router.replace(`/begehung/review/${uuid}`);

            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center gap-4 p-4">
            <div className="w-full max-w-md">
                <h1 className="text-2xl font-semibold mb-4">Abteilung</h1>
                {loadingDepartments ? (
                    <p className="text-gray-500">Laden der Abteilungen...</p>
                ) : errorDepartment ? (
                    <p className="text-red-500 font-medium">{errorDepartment}</p>
                ) : departments && departments.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {departments.map((department, index) => (
                            <RadioButton
                                disabled={creatingReview}
                                key={`department-${index}`}
                                label={department}
                                value={department}
                                checked={selectedDepartment === department}
                                onChange={setSelectedDepartment}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Keine Abteilungen verfügbar.</p>
                )}

                <h1 className="text-2xl font-semibold mt-6 mb-4">Standort</h1>
                {loadingLocations ? (
                    <p className="text-gray-500">Laden der Standorte...</p>
                ) : errorLocation ? (
                    <p className="text-red-500 font-medium">{errorLocation}</p>
                ) : locations && locations.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {locations.map((location, index) => (
                            <RadioButton
                                key={`location-${index}`}
                                disabled={creatingReview}
                                label={location}
                                value={location}
                                checked={selectedLocation === location}
                                onChange={setSelectedLocation}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Keine Standorte verfügbar.</p>
                )}
            </div>

            <Button
                className="max-w-md mt-2 w-full text-2xl"
                onClick={handleNext}
                disabled={!selectedDepartment || !selectedLocation || creatingReview}
            >
                {creatingReview ? 'Erstelle Begehung...' : 'Weiter'}
            </Button>
        </div>
    );
}
