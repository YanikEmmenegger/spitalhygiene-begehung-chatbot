'use client'

import Button from "@/components/Button";
import Link from "next/link";

const LogoutButton = () => {

    const handleLogout = async () => {
        console.log("Logging out")
    }

    return (
        <div className={"flex flex-col md:flex-row gap-2 md:w-auto w-[90%] absolute bottom-5 md:right-5"}>
            <Link className={"w-full"} href={"/"}>
                <Button className={"w-full"}>
                    Hauptmenu
                </Button>
            </Link>
            <form className={""} action={"/api/auth/signout"} method="post">
            <Button className={"w-full"} onClick={() => handleLogout()} red>Logout</Button>
        </form>

        </div>
    );
}

export default LogoutButton;
