import { LoginForm } from "@/components/login-form";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const handleClose = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="absolute top-4 right-4">
        <Button onClick={handleClose} className="m-2">
          <X /> Close
        </Button>

        <ModeToggle />
      </div>
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
