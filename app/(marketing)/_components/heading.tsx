"use client";

import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-medium leading-tight sm:leading-tight md:leading-tight bg-gradient-to-br from-[#ececec] to-[#ececec]/20 bg-clip-text text-transparent">
        Link the way you think.
      </h1>
      <p className="text-xs sm:text-base md:text-lg font-normal	text-[#ececec]/60">
        Unlock your mind's potential by effortlessly connecting new <br />
        insights to existing knowledge.
      </p>
      {isLoading && (
        <div className="w-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      <div></div>
      {isAuthenticated && !isLoading && (
        <Button asChild className="rounded-full px-5 text-xs sm:text-sm">
          <Link href="/pages">
            Try MirrorBrain
          </Link>
        </Button>
      )}
      {!isAuthenticated && !isLoading && (
        <SignInButton mode="modal">
          <Button className="rounded-full px-5 text-xs sm:text-sm">
            Try MirrorBrain
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </SignInButton>
      )}
    </div>
  )
}