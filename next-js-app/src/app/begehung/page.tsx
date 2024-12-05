import Link from "next/link";
import Button from "@/components/Button";
import RecentReviews from "@/components/recentReviews/RecentReviews";
import MenuButtons from "@/components/MenuButtons";

export default function Home() {


    return (
        <div className={"flex flex-col mt-20 justify-center items-center gap-20"}>
            <Link href={"/begehung/review/new"}>
                <Button className={"text-2xl"}>
                    Neue Begehung starten
                </Button>
            </Link>
            <RecentReviews/>
            <MenuButtons/>
        </div>
    );
}
