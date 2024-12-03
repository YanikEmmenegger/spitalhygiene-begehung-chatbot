/*function getStatus(status: ReviewItemStatusOptions): string {
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
}

function getResultColor(status: ResultColor): string {
    switch (status) {
        case "red":
            return "🔴";
        case "yellow":
            return "🟡";
        case "green":
            return "🟢";
        default:
            return "⚪"; // Default for no result
    }
}

export const generateWordFromTemplate = async (review: Review): Promise<Buffer> => {
    const sortQuestionsByCategory = (reviewData: Review) => {
        const categories: { [key: string]: ReviewItem[] } = {};

        reviewData.reviewItems.forEach((item) => {
            const categoryName = item.question.subcategory.category.name;
            if (!categories[categoryName]) {
                categories[categoryName] = [];
            }
            categories[categoryName].push(item);
        });

        return categories;
    };

    const categories = sortQuestionsByCategory(review);

    // Create the document
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
                            line: 276, // 1.5 spacing
                        },
                    },
                },
            },
        },
        sections: [
            {
                children: [
                    new Paragraph({
                        text: `Bericht Begehungstool vom ${getDisplayNameofDate(review.date)}`,
                        heading: "Heading1",
                    }),
                    new Paragraph({
                        text: `Abteilung: ${review.department}`,
                    }),
                    new Paragraph({
                        text: `Standort: ${review.location}`,
                    }),
                    new Paragraph({
                        text: `Ergebnis: ${getResultColor(review.result!)}`,
                    }),
                    new Paragraph({
                        text: `Erfüllt zu: ${review.resultPercentage}%`,
                    }),
                    new Paragraph({
                        text: `Hauptabweichungen: ${review.criticalCount || "Keine"}`,
                    }),
                    new Paragraph({
                        text: `Zusammenfassung: ${review.resultDescription || "Keine Beschreibung"}`,
                    }),
                    ...Object.entries(categories).flatMap(([categoryName, reviewItems]) =>
                        createCategoryTable(categoryName, reviewItems)
                    ),
                ],
            },
        ],
    });

    // Generate the Word document buffer
    return await Packer.toBuffer(doc);
};

// Function to create a table for a category
function createCategoryTable(
    categoryName: string,
    reviewItems: ReviewItem[]
): (Paragraph | Table)[] {
    const rows = [
        // Header row
        new TableRow({
            children: [
                new TableCell({
                    children: [new Paragraph({text: "Frage",})],
                }),
                new TableCell({
                    children: [new Paragraph({text: "Status"})],
                }),
                new TableCell({
                    children: [new Paragraph({text: "Kommentar"})],
                }),
            ],
        }),
        // Data rows
        ...reviewItems.map((item) =>
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({text: item.question.question})],
                    }),
                    new TableCell({
                        children: [new Paragraph({text: getStatus(item.status)})],
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                text: item.comment || "Keine Kommentare",
                            }),
                        ],
                    }),
                ],
            })
        ),
    ];

    const table = new Table({
        width: {
            size: 100,
            type: WidthType.PERCENTAGE,
        },
        rows: rows,
    });

    return [
        new Paragraph({
            text: categoryName,
            heading: "Heading2",
        }),
        table,
        new Paragraph({
            text: " ", // Spacer
        }),
    ];
}
*/
