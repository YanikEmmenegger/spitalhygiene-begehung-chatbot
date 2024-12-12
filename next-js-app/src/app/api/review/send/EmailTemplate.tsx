import * as React from "react";

interface EmailTemplateProps {
    firstName: string;
    reportDate: string; // Include dynamic data if needed
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
                                                                          firstName,
                                                                          reportDate,
                                                                      }) => {
    return (
        <div style={{ fontFamily: "Arial, sans-serif", width: "100%", backgroundColor: "#009870", padding: "20px 0" }}>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <h1 style={{ color: "#ffffff", fontSize: "36px", margin: "0", lineHeight: "1.2" }}>
                    Begehungstool
                </h1>
            </div>
            <div
                style={{
                    width: "90%",
                    maxWidth: "600px",
                    margin: "0 auto",
                    padding: "20px",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                }}
            >
                <h2 style={{ fontSize: "20px", color: "#333333", margin: "0 0 15px" }}>
                    Hallo {firstName},
                </h2>
                <p style={{ fontSize: "16px", color: "#555555", lineHeight: "1.5", margin: "0 0 15px" }}>
                    Vielen Dank, dass du das Begehungstool verwendet hast. Hier ist dein Bericht deiner Begehung.
                </p>
                <div style={{ fontSize: "16px", color: "#555555", lineHeight: "1.5", margin: "20px 0" }}>
                    <p style={{ margin: "0 0 10px" }}>
                        <strong>Datum:</strong> {reportDate}
                    </p>

                </div>
            </div>
            <div
                style={{
                    textAlign: "center",
                    marginTop: "20px",
                    fontSize: "14px",
                    color: "#ffffff",
                }}
            >
                <p style={{ margin: "0" }}>
                    © 2024 Begehungstool. Alle Rechte vorbehalten.
                </p>
            </div>
        </div>
    );
};
