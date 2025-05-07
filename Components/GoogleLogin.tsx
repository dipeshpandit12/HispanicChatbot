"use client"
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useRouter,useSearchParams } from 'next/navigation';

export default function GoogleLoginButton() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect');

    const handleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            const response = await fetch('/api/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    credential: credentialResponse.credential,
                    redirect: redirectPath
                })
            });

            const data = await response.json();

            if (response.ok) {
                router.push(data.redirect ||'/pages/stage'); // Redirect after successful login
            } else {
                console.error('Login failed:', data.error);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log('Login Failed')}
        />
    );
}