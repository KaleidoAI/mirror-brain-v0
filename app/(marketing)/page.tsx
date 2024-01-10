"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import {
  type Container,
  type ISourceOptions,
} from "@tsparticles/engine";
// import { loadAll } from "@/tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.

import { Footer } from "./_components/footer";
import { Heading } from "./_components/heading";
import { Feat1 } from "./_components/feat1";
import { Feat2 } from "./_components/feat2";
import { Feat3 } from "./_components/feat3";

const MarketingPage = () => {
  const [init, setInit] = useState(false);

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadAll(engine);
      //await loadFull(engine);
      await loadSlim(engine);
      //await loadBasic(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container);
  };

  const options: ISourceOptions = useMemo(
    () => ({
      fpsLimit: 120,
      fullScreen: {
        "enable": false
      },
      style: {
        position: "absolute",
        height: "100vh",
      },
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "out",
          },
          random: false,
          speed: 6,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 80,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  if (init) {
    return (
      <><Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
      />
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
    </div></>
      
    );
  }

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

