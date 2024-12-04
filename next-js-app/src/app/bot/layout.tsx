import type {Metadata} from "next";
import Header from "@/components/Header";
import Disclaimer from "@/components/Disclaimer";


export const metadata: Metadata = {
    title: "Spitalhygiene - Begehungstool",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="flex flex-col h-screen">

                <Disclaimer/>
                <Header link={"/"}/>
                {children}
            </div>
        </>
    );
}
