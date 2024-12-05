import type {Metadata} from "next";
import Header from "@/components/Header";


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

        <Header link={"/begehung"}/>
            {children}
        </>
    );
}
