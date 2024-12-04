import ReviewComponent from "@/components/review/ReviewComponent";

export default async function Page({params}: { params: Promise<{ id: string }> }) {


    const id = (await params).id
    return (
        <ReviewComponent reviewID={id}/>
    )
}
