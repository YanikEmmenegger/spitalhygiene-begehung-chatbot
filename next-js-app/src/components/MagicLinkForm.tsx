'use client'; // Enables client-side rendering
import React, { useEffect, useState } from 'react'; // Import React and hooks
import Button from '@/components/Button'; // Import Button component
import Input from '@/components/Input'; // Import Input component
import { login } from '@/app/login/LoginActions'; // Import login action
import Image from 'next/image'; // Import Image component for optimized images
import { useRouter } from 'next/navigation'; // Import router for navigation
import axios from 'axios'; // Import axios for HTTP requests

const LoginForm = () => {
    // State hooks for managing form inputs, messages, and loading status
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showOtpField, setShowOtpField] = useState(false);

    const router = useRouter(); // Router instance for navigation

    const validDomains: string[] =
        (process.env.NEXT_PUBLIC_ALLOWED_DOMAINS as unknown as []) || [ // Allowed email domains
            'insel.ch',
            'hotmail.com',
            'rolshoven.io',
        ];

    // Check for error query parameter in URL on component mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('error')) {
            setError(urlParams.get('error') || 'Fehler - Bitte versuchen Sie es erneut');
        }
    }, []);

    // Function to validate email format and domain
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for email validation
        if (!emailRegex.test(email.toLowerCase())) {
            return 'Bitte geben Sie eine gültige E-Mail-Adresse ein'; // Error message for invalid email
        }

        const domain = email.split('@')[1]; // Extract domain from email
        if (!validDomains.includes(domain)) {
            return `Bitte verwenden Sie eine E-Mail-Adresse mit @insel.ch`; // Error message for invalid domain
        }

        return ''; // No error
    };

    // Handle form submission for email login
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationError = validateEmail(email); // Validate email
        setMessage('');
        setError('');

        if (validationError) {
            setError(validationError); // Set validation error
            return;
        }

        setLoading(true); // Start loading state
        const success = await login(email); // Send email login request
        if (success) {
            setMessage(
                'Anmelde-Link wurde gesendet. Bitte überprüfen Sie Ihr E-Mail-Postfach oder geben Sie den per E-Mail erhaltenen OTP ein.',
            );
            setError('');
            setShowOtpField(true); // Show OTP input field
        } else {
            setError('Fehler beim Senden des Anmelde-Links'); // Set error for failed login
        }
        setLoading(false); // End loading state
    };

    // Handle OTP verification
    const handleVerifyOtp = async () => {
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const response = await axios.get('/api/auth/confirm', { // Verify OTP via API
                params: {
                    email,
                    token: otp,
                    type: 'email', // Ensure type matches backend
                },
            });

            if (response.status === 200) {
                setMessage('Erfolgreich eingeloggt!'); // Successful login message
                router.replace('/'); // Redirect to home
            } else {
                setError('Ungültiger OTP. Bitte erneut versuchen.'); // Error for invalid OTP
            }
        } catch (err) {
            setError('Ungültiger OTP. Bitte erneut versuchen.'); // Handle error
            console.error(err);
        } finally {
            setLoading(false); // End loading state
        }
    };

    return (
        <div className="flex flex-col -mt-10 gap-10 items-center justify-center min-h-screen">
            <Image
                width={150}
                height={150}
                src={'/Logo.svg'} // Application logo
                alt={'Logo Inselspital'}
                className={'h-12 w-auto'}
            />
            <div className="bg-transparent md:bg-white p-8 rounded-lg md:shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold md:text-center text-gray-700 mb-5">Anmeldung</h2>
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
                            placeholder={'E-Mail-Adresse eingeben'}
                        />
                    </div>

                    {showOtpField && ( // Render OTP field conditionally
                        <div className="mb-4">
                            <label htmlFor="otp" className="block text-gray-600 mb-2">
                                OTP
                            </label>
                            <Input
                                type="text"
                                name="otp"
                                id="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder={'OTP eingeben'}
                            />
                        </div>
                    )}

                    <div className="flex justify-center">
                        {!showOtpField ? ( // Conditional rendering for OTP vs. Login button
                            <Button disabled={loading} type="submit" className="w-full">
                                {loading ? 'lädt...' : 'Anmelden'}
                            </Button>
                        ) : (
                            <Button disabled={loading || otp.length === 0} onClick={handleVerifyOtp} className="w-full">
                                {loading ? 'lädt...' : 'OTP Verifizieren'}
                            </Button>
                        )}
                    </div>
                </form>
                <p className="text-red-500 text-sm mt-2">{error}</p> {/* Display error messages */}
                <p className="text-green-500 text-center mt-4">{message}</p> {/* Display success messages */}
            </div>
        </div>
    );
};

export default LoginForm; // Export the LoginForm component
