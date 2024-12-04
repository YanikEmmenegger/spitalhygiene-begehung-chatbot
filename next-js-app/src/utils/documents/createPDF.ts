import {Review, ReviewItemStatusOptions} from "@/types";
import puppeteer from "puppeteer";
import {getDisplayNameofDate} from "@/utils/dateFormat";

export const generatePdfFromTemplate = async (review: Review): Promise<Buffer> => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const getStatus = (status: ReviewItemStatusOptions): string => {
        switch (status) {
            case "approved":
                return "Erfüllt";
            case "failed":
                return "Nicht erfüllt";
            case "partially approved":
                return "Teilweise erfüllt";
            default:
                return "Nicht beantwortet";
        }
    };

    // Render the HTML for the PDF
    const htmlContent = `
        <html lang="de">
        <head>
            <title>Bericht Begehungstool</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #4CAF50; }
                h2 { margin-top: 20px; color: #333; }
                p { margin: 5px 0; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .critical { color: red; font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>Bericht Begehungstool vom ${getDisplayNameofDate(review.date)}</h1>
            <p><strong>Abteilung:</strong> ${review.department}</p>
            <p><strong>Standort:</strong> ${review.location}</p>
            <p><strong>Ergebnis:</strong> ${review.result!.toUpperCase()}</p>
            <p><strong>Erfüllungsrate:</strong> ${review.resultPercentage}%</p>
            <p><strong>Hauptkritikpunkte:</strong> ${review.criticalCount || "Keine"}</p>
            <p><strong>Zusammenfassung:</strong> ${review.resultDescription || "Keine Beschreibung"}</p>

            <h2>Fragenübersicht</h2>
            <table>
                <thead>
                    <tr>
                        <th>Kategorie</th>
                        <th>Unterkategorie</th>
                        <th>Frage</th>
                        <th>Kritisch</th>
                        <th>Status</th>
                        <th>Kommentar</th>
                    </tr>
                </thead>
                <tbody>
                    ${review.reviewItems
        .map(
            (item) => `
                        <tr>
                            <td>${item.question.subcategory.category.name}</td>
                            <td>${item.question.subcategory.name}</td>
                            <td>${item.question.question}</td>
                            <td class="critical">${item.question.critical ? "Ja" : "Nein"}</td>
                            <td>${getStatus(item.status)}</td>
                            <td>${item.comment || "Keine Kommentare"}</td>
                        </tr>
                    `
        )
        .join("")}
                </tbody>
            </table>
        </body>
        </html>
    `;

    await page.setContent(htmlContent, {waitUntil: "networkidle0"});

    // Generate the PDF and return it as a Buffer
    const pdfBuffer = Buffer.from(await page.pdf({format: "A4"}));

    await browser.close();
    return pdfBuffer;
}
