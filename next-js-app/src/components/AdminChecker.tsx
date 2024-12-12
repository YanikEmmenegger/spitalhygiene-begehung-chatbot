'use client';

import {FC, useEffect, useState} from 'react';
import axios from 'axios';

interface AdminCheckerProps {
    children: React.ReactNode;
}

const AdminChecker: FC<AdminCheckerProps> = ({children}) => {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await axios.get('/api/auth/admin');
                const {isAdmin} = response.data;
                setIsAdmin(isAdmin);
            } catch (error) {
                console.error('Error checking admin status:', error);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, []);

    return (
        <>
            {loading ? (
                <div>Lade...</div>
            ) : isAdmin ? (
                <div>{children}</div>
            ) : (
                <div>Zugriff verweigert - Bitte melde dich bei deinem Vorgesetzten für den Zugriff</div>
            )}
        </>
    );
};

export default AdminChecker;
