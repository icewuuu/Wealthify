import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { buttonVariants } from "./ui/button";
import { Menu } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { useTheme } from "./theme-provider";
import darkLogoB from "../assets/white_blue.png";
import lightLogoB from "../assets/black_blue.png";
import { useAuth } from "@/context/AuthContext";
import { NavUser } from "./nav-user";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#features",
    label: "Features",
  },
  {
    href: "#testimonials",
    label: "Testimonials",
  },
  {
    href: "#pricing",
    label: "Pricing",
  },
  {
    href: "#faq",
    label: "FAQ",
  },
];

export const Navbar = () => {
  const { theme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  console.log("isAuthenticated", isAuthenticated);
  console.log("user", user);

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold items-center">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 font-bold text-xl flex items-center gap-2"
            >
              {/* <LogoIcon /> */}
              <img
                src={theme === "light" ? lightLogoB : darkLogoB}
                alt="Wealthify"
                className="h-12 w-12"
              />
              <span>Wealthify</span>
            </a>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            <ModeToggle />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    Wealthify
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <a
                      rel="noreferrer noopener"
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </a>
                  ))}
                  {isAuthenticated && user ? (
                    <a
                      rel="noreferrer noopener"
                      href="/profile"
                      className="flex items-center"
                    >
                      <NavUser user={user} />
                    </a>
                  ) : (
                    <a
                      rel="noreferrer noopener"
                      href="/login"
                      className={`w-[110px] border ${buttonVariants({
                        variant: "secondary",
                      })}`}
                    >
                      Sign in
                    </a>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden md:flex gap-2">
            {routeList.map((route: RouteProps, i) => (
              <a
                rel="noreferrer noopener"
                href={route.href}
                key={i}
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {route.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex gap-2">
            {isAuthenticated && user ? (
              <a
                rel="noreferrer noopener"
                href="/profile"
                className="flex items-center"
              >
                <NavUser user={user} />
              </a>
            ) : (
              <a
                rel="noreferrer noopener"
                href="/login"
                className={`border ${buttonVariants({ variant: "secondary" })}`}
              >
                Sign in
              </a>
            )}

            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
