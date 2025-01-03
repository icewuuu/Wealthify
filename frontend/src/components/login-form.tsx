import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import darkLogoB from "../assets/white_blue.png";
import lightLogoB from "../assets/black_blue.png";
import { useTheme } from "./theme-provider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import api from "@/api";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const { toast } = useToast();

  const accessTokenExpiration = new Date(new Date().getTime() + 15 * 60 * 1000); // This can be constant for setting both tokens.

  // Function to handle login error
  const handleLoginError = (error: any) => {
    const errorMessage =
      error?.response?.data?.non_field_errors || "An unknown error occurred";
    toast({
      variant: "destructive",
      title: "Login failed",
      description: errorMessage,
    });
  };

  // Function to handle successful login
  const handleSuccessfulLogin = (accessToken: string, refreshToken: string) => {
    Cookies.set("accessToken", accessToken, {
      expires: accessTokenExpiration,
      secure: true,
      sameSite: "strict",
    });
    Cookies.set("refreshToken", refreshToken, {
      expires: 1, // Consider revisiting the expiry for refresh token.
      secure: true,
      sameSite: "strict",
    });

    login(accessToken);
    navigate("/dashboard");
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const { data } = await api.post("/api/token/", { username, password });
      handleSuccessfulLogin(data.access, data.refresh);
    } catch (error) {
      handleLoginError(error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-32 w-32 items-center justify-center rounded-md">
              <a href="/">
                <img
                  src={theme === "light" ? lightLogoB : darkLogoB}
                  alt="Wealthify"
                  className="h-32 w-32"
                />
              </a>
            </div>
            <span className="sr-only">Wealthify</span>

            <h1 className="text-xl font-bold">Welcome to Wealthify</h1>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/register" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Email/Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="m@example.com or username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-1">
            <Button variant="outline" className="w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        </div>
      </form>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
