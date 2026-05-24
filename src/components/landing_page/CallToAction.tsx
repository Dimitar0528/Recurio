"use client";

import { useRef, useState } from "react";
import { SubIcon } from "../shared/SubIcon";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const FLOATING_SUBS = [
  // Outer Edge - Left Column
  {
    name: "Netflix",
    pos: "left-[4%] sm:left-[18%] top-[30%] md:top-[32%]",
    anim: "animate-float-x",
    delay: "0s",
    duration: "7s",
  },
  {
    name: "Figma",
    pos: "left-[4%] sm:left-[6%] lg:left-[12%] bottom-[10%] md:bottom-[20%]",
    anim: "animate-float-diag",
    delay: "2.4s",
    duration: "9s",
  },

  // Outer Edge - Right Column
  {
    name: "Spotify",
    pos: "right-[9%] sm:right-[18%] top-[30%] md:top-[32%]",
    anim: "animate-float-x",
    delay: "1.2s",
    duration: "8s",
  },
  {
    name: "Discord",
    pos: "right-[5%] sm:right-[6%] lg:right-[10%] bottom-[10%] md:bottom-[20%]",
    anim: "animate-float-diag",
    delay: "0.6s",
    duration: "6.5s",
  },

  // Mid-Inner Left Quadrant
  {
    name: "Vercel",
    pos: "left-[3%] md:left-[5%] lg:left-[10%] bottom-[38%] hidden sm:flex",
    anim: "animate-float-x",
    delay: "1.5s",
    duration: "8.2s",
  },
  {
    name: "YouTube",
    pos: "left-[24%] sm:left-[22%] bottom-[2%] hidden md:flex",
    anim: "animate-float-y",
    delay: "0.3s",
    duration: "10s",
  },

  // Mid-Inner Right Quadrant
  {
    name: "Claude",
    pos: "right-[3%] md:right-[5%] lg:right-[10%] bottom-[38%] hidden sm:flex",
    anim: "animate-float-x",
    delay: "2.7s",
    duration: "7.4s",
  },
  {
    name: "Github",
    pos: "right-[26%] sm:right-[22%] bottom-[2%] hidden md:flex",
    anim: "animate-float-y",
    delay: "1.5s",
    duration: "7.2s",
  },

  // Center Upper & Lower Bands
  {
    name: "Canva",
    pos: "left-[38%] top-[37%] hidden lg:flex",
    anim: "animate-float-diag",
    delay: "0.4s",
    duration: "9.5s",
  },
  {
    name: "Disney",
    pos: "right-[37%] top-[37%] hidden lg:flex",
    anim: "animate-float-y",
    delay: "1.1s",
    duration: "8.8s",
  },
  {
    name: "Adobe",
    pos: "left-[38%] bottom-[9%] hidden lg:flex",
    anim: "animate-float-diag",
    delay: "1.7s",
    duration: "9.2s",
  },
  {
    name: "Zoom",
    pos: "right-[37%] bottom-[9%] hidden lg:flex",
    anim: "animate-float-y",
    delay: "2.9s",
    duration: "8s",
  },
];

export default function CallToAction() {
  const t = useTranslations("landing_page.cta_component");

  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xc = rect.width / 2;
    const yc = rect.height / 2;

    const rotX = -((y - yc) / yc) * 10;
    const rotY = ((x - xc) / xc) * 10;

    setTilt({ x: rotX, y: rotY });

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlare({ x: glareX, y: glareY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section className="relative py-16">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float-y {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float-x {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(12px); }
        }
        @keyframes float-diag {
          0%, 100% { transform: translate(0px, 0px); }
          50% { transform: translate(-8px, -8px); }
        }
        .animate-float-y { animation: float-y var(--duration, 6s) ease-in-out infinite; }
        .animate-float-x { animation: float-x var(--duration, 6s) ease-in-out infinite; }
        .animate-float-diag { animation: float-diag var(--duration, 6s) ease-in-out infinite; }
      `,
        }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.05)_1px,transparent_1px)] bg-size-[16px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center max-w-4xl">
        <div className="space-y-4 mb-16 md:mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-2xl mx-auto leading-none">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Central Card with Interactive 3D Rotation */}
        <div className="relative w-full flex items-center justify-center min-h-[260px] mb-12">
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative w-full max-w-[340px] sm:max-w-[380px] md:max-w-[480px] h-[210px] sm:h-[220px] rounded-2xl bg-zinc-950 text-white border border-zinc-800 shadow-2xl overflow-hidden cursor-pointer select-none"
            style={{
              transform: isHovered
                ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
                : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
              transition: isHovered
                ? "none"
                : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
              transformStyle: "preserve-3d",
            }}>
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
              style={{
                background: `radial-gradient(circle 200px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.15), transparent)`,
                opacity: isHovered ? 1 : 0,
              }}
            />

            <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] bg-size-[10px_10px] pointer-events-none" />

            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-start gap-1">
                  <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-mono font-bold">
                    {t("card.active_tracker")}
                  </span>
                  <span className="text-sm font-semibold tracking-wider font-sans text-zinc-200">
                    {t("card.subscriptions")}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-primary to-primary/40 p-px flex items-center justify-center shadow-lg">
                  <div className="w-full h-full rounded-[7px] bg-zinc-950 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-sm bg-primary rotate-45" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center font-mono my-2">
                <div className="text-lg sm:text-2xl tracking-[0.2em] text-zinc-300 font-bold flex gap-3">
                  <span>••••</span>
                  <span>••••</span>
                  <span>••••</span>
                  <span className="text-primary font-bold">1337</span>
                </div>
              </div>

              <div className="flex items-end justify-between border-t border-zinc-800/60 pt-4">
                <div className="flex flex-col items-start">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono">
                    {t("card.provider")}
                  </span>
                  <span className="text-xs font-semibold text-zinc-100 font-sans tracking-wide">
                    Recurio
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono">
                    {t("card.total_amount_tracked")}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    {t("card.total_value")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
          {FLOATING_SUBS.map((sub) => (
            <div
              key={sub.name}
              className={`absolute ${sub.pos} ${sub.anim} flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/40 backdrop-blur-md shadow-sm transition-opacity duration-300`}
              style={{
                ["--duration" as string]: sub.duration,
                animationDelay: sub.delay,
              }}>
              <SubIcon name={sub.name} className="w-6 h-6 bg-gray-200" />
              <span className="text-[11px] font-medium tracking-wide text-card-foreground">
                {sub.name}
              </span>
            </div>
          ))}
        </div>
        <Link href="/dashboard">
          <button className="relative group px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center gap-2 pointer-events-auto cursor-pointer hover:scale-[1.02] active:scale-[0.98] overflow-hidden">
            {t("primary")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </section>
  );
}
