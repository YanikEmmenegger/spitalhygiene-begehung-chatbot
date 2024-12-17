import QuestionDetailPage from "@/components/admin/QuestionDetailPage";

export default async function Page({params}: { params: Promise<{ id: string }> }) {


    const id = (await params).id
    return (
        <QuestionDetailPage id={id}/>
    )
}
