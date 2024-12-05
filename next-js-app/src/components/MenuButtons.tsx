'use client'

import Button from "@/components/Button";
import Link from "next/link";
import {useEffect, useState} from "react";
import axios from "axios";
import {usePathname} from "next/navigation";

const MenuButtons = () => {

    const handleLogout = async () => {
        console.log("Logging out")
    }

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
        <div className={"flex flex-col md:flex-row gap-2 md:w-auto w-[90%] absolute bottom-5 md:right-5"}>
            {(pathname.includes("begehung") || pathname.includes("bot")) && (
                <Link className={"w-full"} href={"/"}>
                    <Button className={"w-full"}>
                        Hauptmenu
                    </Button>
                </Link>
            )}
            <form className={""} action={"/api/auth/signout"} method="post">
            <Button className={"w-full"} onClick={() => handleLogout()} red>Logout</Button>
        </form>
            {!loading && isAdmin && pathname.includes("begehung") && (
                <Link className={"w-full"} href={"/begehung/admin"}>
                    <Button className={"w-full bg-neutral-600 hover:bg-neutral-700"}>
                        admin
                    </Button>
                </Link>
            )}
        </div>
    );
}

export default MenuButtons;
