import {motion} from 'framer-motion';
import {twMerge} from 'tailwind-merge';
import Button from "@/components/Button";
import MenuButtons from "@/components/MenuButtons";


interface NavigationProps {
    isNavVisible: boolean;
    isSmallScreen: boolean;
    toggleNav: () => void;
}

const Navigation: React.FC<NavigationProps> = ({isNavVisible, isSmallScreen, toggleNav}) => {

    return (
        <motion.div
            initial={false}
            animate={{
                width: isNavVisible
                    ? isSmallScreen ? '100%' : '35%'  // Adjust width based on visibility and screen size
                    : '0%',                            // Set width to 0 when not visible
            }}
            transition={{duration: 0.3}}
            className={twMerge(
                "h-full absolute bg-white lg:bg-transparent lg:relative right-0 top-0 flex flex-col overflow-hidden",
                isNavVisible ? 'block border-l-[1px]' : 'hidden lg:block' // Handle visibility for mobile and desktop
            )}
        >
            <motion.div
                className="p-4 flex flex-col overflow-scroll justify-between h-full"
                animate={{opacity: isNavVisible ? 1 : 0}} // Fade in/out based on visibility
                transition={{delay: 0.2}}
            >
                <div className={twMerge("mx-5 mt-20 lg:text-left", isNavVisible ? "opacity-100" : "opacity-0")}>
                    <h2 className="text-3xl mb-5 text-lightGray font-bold">
                        Menu
                    </h2>

                    {/* Navigation links */}
                    <div className="flex flex-col items-start gap-1">

                        {/*{
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            t('navigation.links', {returnObjects: true}).map((link, index) => (
                                <NavigationLink key={index} href={link.link} text={link.title}/>
                            ))}*/}
                        <div className={" text-lightGray border-t-[1px] pt-5 "}>
                            Hier könnte noch ein weiterer Text stehen, was hier stehen soll, kann noch angepasst oder
                            gelsöcht werden, Hier könnte noch ein weiterer Text stehen, was hier stehen soll, kann noch angepasst oder
                            gelsöcht werden, Hier könnte noch ein weiterer Text stehen, was hier stehen soll, kann noch angepasst oder
                            gelsöcht werden, Hier könnte noch ein weiterer Text stehen, was hier stehen soll, kann noch angepasst oder
                            gelsöcht werden, Hier könnte noch ein weiterer Text stehen, was hier stehen soll, kann noch angepasst oder
                            gelsöcht werden, Hier könnte noch ein weiterer Text stehen, was hier stehen soll, kann noch angepasst oder
                            gelsöcht werden, Hier könnte noch ein weiterer Text stehen, was hier stehen soll, kann noch angepasst oder
                            gelsöcht werden
                        </div>
                    </div>

                    {/* Toggle button only visible on small screens */}
                    {isSmallScreen && (
                        <div className="mt-10 pb-5">
                            <Button onClick={toggleNav}>
                                →
                            </Button>
                        </div>
                    )}
                    {/* Language switcher at the bottom */}
                    <div className="py-5 mb-16 flex items-center justify-between">
                        <MenuButtons/>
                    </div>
                </div>


            </motion.div>
        </motion.div>
    );
};

export default Navigation;
