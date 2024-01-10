import { Footer } from "./_components/footer";
import { Heading } from "./_components/heading";
import { Heroes } from "./_components/heroes";
import { Feat1 } from "./_components/feat1";
import { Feat2 } from "./_components/feat2";
import { Feat3 } from "./_components/feat3";

const MarketingPage = () => {
  return (
    <div className="min-h-full flex flex-col bg-[#0B0121]">
      <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 pb-10 bg-no-repeat pt-20 bg-top bg-origin-content bg-[length:100%_100%] bg-no-repeat" style={{backgroundImage: `url(/hero-stack-bg.svg)`}}>
        <div className="px-10 sm:px-20 md:px-28 pb-10">
          <div className="pt-32"></div>
          <Heading />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 pb-10">
        <Feat1 />
        <Feat2 />
        <Feat3 />
      </div>
      <Footer />
    </div>
  );
}

export default MarketingPage;

