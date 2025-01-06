'use client';

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/image";

export default function Home() {
    const router = useRouter();

    // Redirect to the last visited page or a default page on component mount
    useEffect(() => {
        const lastVisited = Cookies.get('lastVisited'); // Get the 'lastVisited' cookie value

        if (lastVisited) {
            console.log(`Last visited page: ${lastVisited}`);
            router.replace(`/${lastVisited}`); // Redirect to the last visited page
        } else {
            console.log("No last visited page");
            // Set 'lastVisited' cookie to a default page ('bot') and redirect
            Cookies.set('lastVisited', 'bot');
            router.replace('/bot');
        }
    }, [router]); // Dependency array ensures this effect runs when `router` changes

    return (
        <div className="w-screen h-screen flex flex-col gap-5 justify-center items-center">
            {/* Logo */}
            <Image src={'/Logo.svg'} alt={"Logo"} width={200} height={200} />

            {/* Loading spinner */}
            <AiOutlineLoading className="animate-spin" size={20} />
        </div>
    );
}
