"use client";

import Script from 'next/script';

export const Heading = () => {

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-medium leading-tight sm:leading-tight md:leading-tight bg-gradient-to-br from-[#ececec] to-[#ececec]/20 bg-clip-text text-transparent">
        Link the way you think
      </h1>
      <p className="text-xs sm:text-base md:text-lg font-normal	text-[#ececec]/60">
        Unlock your mind&apos;s potential by effortlessly connecting new <br />
        insights to existing knowledge.
      </p>
      <div id="getWaitlistContainer" className="flex flex-row items-center justify-center" data-waitlist_id="10533" data-widget_type="WIDGET_2"></div>
      <Script 
        strategy="lazyOnload"
        src="https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.js" />
    </div>
  )
}