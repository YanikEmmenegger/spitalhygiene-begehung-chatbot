'use client';

import Button from "@/components/Button";
import {useEffect, useState} from "react";
import axios from "axios";
import Link from "next/link";
import {usePathname} from "next/navigation";

/**
 * AdminButton Component
 *
 * This component renders an "admin" button if the current user is an admin
 * and the current path includes "begehung". The button navigates to the admin page.
 */
const AdminButton = () => {
    const [isAdmin, setIsAdmin] = useState<boolean>(false); // State to track admin status
    const [loading, setLoading] = useState<boolean>(true); // State to track loading status

    useEffect(() => {
        // Check if the current user has admin privileges
        const checkAdmin = async () => {
            try {
                const response = await axios.get('/api/auth/admin'); // API call to check admin status
                const {isAdmin} = response.data; // Destructure admin status from the response
                setIsAdmin(isAdmin); // Update admin status state
            } catch (error) {
                console.error('Error checking admin status:', error); // Log any errors
                setIsAdmin(false); // Default to non-admin if there's an error
            } finally {
                setLoading(false); // Mark loading as complete
            }
        };

        checkAdmin(); // Call the function on component mount
    }, []);

    const pathname = usePathname(); // Get the current path

    return (
        <>
            {/* Render the button only if loading is complete, the user is an admin, and the path includes "begehung" */}
            {!loading && isAdmin && pathname.includes("begehung") && (
                <Link className={"w-full"} href={"/begehung/admin"}>
                    <Button className={"w-full bg-neutral-600 hover:bg-neutral-700"}>
                        admin
                    </Button>
                </Link>
            )}
        </>
    );
};

export default AdminButton;
