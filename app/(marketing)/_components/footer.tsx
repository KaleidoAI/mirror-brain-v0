import { Button } from "@/components/ui/button"

import { Logo } from "./logo"

export const Footer = () => {
  return (
    <div className="flex items-center w-full px-10 sm:px-20 md:px-28 py-6 z-50 bg-[#0B0121]">
      <p className="flex-none text-base font-normal	text-[#ececec]/60">
        © 2023 MirrorBrain. All Rights Reserved.
      </p>
      <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
        <Logo />
      </div>
    </div>
  )
}