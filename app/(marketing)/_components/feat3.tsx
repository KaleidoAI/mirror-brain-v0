import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Feat3 = () => {
  return (
    <div className="px-10 sm:px-20 md:px-28 pt-16 w-full">
      <div className="flex flex-row items-center justify-center text-left rounded-2xl bg-[rgba(255,255,255,0.05)] shadow-[0_-2px_30px_rgba(91,87,100,0.3),0_-2px_60px_rgba(73,61,100,0.15),inset_0.3px_0.7px_0_rgba(255,255,255,0.3),inset_-0.3px_-0.1px_0_rgba(255,255,255,0.2)]">
        <div className="basis-3/5 pl-4 sm:pl-8 md:pl-16 px-8 flex flex-col items-center justify-center py-16">
          <div className="w-full h-auto overflow-hidden rounded-2xl shadow-[0_-2px_30px_rgba(91,87,100,0.3),0_-2px_60px_rgba(73,61,100,0.15),inset_0.3px_0.7px_0_rgba(255,255,255,0.3),inset_-0.3px_-0.1px_0_rgba(255,255,255,0.2)]">
            <video src="/rickroll.mp4" playsInline autoPlay muted loop className="w-full h-auto"></video>
          </div>
        </div>
        <div className="basis-2/5 pr-4 sm:pr-8 md:pr-16 space-y-6 py-16">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold md:leading-tight">
            Everything Everywhere All at <span className="line-through">Once</span> MirrorBrain!
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#bbbbbb] font-normal">
            MirrorBrain ensures your entire knowledge base is accessible at all times, providing on-the-spot related notes and comprehensive context, so you're always fully informed.
          </p>
          <Button variant={"outline"} className="text-xs sm:text-sm rounded-full px-5 bg-[rgba(23,14,44,0.0) hover:bg-[#0B0121] border-[#ececec]">
              Try MirrorBrain
              <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
