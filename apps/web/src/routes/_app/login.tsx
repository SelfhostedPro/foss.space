import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  SocialLoginButton,
  type SocialProvider,
} from "@/components/auth/SocialLoginButton";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_app/login")({
  component: AuthPage,
});

function AuthPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<SocialProvider | null>(null);

  const handleSocialLogin = async (provider: SocialProvider) => {
    try {
      setLoading(provider);

      // Use Better Auth client for social login
      await authClient.signIn.social({ provider });

      // If the OAuth flow is successful, the page will redirect to the OAuth provider
      // and then back to our app after authentication
    } catch (err) {
      console.error(`${provider} login error:`, err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : `${provider} login failed. Please try again.`;
      setError(errorMessage);
      setLoading(null);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign In / Sign Up</CardTitle>
          <CardDescription>
            Continue with your preferred account to sign in or create a new
            account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-md text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <SocialLoginButton
              provider="github"
              onClick={() => handleSocialLogin("github")}
              isLoading={loading === "github"}
            />

            <SocialLoginButton
              provider="gitlab"
              onClick={() => handleSocialLogin("gitlab")}
              isLoading={loading === "gitlab"}
            />

            <SocialLoginButton
              provider="twitter"
              onClick={() => handleSocialLogin("twitter")}
              isLoading={loading === "twitter"}
            />

            <SocialLoginButton
              provider="google"
              onClick={() => handleSocialLogin("google")}
              isLoading={loading === "google"}
            />
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            By signing in, you agree to our
            <a href="/terms" className="text-primary hover:underline ml-1">
              Terms of Service
            </a>{" "}
            and
            <a href="/privacy" className="text-primary hover:underline ml-1">
              Privacy Policy
            </a>
            .
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
