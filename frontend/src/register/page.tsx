import { RegisterForm } from "@/components/register-form";
import { ModeToggle } from "@/components/mode-toggle";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
