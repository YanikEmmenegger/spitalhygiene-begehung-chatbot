import type { Metadata } from "next";
import Header from "@/components/Header";
import Disclaimer from "@/components/Disclaimer";

// Page metadata for SEO and browser display
export const metadata: Metadata = {
    title: "Spitalhygiene - Begehungstool", // Title displayed in the browser tab
};

// RootLayout component: Provides a consistent layout for pages
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode; // The child components or pages to be rendered
}>) {
    return (
        <>
            {/* Main layout container */}
            <div className="flex flex-col h-screen">
                {/* Disclaimer component */}
                <Disclaimer />

                {/* Header component with a link to the home page */}
                <Header link={"/"} />

                {/* Render the child components or pages */}
                {children}
            </div>
        </>
    );
}
