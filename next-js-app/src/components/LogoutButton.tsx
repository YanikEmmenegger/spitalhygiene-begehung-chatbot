'use client'

import Button from "@/components/Button";

const LogoutButton = () => {

    const handleLogout = async () => {
        console.log("Logging out")
    }

    return (
        <form className={"md:w-auto w-[90%] md:absolute md:bottom-5 md:right-5"} action={"/api/auth/signout"} method="post">
            <Button className={"w-full"} onClick={() => handleLogout()} red>Logout</Button>
        </form>
    );
}

export default LogoutButton;
