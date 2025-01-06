import type { Metadata } from "next";
import AdminChecker from "@/components/AdminChecker";
import NavigateBackButton from "@/components/NavigateBackButton";

// Metadata for the page, used by Next.js for SEO and document metadata
export const metadata: Metadata = {
    title: "Admin - Begehungstool", // Title displayed in the browser tab
};

// RootLayout component: Acts as a layout wrapper for admin-related pages
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode; // The child components or pages to be rendered inside this layout
}>) {
    return (
        <div className={"w-screen h-auto min-h-screen"}>
            {/* Top section with navigation controls */}
            <div className={"container mx-auto pt-10 px-3"}>
                <NavigateBackButton /> {/* Button to navigate back to the previous page */}
            </div>
            {/* Main content area with admin access check */}
            <div className={"container mx-auto py-5 px-3"}>
                <AdminChecker>
                    {children} {/* Render the children components or pages if the user passes admin check */}
                </AdminChecker>
            </div>
        </div>
    );
}
