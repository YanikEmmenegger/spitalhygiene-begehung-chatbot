import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { Resend } from "resend";
import { getDisplayNameofDate } from "@/utils/dateFormat";
import { generateWordFromTemplate } from "@/utils/documents/createWord";
import { EmailTemplate } from "@/app/api/review/send/EmailTemplate";

export async function POST(req: NextRequest) {
    console.log("POST /api/review/send/");
    const supabase = await createClient();
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Retrieve the current session to check if the user is logged in
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        return NextResponse.json("Unauthorized", { status: 401 });
    }

    try {
        const { review } = await req.json();

        // Retrieve the logged-in user details
        const {
            data: { user },
        } = await supabase.auth.getUser();

        // Check if the user is logged in
        if (!user) {
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        // Validate the review object and ensure it has a "complete" status
        if (!review || typeof review !== "object" || review.status !== "complete") {
            return NextResponse.json("Invalid request", { status: 400 });
        }

        // Check if the user has a valid email address
        if (!user.email) {
            return NextResponse.json("User not found", { status: 404 });
        }

        // Generate the Word document from the review template
        const docBuffer = await generateWordFromTemplate(review);

        // Extract the user's first name from their email
        let userName = user.email.split("@")[0].split(".")[0];
        userName = userName.charAt(0).toUpperCase() + userName.slice(1); // Capitalize the first letter

        // Send an email with the generated document attached
        const { data, error } = await resend.emails.send({
            from: `Begehungstool <begehung@${process.env.NEXT_PUBLIC_EMAIL_SENDER_DOMAIN}>`,
            to: [user.email],
            subject: `Bericht Begehungstool vom ${getDisplayNameofDate(review.date)}`,
            react: EmailTemplate({
                firstName: userName,
                reportDate: getDisplayNameofDate(review.date),
            }) as React.ReactElement,
            attachments: [
                {
                    filename: `begehung-${review.date}.docx`,
                    content: docBuffer.toString("base64"), // Attach document as a base64 string
                    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                },
            ],
        });

        // Handle email sending errors
        if (error) {
            console.error(error);
            return NextResponse.json({ error }, { status: 500 });
        }

        // Return a success response with the email data
        return NextResponse.json({ data });
    } catch (e: unknown) {
        // Log unexpected errors and return a generic server error response
        console.error(e);
        return NextResponse.json("Internal Server Error", { status: 500 });
    }
}
