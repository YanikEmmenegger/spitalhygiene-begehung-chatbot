'use client'
import {ArrowLeft} from "lucide-react";
import Button from "@/components/Button";
import {useRouter} from "next/navigation";


const NavigateBackButton = () => {
    const router = useRouter()

    return (
        <Button onClick={router.back}><ArrowLeft/></Button>);
}

export default NavigateBackButton;
