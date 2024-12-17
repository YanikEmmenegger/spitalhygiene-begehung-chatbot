import DepartmentDetailPage from "@/components/admin/DepartmentDetailPage";

export default async function Page({params}: { params: Promise<{ id: string }> }) {


    const id = (await params).id
    return (
        <DepartmentDetailPage id={id}/>
    )
}
