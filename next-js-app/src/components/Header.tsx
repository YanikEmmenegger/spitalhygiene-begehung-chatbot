import Image from "next/image"; // Import Image component for optimized images
import Link from "next/link"; // Import Link for client-side navigation
import {FC} from "react"; // Import FC (Function Component) type from React

// Define interface for props
interface HeaderProps {
    link?: string; // Optional prop to specify the link destination
}

// Header component
const Header: FC<HeaderProps> = ({link}) => {
    return (
        <header className="bg-white border-b-[1px] border-lightGreen h-20"> {/* Header with a border and fixed height */}
            <div className="container mx-auto flex items-center h-full"> {/* Center contents vertically */}
                <div className="flex-1 cursor-pointer flex justify-center"> {/* Center the logo horizontally */}
                    <Link href={link ? link : "#"}> {/* Use provided link or default to "#" */}
                        <Image
                            width={150}
                            height={150}
                            src={"/Logo.svg"}
                            alt={"Logo Inselspital"}
                            className={"h-12 w-auto"} // Maintain aspect ratio of the logo
                        />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header; // Export the Header component
