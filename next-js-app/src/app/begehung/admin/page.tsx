import Button from "@/components/Button";
import Link from "next/link";

const Page = () => {
    return (
        <div className="flex flex-col justify-center items-center">
            {/* Page title */}
            <h1 className={"text-3xl pb-3"}>Stammdaten für die Begehung anpassen</h1>

            {/* Container for navigation buttons */}
            <div className={"w-full md:max-w-3xl flex flex-col gap-4"}>
                {/* Link to Departments Page */}
                <Link href={"/begehung/admin/departments"}>
                    <Button className={"w-full text-xl"}>Abteilungen</Button>
                </Link>

                {/* Link to Questions Page */}
                <Link href={"/begehung/admin/questions"}>
                    <Button className={"w-full text-xl"}>Fragen</Button>
                </Link>

                {/* Link to Categories Page */}
                <Link href={"/begehung/admin/categories"}>
                    <Button className={"w-full text-xl"}>Kategorien</Button>
                </Link>

                {/* Link to Subcategories Page */}
                <Link href={"/begehung/admin/subcategories"}>
                    <Button className={"w-full text-xl"}>Unterkategorien</Button>
                </Link>

            </div>
        </div>
    );
};

export default Page;
