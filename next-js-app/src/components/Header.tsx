import Image from "next/image";
import Link from "next/link";
import {FC} from "react";

interface HeaderProps {
    link?: string;
}

const Header: FC<HeaderProps> = ({link}) => {
    return (
        <header className="bg-white border-b-[1px] border-lightGreen h-20"> {/* Set fixed header height */}
            <div className="container mx-auto flex items-center h-full"> {/* Vertically center contents */}
                <div className="flex-1 cursor-pointer flex justify-center">
                    <Link href={link ? link : "#"}>
                        <Image width={150} height={150} src={"/Logo.svg"} alt={"Logo Inselspital"}
                               className={"h-12 w-auto"}/>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
