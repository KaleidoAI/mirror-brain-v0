"use client";

import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import Link from "next/link";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { cn } from "@/lib/utils";

import { Logo } from "./logo";

export const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();

  return (
    <div className={cn(
      "z-50 bg-[#0B0121] fixed top-0 flex items-center w-full px-10 sm:px-20 md:px-28 py-6",
      scrolled && "border-b shadow-sm"
    )}>
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-10">
        {isLoading && (
          <Spinner />
        )}
        {!isAuthenticated && !isLoading && (
          <>
            <Button className="text-xs sm:text-sm" variant="ghost" size="sm">
              <Link href="#features">
                Features
              </Link>
            </Button>
            <Button className="text-xs sm:text-sm" variant="ghost" size="sm">
              About us
            </Button>
            <Button size="sm" className="rounded-full px-5 text-xs sm:text-sm">
              Try MirrorBrain
            </Button>
          </>
        )}
        {/* {isAuthenticated && !isLoading && (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/pages">
                Enter Jotion
              </Link>
            </Button>
            <UserButton
              afterSignOutUrl="/"
            />
          </>
        )} */}
        {/* <ModeToggle /> */}
      </div>
    </div>
  )
}