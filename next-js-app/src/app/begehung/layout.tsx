import type { Metadata } from "next";
import Header from "@/components/Header";

// Page metadata for SEO and display in browser
export const metadata: Metadata = {
    title: "Spitalhygiene - Begehungstool", // Title displayed in the browser tab
};

// RootLayout component to wrap pages with a consistent structure
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode; // The child components or pages to be rendered
}>) {
    return (
        <>
            {/* Header component for navigation or branding */}
            <Header link={"/begehung"} />
            {/* Render the child components or pages */}
            {children}
        </>
    );
}
