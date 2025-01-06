'use client';

// Import necessary modules and hooks
import {ArrowLeft} from "lucide-react"; // For back arrow icon
import Button from "@/components/Button"; // Reusable Button component
import {useRouter} from "next/navigation"; // Router for navigation

// Component for a button that navigates back in history
const NavigateBackButton = () => {
    const router = useRouter(); // Access the Next.js router

    return (
        // Button to navigate back in browser history
        <Button onClick={router.back}>
            <ArrowLeft /> {/* Back arrow icon */}
        </Button>
    );
};

export default NavigateBackButton; // Export the component
