import Button from "@/components/Button";
import Link from "next/link";

const Page = () => {
    return (
        <div className='flex flex-col justify-center items-center'>
            <h1 className={"text-3xl  pb-3"}>Stammdaten für die Begehung anpassen</h1>
            <div className={"w-full md:max-w-3xl flex flex-col gap-4"}>
                <Link href={"/begehung/admin/departments"}>
                    <Button className={"w-full text-xl"}>
                        Abteilungen
                    </Button>
                </Link>
                <Link href={"/begehung/admin/questions"}>
                    <Button className={"w-full text-xl"}>
                        Fragen
                    </Button>
                </Link>
                <Link href={"/begehung/admin/categories"}>

                    <Button  className={"w-full text-xl"}>
                        Kategorien
                    </Button>
                </Link>
                <Link href={"/begehung/admin/subcategories"}>

                    <Button  className={"w-full text-xl"}>
                        Unterkategorien
                    </Button>
                </Link>
                {/*<Link  href={"/begehung/admin/admins"}>*/}

                {/*    <Button disabled red className={"w-full text-xl"}>*/}
                {/*        Administratoren*/}
                {/*    </Button>*/}
                {/*</Link>*/}
            </div>

        </div>
    );
}

export default Page;
