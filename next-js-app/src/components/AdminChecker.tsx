'use client';

import {FC, useEffect, useState} from 'react';
import axios from 'axios';

/**
 * AdminChecker Component
 *
 * This component checks if the current user has admin privileges and conditionally renders
 * its children or an error message based on the admin status.
 */

interface AdminCheckerProps {
    children: React.ReactNode; // The content to render if the user is an admin
}

const AdminChecker: FC<AdminCheckerProps> = ({children}) => {
    const [isAdmin, setIsAdmin] = useState<boolean>(false); // Tracks whether the user is an admin
    const [loading, setLoading] = useState<boolean>(true); // Tracks the loading state

    useEffect(() => {
        // Fetch admin status from the server
        const checkAdmin = async () => {
            try {
                const response = await axios.get('/api/auth/admin'); // API call to check admin privileges
                const {isAdmin} = response.data; // Extract isAdmin flag from the response
                setIsAdmin(isAdmin); // Update admin status state
            } catch (error) {
                console.error('Error checking admin status:', error); // Log any errors
                setIsAdmin(false); // Default to non-admin on error
            } finally {
                setLoading(false); // Mark loading as complete
            }
        };

        checkAdmin(); // Trigger the admin check when the component mounts
    }, []);

    return (
        <>
            {loading ? (
                <div>Lade...</div> // Show loading state while fetching admin status
            ) : isAdmin ? (
                <div>{children}</div> // Render children if the user is an admin
            ) : (
                <div>Zugriff verweigert - Bitte melde dich bei deinem Vorgesetzten für den Zugriff</div> // Render access denied message if not an admin
            )}
        </>
    );
};

export default AdminChecker;
