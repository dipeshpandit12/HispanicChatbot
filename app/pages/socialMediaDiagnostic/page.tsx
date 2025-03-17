"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AUTH_URLS = {
  Instagram: "/auth/instagram",
  Facebook: "/auth/facebook",
  Twitter: "/auth/twitter",
  LinkedIn: "/auth/linkedin",
};

interface SocialAccounts {
  Instagram: string;
  Facebook: string;
  Twitter: string;
  LinkedIn: string;
}

const SocialMediaDiagnostic = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [socialAccounts, setSocialAccounts] = useState<SocialAccounts>({
    Instagram: "",
    Facebook: "",
    Twitter: "",
    LinkedIn: "",
  });

  useEffect(() => {
    const fetchSocialAccounts = async () => {
      try {
        const response = await fetch("/api/socialMediaDiagnostics");
        if (!response.ok) throw new Error("Failed to fetch social accounts");
        const data = await response.json();
        if (data.socialAccounts) {
          setSocialAccounts(data.socialAccounts);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch social accounts";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSocialAccounts();
  }, []);

  const handleAuthRedirect = async (platform: keyof typeof AUTH_URLS) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID || "",
        response_type: "code",
        state: platform.toLowerCase(),
        redirect_uri: `/auth/callback/${platform.toLowerCase()}`,
      });

      await fetch("/api/socialMediaDiagnostics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          socialAccounts: {
            ...socialAccounts,
          },
        }),
      });

      router.push(`${AUTH_URLS[platform]}?${params.toString()}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Failed to initiate authentication: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-black">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const hasConnectedAccounts = Object.values(socialAccounts).some(
    (account) => account && account !== "pending"
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-[#F5F1EE]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center text-[#501214]">
          Manage Your Business Social Media Accounts
        </h1>

        <div className="grid grid-cols-1 gap-4">
          {Object.entries(socialAccounts).map(([platform, username]) => (
            <div
              key={platform}
              className="p-4 rounded-lg bg-white flex justify-between items-center shadow-md"
            >
              <span className="text-[#501214] font-medium">{platform}</span>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-[#363534]">
                  {username
                    ? username === "pending"
                      ? "Connecting..."
                      : `Connected as ${username}`
                    : "Not Connected"}
                </span>
                <button
                  onClick={() =>
                    handleAuthRedirect(platform as keyof typeof AUTH_URLS)
                  }
                  disabled={username === "pending"}
                  className={`px-4 py-2 rounded-lg text-white text-sm transition-colors ${
                    username
                      ? username === "pending"
                        ? "bg-[#6A5638] cursor-not-allowed"
                        : "bg-[#007096] hover:bg-[#6EA095]"
                      : "bg-[#007096] hover:bg-[#6EA095]"
                  }`}
                >
                  {username
                    ? username === "pending"
                      ? "Connecting..."
                      : "Reconnect"
                    : "Connect Account"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push("/analytics")}
          disabled={!hasConnectedAccounts}
          className={`w-full mt-8 p-3 rounded-lg transition-colors duration-200 text-white font-medium ${
            hasConnectedAccounts
              ? "bg-[#007096] hover:bg-[#6EA095]"
              : "bg-[#6A5638] cursor-not-allowed"
          }`}
        >
          {hasConnectedAccounts
            ? "Continue to Analytics"
            : "Connect at least one account to proceed"}
        </button>
        <div className="mt-6 flex items-center justify-between">
          <button
            className="px-4 py-2 bg-[#363534] hover:bg-[#6A5638] text-white rounded-md shadow-sm transition-colors duration-200 ease-in-out"
            onClick={() => router.push("/pages/issuesPage")}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaDiagnostic;
