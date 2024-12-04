'use client'
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function Home() {


    return (
        <>
            <div className="flex gap-5 flex-col md:flex-row items-center justify-center min-h-screen">
                <Link href={"/begehung"}>
                    <div
                        className="bg-lightGreen hover:bg-darkGreen text-white min-w-52 text-center p-8 rounded-lg md:shadow-lg">
                        Begehungstool
                    </div>
                </Link>
                <Link href={"/bot"}>
                    <div
                        className="bg-lightGreen hover:bg-darkGreen text-white min-w-52 text-center w-auto p-8 rounded-lg md:shadow-lg">
                        Chatbot
                    </div>
                </Link>
                <LogoutButton/>
            </div>
        </>
    );
}
