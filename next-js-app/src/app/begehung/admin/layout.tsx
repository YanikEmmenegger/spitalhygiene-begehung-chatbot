import type {Metadata} from "next";
import AdminChecker from "@/components/AdminChecker";
import NavigateBackButton from "@/components/NavigateBackButton";


export const metadata: Metadata = {
    title: "Admin - Begehungstool",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <div className={"w-screen h-auto min-h-screen"}>
            <div className={"container mx-auto pt-10 px-3"}>
                <NavigateBackButton/>
            </div>
            <div className={"container mx-auto py-5 px-3"}>
                <AdminChecker>
                    {children}
                </AdminChecker>
            </div>
        </div>
    );
}
