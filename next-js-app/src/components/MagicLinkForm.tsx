'use client'
import React, {useEffect, useState} from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import {login} from "@/app/login/LoginActions";
import Image from "next/image";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    // Define allowed domains
    const validDomains: string[] = process.env.NEXT_PUBLIC_ALLOWED_DOMAINS as unknown as [] || ["insel.ch", "hotmail.com", "rolshoven.io"];

    useEffect(() => {
        // get url params
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("error")) {
            setError(urlParams.get("error") || "Fehler - Bitte versuchen Sie es erneut");
        }
    }, []);

    // Email validator that checks if the email is in a valid format and belongs to a valid domain
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.toLowerCase())) {
            return "Bitte geben Sie eine gültige E-Mail-Adresse ein";
        }

        // Extract the domain from the email
        const domain = email.split("@")[1];
        if (!validDomains.includes(domain)) {
            return `Bitte verwenden Sie eine E-Mail-Adresse mit @insel.ch`;
        }

        return "";
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationError = validateEmail(email);
        setMessage("");
        setError("");

        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        const success = await login(email);
        if (success) {
            setMessage("Anmelde-Link wurde gesendet. Bitte überprüfen Sie Ihr E-Mail-Postfach");
            setError("");
        } else {
            setError("Fehler beim Senden des Anmelde-Links");
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col -mt-10 gap-10 items-center justify-center min-h-screen">
            <Image width={150} height={150} src={"/Logo.svg"} alt={"Logo Inselspital"}
                   className={"h-12 w-auto"}/>
            <div className="bg-transparent md:bg-white p-8 rounded-lg md:shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold md:text-center text-gray-700 mb-5">
                    Anmeldung
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-600 mb-2">
                            E-Mail-Adresse
                        </label>
                        <Input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={"E-Mail-Adresse eingeben"}
                        />
                    </div>

                    <div className="flex justify-center">
                        <Button disabled={loading} type="submit" className="w-full">
                            {loading ? "lädt..." : "Anmelden"}
                        </Button>
                    </div>
                </form>
                <p className="text-red-500 text-sm mt-2">{error}</p>
                <p className="text-green-500 text-center mt-4">{message}</p>
            </div>
        </div>
    );
};

export default LoginForm;
