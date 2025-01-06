import {
    Document,
    Packer,
    Paragraph,
    Table,
    TableCell,
    TableRow,
    WidthType,
    ShadingType,
    TextRun,
    ExternalHyperlink,
} from "docx";
import {
    ResultColor,
    Review,
    ReviewItem,
    ReviewItemStatusOptions,
    Person,
} from "@/types";
import { getDisplayNameofDate } from "@/utils/dateFormat";

/**
 * Convert reviewItem status to a readable string.
 */
function getStatusText(status: ReviewItemStatusOptions): string {
    switch (status) {
        case "approved":
            return "Erfüllt";
        case "failed":
            return "Nicht erfüllt";
        case "partially approved":
            return "Nicht Anwendbar";
        default:
            return "Nicht beantwortet";
    }
}

/**
 * Return a background color (fill) for the status cell based on the status.
 * - "approved" => light green
 * - "failed" => light red
 * - "partially approved" => light yellow
 * - otherwise => white
 */
function getStatusFill(status: ReviewItemStatusOptions): string {
    switch (status) {
        case "approved":
            return "CCFFCC"; // light green
        case "failed":
            return "FFCCCC"; // light red
        case "partially approved":
            return "FFFFCC"; // light yellow
        default:
            return "FFFFFF"; // white
    }
}

/**
 * Convert the overall review result color (red/yellow/green).
 */
function getResultColorIcon(status: ResultColor): string {
    switch (status) {
        case "red":
            return "🔴";
        case "yellow":
            return "🟡";
        case "green":
            return "🟢";
        default:
            return "⚪"; // fallback
    }
}

/**
 * Group ReviewItems by Category → Subcategory
 * Produces a structure:
 * {
 *   [categoryName: string]: {
 *     [subcatName: string]: ReviewItem[]
 *   }
 * }
 */
function groupByCategoryAndSubcategory(review: Review) {
    const map: Record<string, Record<string, ReviewItem[]>> = {};

    review.reviewItems.forEach((item) => {
        const categoryName = item.question.subcategory.category.name;
        const subcatName = item.question.subcategory.name;
        if (!map[categoryName]) {
            map[categoryName] = {};
        }
        if (!map[categoryName][subcatName]) {
            map[categoryName][subcatName] = [];
        }
        map[categoryName][subcatName].push(item);
    });

    return map;
}

/**
 * Format the array of Person(s) into a comma-separated string.
 * If no persons, returns an empty string (blank).
 */
function formatPersons(persons: Person[]): string {
    if (!persons || persons.length === 0) {
        return "";
    }
    return persons
        .map((p) => `${p.type} - ${getStatusText(p.status)}`)
        .join(", ");
}

/**
 * Provide a short legend for question types:
 * B = Beobachtung
 * FP = Frage Personal
 * FÄ = Frage ärztliches Personal
 * (And skip or treat "nicht anwendbar" as "N/A")
 */
function typeLegend(typeStr?: string | null): string {
    if (!typeStr) return "N/A";
    switch (typeStr) {
        case "Beobachtung":
            return "B";
        case "Frage Personal":
            return "FP";
        case "Frage ärztliches Personal":
            return "FÄ";
        case "nicht anwendbar":
            return "N/A";
        default:
            return typeStr;
    }
}

/**
 * Build a subcategory heading that optionally includes a clickable hyperlink
 * if link_url is present.
 *
 * - If only link_url => display subcatName + " - hyperlink"
 * - If link_name + link_url => use link_name as hyperlink text
 * - If no link_url => just subcatName
 */
function buildSubcategoryHeading(
    subcatName: string,
    linkName?: string | null,
    linkUrl?: string | null
): Paragraph {
    if (!linkUrl) {
        // No link => just subcatName
        return new Paragraph({
            text: subcatName,
            heading: "Heading3",
        });
    } else {
        // We have linkUrl. We'll create a clickable ExternalHyperlink.
        const hyperlinkText = linkName && linkName.trim() ? linkName : linkUrl;

        return new Paragraph({
            heading: "Heading3",
            children: [
                // subcatName + " - "
                new TextRun({
                    text: subcatName + " - ",
                }),
                new ExternalHyperlink({
                    link: linkUrl, // actual URL
                    children: [
                        new TextRun({
                            text: hyperlinkText,
                            style: "Hyperlink", // docx built-in style for hyperlink
                        }),
                    ],
                }),
            ],
        });
    }
}

/**
 * Build a single "Frage" paragraph, optionally with a link if question.link_url is present.
 * - If `question.link_url` is set => create a link after the question text
 * - If there's a `question.link_name` => use it as link text, else use the URL
 *
 * We'll return an array of `TextRun` or similar. Then we can place them in a single Paragraph.
 */
function buildQuestionParagraph(
    questionText: string,
    linkName?: string | null,
    linkUrl?: string | null
): Paragraph {
    // Basic text run for the question
    const textRuns: (TextRun | ExternalHyperlink)[] = [
        new TextRun({
            text: questionText,
        }),
    ];

    if (linkUrl) {
        // Add " - " and a hyperlink
        const hyperlinkText = linkName && linkName.trim() ? linkName : linkUrl;
        textRuns.push(
            new TextRun({ text: " - " }),
            new ExternalHyperlink({
                link: linkUrl,
                children: [
                    new TextRun({
                        text: hyperlinkText,
                        style: "Hyperlink",
                    }),
                ],
            })
        );
    }

    return new Paragraph({
        children: textRuns,
    });
}

/**
 * Create a Table for the subcategory's items.
 * Columns: Frage(with link) | Typ | Status | Personen | Kommentar
 *
 * If question is critical => highlight the entire row (except the status cell) in light yellow (FFFF99).
 * The status cell is colored by status:
 * - green if approved
 * - red if failed
 * - yellow if partially
 */
function buildSubcategoryTable(items: ReviewItem[]): Table {
    // Header row
    const headerRow = new TableRow({
        children: [
            new TableCell({
                children: [
                    new Paragraph({
                        children: [new TextRun({ text: "Frage", bold: true })],
                    }),
                ],
            }),
            new TableCell({
                children: [
                    new Paragraph({
                        children: [new TextRun({ text: "Typ", bold: true })],
                    }),
                ],
            }),
            new TableCell({
                children: [
                    new Paragraph({
                        children: [new TextRun({ text: "Status", bold: true })],
                    }),
                ],
            }),
            new TableCell({
                children: [
                    new Paragraph({
                        children: [new TextRun({ text: "Berufsgruppen", bold: true })],
                    }),
                ],
            }),
            new TableCell({
                children: [
                    new Paragraph({
                        children: [new TextRun({ text: "Kommentar", bold: true })],
                    }),
                ],
            }),
        ],
    });

    // Data rows
    const dataRows = items.map((item) => {
        const { question, status, persons, comment } = item;
        const isCritical = question.critical;

        // For columns other than status, if critical => shading fill "FFFF99"
        const defaultShading = isCritical
            ? {
                fill: "FFFF99",
                type: ShadingType.CLEAR,
                color: "auto",
            }
            : undefined;

        // For the status cell, color depending on the status:
        const statusShading = {
            fill: getStatusFill(status),
            type: ShadingType.CLEAR,
            color: "auto",
        };

        // Build question paragraph (with optional link)
        const questionParagraph = buildQuestionParagraph(
            question.question,
            question.link_name,
            question.link_url
        );

        return new TableRow({
            children: [
                // Frage
                new TableCell({
                    children: [questionParagraph],
                    shading: defaultShading,
                }),
                // Typ
                new TableCell({
                    children: [new Paragraph(typeLegend(question.type))],
                    shading: defaultShading,
                }),
                // Status
                new TableCell({
                    children: [new Paragraph(getStatusText(status))],
                    shading: statusShading,
                }),
                // Personen
                new TableCell({
                    children: [new Paragraph(formatPersons(persons))],
                    shading: defaultShading,
                }),
                // Kommentar
                new TableCell({
                    children: [new Paragraph(comment || "")],
                    shading: defaultShading,
                }),
            ],
        });
    });

    return new Table({
        width: {
            size: 100,
            type: WidthType.PERCENTAGE,
        },
        rows: [headerRow, ...dataRows],
    });
}

/**
 * Main generator for Word doc
 */
export async function generateWordFromTemplate(review: Review): Promise<Buffer> {
    const groupedData = groupByCategoryAndSubcategory(review);

    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: "Arial",
                        size: 24, // 12pt
                    },
                    paragraph: {
                        spacing: {
                            line: 276, // 1.5 line spacing
                        },
                    },
                },
            },
        },
        sections: [
            {
                children: [
                    // Title
                    new Paragraph({
                        text: `Bericht Begehungstool vom ${getDisplayNameofDate(review.date)}`,
                        heading: "Heading1",
                    }),
                    // Department name
                    new Paragraph({ text: `Abteilung: ${review.department.name}` }),
                    // Result color icon
                    new Paragraph({ text: `Ergebnis: ${getResultColorIcon(review.result!)}` }),
                    // Percentage
                    new Paragraph({ text: `Erfüllt zu: ${review.resultPercentage}%` }),
                    // Critical Count
                    new Paragraph({
                        text: `Hauptabweichungen: ${review.criticalCount || "Keine"}`,
                    }),
                    // Description
                    new Paragraph({
                        text: `Zusammenfassung: ${review.resultDescription || ""}`,
                    }),
                    new Paragraph({ text: " " }), // blank line
                    // Legend
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Legende Fragentyps: ",
                                bold: true,
                            }),
                            new TextRun(
                                "B = Beobachtung, FP = Frage Personal, FÄ = Frage ärztliches Personal, N/A = nicht anwendbar"
                            ),
                        ],
                    }),
                    new Paragraph({ text: " " }),

                    // Loop over categories, subcategories
                    ...Object.entries(groupedData).flatMap(([categoryName, subcatMap]) => {
                        // Category heading
                        const catHeading = new Paragraph({
                            text: categoryName,
                            heading: "Heading2",
                        });

                        // Each subcategory
                        const subcatSections = Object.entries(subcatMap).flatMap(
                            ([subcatName, items]) => {
                                // We'll pull linkName / linkUrl from subcategory obj
                                // which is on the first item => item.question.subcategory.link_url / link_name
                                const firstItem = items[0];
                                const subcatObj = firstItem.question.subcategory;

                                const subHeading = buildSubcategoryHeading(
                                    subcatName,
                                    subcatObj.link_name,
                                    subcatObj.link_url
                                );

                                const table = buildSubcategoryTable(items);
                                const spacer = new Paragraph({ text: " " });
                                return [subHeading, table, spacer];
                            }
                        );

                        return [catHeading, ...subcatSections];
                    }),
                ],
            },
        ],
    });

    return Packer.toBuffer(doc);
}
