'use client'
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {AiOutlineLoading} from "react-icons/ai";
import Image from "next/image";

export default function Home() {

    const router = useRouter();


    useEffect(() => {
        const lastVisited = Cookies.get('lastVisited');

        if (lastVisited) {
            console.log(`Last visited page: ${lastVisited}`);
            router.replace(`/${lastVisited}`);
        } else {
            console.log("No last visited page");
            //set cookie to last visited page
            Cookies.set('lastVisited', 'bot');
            router.replace('/bot');
        }
    });


    return (
        <div className={"w-screen h-screen flex flex-col gap-5 justify-center items-center"}>
            <Image src={'/Logo.svg'} alt={"Logo"} width={200} height={200}/>

            <AiOutlineLoading className={"animate-spin"} size={20}/>
        </div>
    );
}
