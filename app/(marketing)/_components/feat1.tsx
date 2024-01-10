export const Feat1 = () => {
  return (
    <div className="px-10 sm:px-20 md:px-28 pt-16 w-full bg-top bg-origin-content bg-[length:100%_100%] bg-no-repeat" style={{backgroundImage: `url(/feat1-bg.svg)`}}>
      <div className="rounded-2xl bg-[rgba(255,255,255,0.05)] shadow-[0_-2px_30px_rgba(91,87,100,0.3),0_-2px_60px_rgba(73,61,100,0.15),inset_0.3px_0.7px_0_rgba(255,255,255,0.3),inset_-0.3px_-0.1px_0_rgba(255,255,255,0.2)]">
        <div className="space-y-6 py-16">
          <h1 className="px-8 sm:px-12 md:px-40 text-2xl sm:text-4xl md:text-5xl font-bold md:leading-tight">
            Bridge new ideas with your prior knowledge.
          </h1>
          <p className="px-8 sm:px-12 md:px-40 text-xs sm:text-base md:text-lg text-[#bbbbbb] font-normal">
            MirrorBrain seamlessly maps out connections between your new ideas and existing knowledge, displaying relevant notes alongside as you write to enhance understanding and foster creativity.
          </p>
          <div className="px-8 sm:px-12 md:px-16">
            <div className="w-full h-auto overflow-hidden rounded-2xl shadow-[0_-2px_30px_rgba(91,87,100,0.3),0_-2px_60px_rgba(73,61,100,0.15),inset_0.3px_0.7px_0_rgba(255,255,255,0.3),inset_-0.3px_-0.1px_0_rgba(255,255,255,0.2)]">
              <video src="/rickroll.mp4" playsInline autoPlay muted loop className="w-full h-auto"></video>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
