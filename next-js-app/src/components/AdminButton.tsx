'use client'
import Button from "@/components/Button";
import {useEffect, useState} from "react";
import axios from "axios";
import Link from "next/link";
import {usePathname} from "next/navigation";

const AdminButton = () => {

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

    const pathname = usePathname()


    return (
        <>
            {!loading && isAdmin && pathname.includes("begehung") && (
                <Link className={"w-full"} href={"/begehung/admin"}>
                        <Button className={"w-full bg-neutral-600 hover:bg-neutral-700"} >
                            admin
                        </Button>
                </Link>
            )}
        </>
    )
}

export default AdminButton;
