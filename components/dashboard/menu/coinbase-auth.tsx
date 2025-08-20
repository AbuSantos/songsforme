import { useAuthenticate } from "@coinbase/onchainkit/minikit";
import { useState } from "react";

export default function AuthButton() {
    const { signIn } = useAuthenticate();
    const [user, setUser] = useState<any>(null);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleAuth = async () => {
        setIsAuthenticating(true);
        setErrorMessage(null);

        try {
            const result = await signIn();
            console.log("Sign-in result:", result);
            if (result) {
                console.log("✅ Authenticated:", result);
                setUser(result);
                // TODO: Save session to your backend
            } else {
                setErrorMessage("Authentication failed. Try again.");
            }
        } catch (err: any) {
            console.error(" Error during sign-in:", err);
            setErrorMessage("Authentication error. Please try again.");
        } finally {
            setIsAuthenticating(false);
        }
    };

    const handleSignOut = () => {
        setUser(null);
        // TODO: clear session in backend
    };

    if (user) {
        return (
            <div className="flex flex-col gap-2">
                <p className="bg-white text-gray-950 rounded-lg px-3 py-1">
                    Signed in as: <strong>{user.fid ?? user.message?.fid}</strong>
                </p>
                <button
                    onClick={handleSignOut}
                    className="bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700"
                >
                    Sign Out
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={handleAuth}
                disabled={isAuthenticating}
                className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 disabled:opacity-50"
            >
                {isAuthenticating ? "Authenticating..." : "Sign In with Farcaster"}
            </button>
            {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
        </div>
    );
}
