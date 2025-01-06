import ReviewComponent from "@/components/review/ReviewComponent";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    // Extract the review ID from the route parameters
    const id = (await params).id;

    // Render the ReviewComponent with the provided review ID
    return <ReviewComponent reviewID={id} />;
}
