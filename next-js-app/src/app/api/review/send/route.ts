import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/utils/supabase/server";
import {Resend} from "resend";
import {getDisplayNameofDate} from "@/utils/dateFormat";
import {generateWordFromTemplate} from "@/utils/documents/createWord";
import {EmailTemplate} from "@/app/api/review/send/EmailTemplate";

export async function POST(req: NextRequest) {
    console.log("POST /api/review/send/");
    const supabase = await createClient();

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Check if the user is logged in
    const {data: {session}} = await supabase.auth.getSession();
    if (!session) {
        return NextResponse.json("Unauthorized", {status: 401});
    }

    try {
        const {review} = await req.json();

        //create supabase client
        //check if user is logged in
        const {data: {user}} = await supabase.auth.getUser()
        //if not logged in return 401
        if (!user) {
            return NextResponse.json(
                "Unauthorized",
                {
                    status: 401
                }
            )
        }

        // Check if the review is complete and valid
        if (!review || typeof review !== "object" || review.status !== "complete") {
            return NextResponse.json("Invalid request", {status: 400});
        }
        if (!user || !user.email) {
            return NextResponse.json("User not found", {status: 404});
        }

        //print the full review object and all object within


        // Generate the PDF from the HTML template
        const docBuffer = await generateWordFromTemplate(review);
        //const excelBuffer = await generateExcelFromReview(review);

        // Save the file locally (optional, for testing)
        //fs.writeFileSync(path.join(__dirname, "review.docx"), docBuffer);

        let userName = user.email.split("@")[0].split(".")[0];
        //first letter uppercase
        userName = userName.charAt(0).toUpperCase() + userName.slice(1);


        // Send the email with the attachments
        const {data, error} = await resend.emails.send({
            from: `Begehungstool <begehung@${process.env.NEXT_PUBLIC_EMAIL_SENDER_DOMAIN}>`,
            to: [user.email],
            subject: "Bericht Begehungstool vom " + getDisplayNameofDate(review.date),
            react: EmailTemplate({firstName: userName, reportDate: getDisplayNameofDate(review.date)}) as React.ReactElement,
            attachments: [
                {
                    filename: `begehung-${review.date}.docx`,
                    content: docBuffer.toString("base64"),
                    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                },
            ],
        });

        if (error) {
            console.log(error);
            return NextResponse.json({error}, {status: 500});
        }

        return NextResponse.json({data});
    } catch (e: unknown) {
        console.error(e);
        return NextResponse.json("Internal Server Error", {status: 500});
    }
}
