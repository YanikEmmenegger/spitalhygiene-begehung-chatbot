'use client'

// Import necessary components and hooks
import Button from "@/components/Button"; // Custom button component
import Link from "next/link"; // Link component for navigation
import { useEffect, useState } from "react"; // React hooks
import axios from "axios"; // Axios for API requests
import { usePathname } from "next/navigation"; // Hook to get current pathname
import Cookies from "js-cookie"; // For managing cookies

const MenuButtons = () => {

    // Function to handle logout functionality
    const handleLogout = async () => {
        console.log("Logging out") // Placeholder for logout logic
    }

    // State to track admin status and loading state
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    // Check admin status on component mount
    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await axios.get('/api/auth/admin'); // API call to check admin status
                const { isAdmin } = response.data; // Extract admin status from response
                setIsAdmin(isAdmin); // Update state
            } catch (error) {
                console.error('Error checking admin status:', error); // Handle errors
                setIsAdmin(false);
            } finally {
                setLoading(false); // Set loading to false
            }
        };

        checkAdmin(); // Trigger admin check
    }, []);

    const pathname = usePathname(); // Get current pathname

    return (
        <div className={"flex flex-col md:flex-row gap-2 md:w-auto w-[90%]"}>
            {/* Link to switch between Chatbot and Internes Audit Tool */}
            <Link className={"w-full"} href={
                pathname.includes("begehung") ? "/bot" : "/begehung"
            }>
                <Button onClick={() => {
                    if (pathname.includes("begehung")) {
                        // Set cookie to remember last visited page as "bot"
                        Cookies.set('lastVisited', 'bot');
                    } else {
                        // Set cookie to remember last visited page as "begehung"
                        Cookies.set('lastVisited', 'begehung');
                    }
                }} className={"w-full"}>
                    {
                        pathname.includes("begehung") ? "Chatbot" : "Internes Audit Tool"
                    }
                </Button>
            </Link>

            {/* Logout button */}
            <form className={""} action={"/api/auth/signout"} method="post">
                <Button className={"w-full"} onClick={() => handleLogout()} red>Logout</Button>
            </form>

            {/* Admin button for admin users */}
            {!loading && isAdmin && pathname.includes("begehung") && (
                <Link className={"w-full"} href={"/begehung/admin"}>
                    <Button className={"w-full bg-neutral-600 hover:bg-neutral-700"}>
                        Admin
                    </Button>
                </Link>
            )}
        </div>
    );
}

export default MenuButtons; // Export the component
