import * as React from "react";

interface EmailTemplateProps {
    firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({firstName}) => {
    return (
        <div style={{fontFamily: "Arial, sans-serif", width: "100%", backgroundColor: "#81c784", padding: "10px 0"}}>
            <div style={{textAlign: "center", marginBottom: "20px"}}>
                <h1 style={{color: "#ffffff", fontSize: "48px", margin: "0"}}>
                    Begehungstool
                </h1>
            </div>
            <div style={{
                width: "100%",
                margin: "0 auto",
                padding: "20px",
                backgroundColor: "#ffffff",
                borderRadius: "5px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                <h2 style={{fontSize: "18px", color: "#333333", margin: "0 0 10px"}}>
                    Hallo {firstName}, hier das Ergebnis deiner Begehung
                </h2>
                <p style={{fontSize: "16px", color: "#666666", margin: "0"}}>
                    Vielen Dank, dass du das Begehungstool verwendet hast. Hier sind die Details deines Berichts.
                </p>
            </div>
        </div>
    );
};
