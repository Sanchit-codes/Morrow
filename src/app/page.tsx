"use client";

import { Copy, ArrowRight, Waypoints, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

const FadeUp = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98], delay }}
    className={className}
  >
    {children}
  </motion.div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pageVariants: any = {
  initial: (d: number) => ({
    y: d > 0 ? "100%" : "-100%",
    scale: 1,
    filter: "brightness(1)",
    zIndex: 2,
  }),
  animate: {
    y: "0%",
    scale: 1,
    filter: "brightness(1)",
    zIndex: 2,
    transition: { duration: 1.2, ease: [0.65, 0, 0.35, 1] },
  },
  exit: (d: number) => ({
    y: d > 0 ? "-20%" : "20%",
    scale: 0.85,
    opacity: 0,
    filter: "brightness(0.3)",
    zIndex: 1,
    transition: { duration: 1.2, ease: [0.65, 0, 0.35, 1] },
  }),
};

const HeroSection = ({ onNext }: { onNext: () => void }) => (
  <div
    className="w-full h-full relative overflow-hidden"
    style={{ background: "var(--color-background)" }}
  >
    <div
      className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-80"
      style={{ backgroundImage: "url('/hero-bg.png')" }}
    />
    <div className="relative z-10 max-w-[1400px] mx-auto px-8 w-full h-full flex flex-col justify-center pb-20">
      <FadeUp delay={0.2}>
        <h1 className="text-5xl md:text-6xl lg:text-[80px] font-sans font-semibold mb-4 md:mb-6 leading-[1.05] tracking-tight">
          <span className="text-[#d8cdbf]">Your browser tab,</span>
          <br />
          <span className="text-[#d8a876]">finally yours.</span>
        </h1>
      </FadeUp>
      <FadeUp delay={0.3}>
        <p className="text-[#e2ddd8] text-base md:text-[18px] max-w-lg mb-8 md:mb-12">
          Stop staring at a blank page. Morrow turns every new tab into a
          focused workspace built around how you think.
        </p>
      </FadeUp>
      <FadeUp delay={0.4}>
        <button
          onClick={onNext}
          className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-[#ffe4c4] to-[#cba37b] text-[#543818] font-semibold rounded-full shadow-glow hover:brightness-110 active:shadow-sunken transition-all duration-300 hover:-translate-y-0.5"
        >
          Show me how
        </button>
      </FadeUp>
    </div>
  </div>
);

const AboutSection = () => (
  <div
    className="w-full h-full flex items-center px-4 md:px-8 relative overflow-hidden"
    style={{ background: "var(--color-background)" }}
  >
    <div className="fixed inset-0 grain-overlay z-0" />
    <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center z-10 relative mt-4 md:mt-0">
      <div className="space-y-6 lg:space-y-12 text-center lg:text-left flex flex-col items-center lg:items-start">
        <FadeUp delay={0.2} className="space-y-3 lg:space-y-4">
          <span
            className="font-label text-[10px] md:text-xs tracking-[0.2em] uppercase"
            style={{ color: "var(--color-primary)" }}
          >
            What is Morrow
          </span>
          <h2
            className="font-sans text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight"
            style={{ color: "var(--color-on-surface)" }}
          >
            Less tab, more
            <br className="hidden md:block" />
            <span style={{ color: "var(--color-primary-container)" }}>
              {" "}
              command center.
            </span>
          </h2>
          <p
            className="max-w-lg mx-auto lg:mx-0 mt-2 lg:mt-4 text-[14px] lg:text-[17px] leading-relaxed"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Everything you reach for in the first five minutes of a session —
            search, shortcuts, tasks, watchlist — in one place that stays out of
            your way.
          </p>
        </FadeUp>
        <ul className="space-y-6 lg:space-y-8 hidden md:block">
          {[
            {
              icon: "touch_app",
              title: "Tactile by design",
              desc: "Surfaces that feel pressed, recessed, real. A UI you can almost touch.",
            },
            {
              icon: "shield_lock",
              title: "No noise, ever",
              desc: "No news feed, no ads, no tracking. Just what you put there.",
            },
            {
              icon: "widgets",
              title: "Your layout, your rules",
              desc: "Five dashboard modes, custom cards, categories — shaped to your workflow.",
            },
          ].map((item, i) => (
            <FadeUp key={i} delay={0.3 + i * 0.1} className="flex gap-6 group">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-xl recessed-surface flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                style={{
                  color: "var(--color-primary)",
                  transform:
                    "perspective(1000px) rotateY(4.93967deg) rotateX(4.12109deg)",
                }}
              >
                <span
                  className="material-symbols-outlined select-none"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {item.icon}
                </span>
              </div>
              <div className="space-y-1">
                <h3
                  className="font-sans font-medium text-[19px]"
                  style={{ color: "var(--color-on-surface)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-[15px]"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  {item.desc}
                </p>
              </div>
            </FadeUp>
          ))}
        </ul>
      </div>
      <FadeUp
        delay={0.4}
        className="relative flex justify-center items-center w-full max-w-[280px] sm:max-w-sm mx-auto lg:max-w-xl"
      >
        <div
          className="w-full aspect-[4/3] rounded-[2.5rem] recessed-surface p-2 flex items-center justify-center relative overflow-hidden group interactive-tilt"
          style={{
            background: "var(--color-surface-container-lowest)",
            transform:
              "perspective(1000px) rotateY(4.93967deg) rotateX(4.12109deg)",
          }}
        >
          <div
            className="w-full h-full relative rounded-[2rem] p-6 lg:p-10 flex flex-col gap-6 overflow-hidden"
            style={{ background: "var(--color-surface)" }}
          >
            <div className="flex justify-between items-center w-full">
              <div className="flex gap-2">
                {[
                  "rgba(255,180,171,0.2)",
                  "rgba(251,195,138,0.2)",
                  "rgba(205,204,211,0.2)",
                ].map((c, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full recessed-surface-sm"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <div
                className="w-32 h-2 rounded-full recessed-surface-sm"
                style={{ background: "var(--color-surface-container-high)" }}
              />
            </div>
            <div className="flex-1 flex items-center justify-center relative scale-75 lg:scale-100">
              <div
                className="absolute w-64 h-64 rounded-full border animate-[spin_20s_linear_infinite]"
                style={{ borderColor: "rgba(80,69,58,0.1)" }}
              />
              <div
                className="absolute w-48 h-48 rounded-full border animate-[spin_15s_linear_infinite_reverse]"
                style={{ borderColor: "rgba(80,69,58,0.2)" }}
              />
              <div
                className="relative w-40 h-40 rounded-full recessed-surface flex items-center justify-center interactive-tilt group-hover:scale-105"
                style={{
                  background: "var(--color-surface-container-high)",
                  transform:
                    "perspective(1000px) rotateY(4.93967deg) rotateX(4.12109deg)",
                  transition: "transform 0.1s ease-out",
                }}
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center border shadow-[0_0_30px_rgba(251,195,138,0.1)]"
                  style={{
                    background: "rgba(251,195,138,0.05)",
                    borderColor: "rgba(251,195,138,0.2)",
                  }}
                >
                  <span
                    className="material-symbols-outlined text-4xl select-none"
                    style={{
                      color: "var(--color-primary)",
                      fontVariationSettings: "'FILL' 1",
                    }}
                  >
                    explore
                  </span>
                </div>
              </div>
              {/* Floating orbit cards */}
              <div
                className="absolute top-0 right-10 w-24 h-14 rounded-xl recessed-surface-sm p-3 flex flex-col gap-1.5 hidden lg:flex"
                style={{ background: "var(--color-surface-container)" }}
              >
                <div
                  className="w-full h-1 rounded-full"
                  style={{ background: "rgba(251,195,138,0.4)" }}
                />
                <div
                  className="w-1/2 h-1 rounded-full"
                  style={{ background: "rgba(80,69,58,0.4)" }}
                />
              </div>
              <div
                className="absolute bottom-10 left-4 w-28 h-12 rounded-xl recessed-surface-sm p-3 items-center gap-2 hidden lg:flex"
                style={{ background: "var(--color-surface-container)" }}
              >
                <div
                  className="w-6 h-6 rounded-lg border flex-shrink-0"
                  style={{
                    background: "rgba(205,204,211,0.1)",
                    borderColor: "rgba(205,204,211,0.2)",
                  }}
                />
                <div
                  className="w-12 h-1.5 rounded-full"
                  style={{ background: "rgba(212,196,182,0.3)" }}
                />
              </div>
            </div>
            <div className="flex gap-4 justify-center scale-90 lg:scale-100 pb-2">
              {["mail", "calendar_today", "analytics", "edit_note"].map(
                (icon, i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-xl ${i === 2 ? "recessed-surface border interactive-tilt" : "recessed-surface-sm"} flex items-center justify-center`}
                    style={
                      i === 2
                        ? {
                            background: "var(--color-surface-container-high)",
                            borderColor: "rgba(251,195,138,0.1)",
                            transform:
                              "perspective(1000px) rotateY(4.93967deg) rotateX(4.12109deg)",
                          }
                        : { background: "var(--color-surface)" }
                    }
                  >
                    <span
                      className="material-symbols-outlined select-none"
                      style={{
                        color:
                          i === 2
                            ? "var(--color-primary)"
                            : "rgba(199,198,202,0.5)",
                      }}
                    >
                      {icon}
                    </span>
                  </div>
                ),
              )}
            </div>
            {/* Decorative glow layer */}
            <div
              className="absolute -bottom-20 -right-20 w-64 h-64 blur-[100px] pointer-events-none"
              style={{ background: "rgba(251,195,138,0.05)" }}
            />
            <div
              className="absolute -top-20 -left-20 w-64 h-64 blur-[100px] pointer-events-none"
              style={{ background: "rgba(251,195,138,0.05)" }}
            />
          </div>
        </div>
      </FadeUp>
    </div>
  </div>
);

const OnboardingSection = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [copied, setCopied] = useState(false);
  return (
    <div
      className="w-full h-full flex flex-col md:flex-row"
      style={{ background: "var(--color-background)" }}
    >
      <div
        className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-center items-center p-6 md:p-16 h-1/4 sm:h-1/3 md:h-full relative overflow-hidden"
        style={{ background: "rgba(30,32,32,0.3)" }}
      >
        <div className="max-w-md w-full z-10 flex flex-col items-center text-center">
          <FadeUp delay={0.2} className="space-y-2 lg:space-y-4 w-full">
            <h2
              className="font-label text-[10px] sm:text-xs uppercase tracking-[0.2em]"
              style={{ color: "var(--color-primary)" }}
            >
              Onboarding
            </h2>
            <h1
              className="font-sans text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight"
              style={{ color: "var(--color-on-surface)" }}
            >
              How to Use
            </h1>
            <p
              className="text-[15px] leading-relaxed max-w-sm hidden sm:block mx-auto"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Follow these simple steps to configure your secluded digital
              environment.
            </p>
          </FadeUp>
          <FadeUp
            delay={0.3}
            className="relative h-64 w-full flex flex-col items-center justify-center mt-12 hidden md:flex"
          >
            <div
              className="w-32 h-32 rounded-3xl carved-surface flex items-center justify-center z-20 relative border shadow-[0_0_30px_rgba(0,0,0,0.5)] interactive-tilt"
              style={{
                background: "var(--color-surface-container-lowest)",
                borderColor: "rgba(80,69,58,0.1)",
              }}
            >
              <div
                className="absolute inset-0 rounded-3xl border"
                style={{ borderColor: "rgba(251,195,138,0.1)" }}
              />
              <Waypoints
                size={64}
                className="select-none pointer-events-none drop-shadow-[0_0_10px_rgba(251,195,138,0.3)] animate-pulse"
                style={{ color: "rgba(251,195,138,0.6)" }}
                strokeWidth={1}
              />
              {/* Inner ring — slow clockwise */}
              <div
                className="absolute -inset-10 rounded-full border border-dashed animate-[spin_40s_linear_infinite]"
                style={{ borderColor: "rgba(251,195,138,0.2)" }}
              >
                <div
                  className="absolute bottom-0 left-1/2 w-2 h-2 rounded-full -translate-x-1/2 translate-y-1/2"
                  style={{
                    background: "rgba(251,195,138,0.6)",
                    boxShadow: "0 0 6px rgba(251,195,138,0.8)",
                  }}
                />
              </div>
              {/* Outer ring — slow counter-clockwise with 2 dots */}
              <div
                className="absolute -inset-16 rounded-full border animate-[spin_30s_linear_infinite_reverse]"
                style={{ borderColor: "rgba(251,195,138,0.1)" }}
              >
                <div
                  className="absolute top-0 left-1/2 w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2"
                  style={{
                    background: "var(--color-primary)",
                    boxShadow: "0 0 8px rgba(251,195,138,0.9)",
                  }}
                />
                <div
                  className="absolute bottom-[14%] right-[14%] w-2 h-2 rounded-full translate-x-1/2 translate-y-1/2"
                  style={{
                    background: "rgba(251,195,138,0.8)",
                    boxShadow: "0 0 6px rgba(251,195,138,0.6)",
                  }}
                />
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
      <div
        className="w-full md:w-1/2 flex flex-col justify-center p-4 sm:p-6 md:p-12 h-3/4 sm:h-2/3 md:h-full relative overflow-hidden"
        style={{ background: "var(--color-surface)" }}
      >
        <div className="max-w-lg mx-auto w-full space-y-2 lg:space-y-4 scale-[0.85] sm:scale-100 origin-center">
          {[
            { n: 1, title: "Identity", desc: "Username and password only." },
            {
              n: 2,
              title: "Configure",
              desc: "Tailor the dashboard to your workflow.",
            },
            { n: 3, title: "Sync", desc: null },
            {
              n: 4,
              title: "Bridge",
              desc: "Install the marketplace extension.",
            },
          ].map((step) => (
            <FadeUp key={step.n} delay={0.2 + step.n * 0.1}>
              <div
                className="rounded-2xl p-4 lg:p-5 shadow-sunken border border-white/[0.02] flex gap-4 lg:gap-5 items-start"
                style={{ background: "var(--color-surface-container)" }}
              >
                <div
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full shadow-extruded flex-shrink-0 flex items-center justify-center font-sans text-sm lg:text-base"
                  style={{
                    background: "var(--color-surface-container-high)",
                    color: "var(--color-primary)",
                  }}
                >
                  {step.n}
                </div>
                <div className="w-full">
                  <h3
                    className="font-sans text-[15px] lg:text-[16px] mb-1"
                    style={{ color: "var(--color-on-surface)" }}
                  >
                    {step.title}
                  </h3>
                  {step.desc && (
                    <p
                      className="text-xs lg:text-sm"
                      style={{ color: "var(--color-on-surface-variant)" }}
                    >
                      {step.desc}
                    </p>
                  )}
                  {step.n === 3 && (
                    <div className="flex items-center gap-3">
                      <div
                        className="flex-1 px-4 py-2 rounded-xl shadow-sunken text-xs border border-white/[0.02] overflow-hidden whitespace-nowrap text-ellipsis"
                        style={{
                          background: "var(--color-surface-container-low)",
                          color: "var(--color-on-surface-variant)",
                        }}
                      >
                        morrow.app/user/dashboard
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            "morrow.app/user/dashboard",
                          );
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="w-10 h-10 rounded-xl shadow-extruded flex items-center justify-center hover:brightness-110 active:shadow-sunken transition-all cursor-pointer"
                        style={{
                          background: "var(--color-surface-container-high)",
                          color: "var(--color-primary)",
                        }}
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </FadeUp>
          ))}
          <FadeUp delay={0.7}>
            <div
              className="rounded-2xl p-4 lg:p-5 shadow-sunken border border-white/[0.02] flex gap-4 lg:gap-5 items-center"
              style={{ background: "var(--color-surface-container)" }}
            >
              <div
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full shadow-extruded flex-shrink-0 flex items-center justify-center font-sans text-sm lg:text-base"
                style={{
                  background: "var(--color-surface-container-high)",
                  color: "var(--color-primary)",
                }}
              >
                5
              </div>
              <div className="w-full flex justify-between items-center">
                <h3
                  className="font-sans text-[15px] lg:text-[16px]"
                  style={{ color: "var(--color-on-surface)" }}
                >
                  Finalize
                </h3>
                <Link
                  href={isLoggedIn ? "/home" : "/join"}
                  className="px-5 py-2.5 rounded-xl shadow-glow font-sans font-medium text-xs lg:text-sm hover:brightness-110 active:shadow-sunken transition-all group flex items-center gap-2"
                  style={{ background: "#f1c395", color: "#5c3e1e" }}
                >
                  {isLoggedIn ? "Dashboard" : "Launch"}{" "}
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                    style={{ color: "rgba(92,62,30,0.6)" }}
                  />
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  );
};

const NocturnalSection = () => (
  <div
    className="w-full h-full flex items-center px-4 md:px-8 relative overflow-hidden"
    style={{ background: "var(--color-background)" }}
  >
    <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mt-12 md:mt-0">
      <FadeUp
        delay={0.4}
        className="relative flex justify-center items-center order-2 lg:order-1 w-full max-w-[280px] sm:max-w-sm mx-auto lg:max-w-xl"
      >
        <div
          className="w-full aspect-square rounded-[2.5rem] recessed-surface p-2 flex items-center justify-center relative overflow-hidden group interactive-tilt"
          style={{ background: "var(--color-surface-container-lowest)" }}
        >
          <div
            className="w-full h-full relative rounded-[2rem] p-6 lg:p-10 flex flex-col items-center justify-center gap-6 overflow-hidden"
            style={{ background: "var(--color-surface)" }}
          >
            <div className="absolute w-full h-full flex items-center justify-center pointer-events-none">
              {(
                [
                  { size: 160, border: "rgba(251,195,138,0.3)" },
                  { size: 256, border: "rgba(251,195,138,0.2)" },
                  { size: 320, border: "rgba(251,195,138,0.05)" },
                ] as { size: number; border: string }[]
              ).map(({ size, border }, i) => (
                <div
                  key={i}
                  className="absolute rounded-full border animate-ping"
                  style={{
                    width: size,
                    height: size,
                    animationDuration: "4s",
                    animationDelay: `${i * 1.3}s`,
                    borderColor: border,
                  }}
                />
              ))}
            </div>
            <div
              className="relative w-32 h-32 lg:w-48 lg:h-48 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(251,195,138,0.15)] z-10 border"
              style={{
                background: "var(--color-surface-container-lowest)",
                borderColor: "rgba(251,195,138,0.3)",
              }}
            >
              <div
                className="absolute -inset-4 lg:-inset-8 rounded-full border border-dashed animate-[spin_30s_linear_infinite]"
                style={{ borderColor: "rgba(251,195,138,0.2)" }}
              />
              <div
                className="absolute -inset-8 lg:-inset-16 rounded-full border animate-[spin_20s_linear_infinite_reverse]"
                style={{ borderColor: "rgba(251,195,138,0.1)" }}
              >
                <div
                  className="absolute top-0 left-1/2 w-2 h-2 lg:w-3 lg:h-3 rounded-full shadow-glow -translate-x-1/2 -translate-y-1/2"
                  style={{ background: "rgba(251,195,138,0.6)" }}
                />
              </div>
              <div
                className="w-20 h-20 lg:w-32 lg:h-32 rounded-full flex items-center justify-center backdrop-blur-md"
                style={{ background: "rgba(251,195,138,0.1)" }}
              >
                <span
                  className="material-symbols-outlined text-[56px] lg:text-[80px] animate-pulse"
                  style={{
                    color: "var(--color-primary)",
                    fontVariationSettings: "'FILL' 1",
                    filter: "drop-shadow(0 0 15px rgba(251,195,138,0.6))",
                  }}
                >
                  flare
                </span>
              </div>
            </div>
            {/* Decorative glow layer */}
            <div
              className="absolute -bottom-20 -right-20 w-64 h-64 blur-[100px] pointer-events-none"
              style={{ background: "rgba(251,195,138,0.05)" }}
            />
            <div
              className="absolute -top-20 -left-20 w-64 h-64 blur-[100px] pointer-events-none"
              style={{ background: "rgba(251,195,138,0.05)" }}
            />
          </div>
        </div>
      </FadeUp>
      <div className="space-y-6 lg:space-y-12 order-1 lg:order-2 text-center lg:text-left flex flex-col items-center lg:items-start">
        <FadeUp delay={0.2} className="space-y-3 lg:space-y-4">
          <span
            className="font-label text-[10px] md:text-xs tracking-[0.2em] uppercase"
            style={{ color: "var(--color-primary)" }}
          >
            Visual Design
          </span>
          <h2
            className="font-sans text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight"
            style={{ color: "var(--color-on-surface)" }}
          >
            Dark by default,
            <br className="hidden lg:block" />
            <span style={{ color: "var(--color-primary-container)" }}>
              {" "}
              warm by choice.
            </span>
          </h2>
          <p
            className="max-w-lg mx-auto lg:mx-0 text-[14px] lg:text-[17px] leading-relaxed"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Not just a dark mode. Every shade was picked for long sessions in
            low light — warm amber against deep charcoal, with contrast that
            doesn't punish your eyes at midnight.
          </p>
        </FadeUp>
        <ul className="space-y-6 hidden md:block">
          {[
            {
              icon: "brightness_4",
              title: "Low-light native",
              desc: "Calibrated for the hours after sunset, not adapted from a light theme.",
            },
            {
              icon: "wb_incandescent",
              title: "Amber over blue",
              desc: "Warm tones that won't disrupt your sleep or your focus.",
            },
            {
              icon: "blur_on",
              title: "Glow with purpose",
              desc: "Every highlight guides your eye without competing for attention.",
            },
          ].map((item, i) => (
            <FadeUp key={i} delay={0.3 + i * 0.1} className="flex gap-6 group">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-xl recessed-surface flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                style={{ color: "var(--color-primary)" }}
              >
                <span
                  className="material-symbols-outlined text-[20px] select-none"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {item.icon}
                </span>
              </div>
              <div className="space-y-1">
                <h3
                  className="font-sans font-medium text-[19px]"
                  style={{ color: "var(--color-on-surface)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-[15px]"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  {item.desc}
                </p>
              </div>
            </FadeUp>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const CtaSection = ({
  onBackToTop,
  isLoggedIn,
}: {
  onBackToTop: () => void;
  isLoggedIn: boolean;
}) => (
  <div
    className="w-full h-full flex flex-col items-center justify-center text-center px-8 relative overflow-hidden"
    style={{ background: "var(--color-background)" }}
  >
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div
        className="w-[800px] h-[800px] rounded-full blur-[120px]"
        style={{ background: "rgba(251,195,138,0.05)" }}
      />
    </div>
    <div className="relative z-10 flex flex-col items-center">
      <FadeUp delay={0.2}>
        <div
          className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-6 md:mb-8 shadow-glow mx-auto border"
          style={{
            background: "var(--color-surface-container-high)",
            borderColor: "rgba(251,195,138,0.2)",
          }}
        >
          <span
            className="material-symbols-outlined text-xl md:text-2xl select-none"
            style={{
              color: "var(--color-primary)",
              fontVariationSettings: "'FILL' 1",
            }}
          >
            spa
          </span>
        </div>
      </FadeUp>
      <FadeUp delay={0.3}>
        <h2
          className="font-sans text-4xl sm:text-5xl md:text-[72px] leading-[1.05] font-semibold mb-6 md:mb-8 max-w-3xl tracking-tight"
          style={{ color: "var(--color-on-surface)" }}
        >
          Open a new tab.
          <br />
          <span
            className="font-medium italic"
            style={{ color: "rgba(251,195,138,0.8)" }}
          >
            Mean it this time.
          </span>
        </h2>
      </FadeUp>
      <FadeUp delay={0.4}>
        <Link
          href={isLoggedIn ? "/home" : "/join"}
          className="font-label text-[11px] sm:text-[13px] uppercase tracking-[0.2em] px-8 sm:px-12 py-4 sm:py-6 rounded-full glow-btn transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(251,195,138,0.6)] flex items-center gap-3 sm:gap-4"
          style={{ background: "var(--color-primary)", color: "#492900" }}
        >
          <span>{isLoggedIn ? "Dashboard" : "Enter Morrow"}</span>
          <span className="material-symbols-outlined text-[20px] select-none">
            arrow_forward
          </span>
        </Link>
      </FadeUp>
    </div>
    <FadeUp delay={0.6} className="absolute bottom-8 lg:bottom-12 z-30">
      <div
        onClick={onBackToTop}
        className="flex flex-col items-center gap-3 cursor-pointer group p-4"
      >
        <span
          className="font-label text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 group-hover:opacity-100 opacity-50"
          style={{ color: "var(--color-primary)" }}
        >
          Back to top
        </span>
        <svg
          width="32"
          height="64"
          viewBox="0 0 32 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-500 group-hover:-translate-y-2 opacity-30 group-hover:opacity-100"
          style={{ color: "var(--color-primary)" }}
        >
          <path d="M16 8 Q 8 20, 16 32 T 16 56" />
          <path d="M8 16 L16 8 L24 16" />
        </svg>
      </div>
    </FadeUp>
    <FadeUp delay={0.7} className="absolute bottom-6 left-8 z-30">
      <div className="flex items-center gap-4">
        <a
          href="https://github.com/Sanchit-codes/Morrow"
          target="_blank"
          rel="noopener noreferrer"
          className="font-label text-[10px] uppercase tracking-[0.2em] opacity-30 hover:opacity-70 transition-opacity duration-300"
          style={{ color: "var(--color-primary)" }}
        >
          Visit GitHub
        </a>
        <span className="opacity-20" style={{ color: "var(--color-primary)" }}>
          ·
        </span>
        <a
          className="font-label text-[10px] uppercase tracking-[0.2em] opacity-30"
          style={{ color: "var(--color-primary)" }}
          href="https://linkedin.com/in/lnsanchit"
        >
          by Sanchit
        </a>
      </div>
    </FadeUp>
  </div>
);

export default function LandingPage() {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  const [section, setSection] = useState(0);
  const [dir, setDir] = useState(1);
  const transitioning = useRef(false);
  const total = 5;

  const go = (i: number) => {
    if (i === section || transitioning.current) return;
    transitioning.current = true;
    setDir(i > section ? 1 : -1);
    setSection(i);
    setTimeout(() => {
      transitioning.current = false;
    }, 1000);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      document
        .querySelectorAll<HTMLElement>(".interactive-tilt")
        .forEach((el) => {
          el.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${y * -12}deg)`;
        });
    };
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (transitioning.current || Math.abs(e.deltaY) < 30) return;
      go(
        e.deltaY > 0
          ? Math.min(section + 1, total - 1)
          : Math.max(section - 1, 0),
      );
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [section]);

  useEffect(() => {
    let sy = 0;
    const onStart = (e: TouchEvent) => {
      sy = e.touches[0].clientY;
    };
    const onMove = (e: TouchEvent) => {
      e.preventDefault();
      if (transitioning.current) return;
      const d = sy - e.touches[0].clientY;
      if (Math.abs(d) < 50) return;
      go(d > 0 ? Math.min(section + 1, total - 1) : Math.max(section - 1, 0));
    };
    window.addEventListener("touchstart", onStart, { passive: false });
    window.addEventListener("touchmove", onMove, { passive: false });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
    };
  }, [section]);

  const sections = [
    <HeroSection key="hero" onNext={() => go(1)} />,
    <AboutSection key="about" />,
    <OnboardingSection key="onboard" isLoggedIn={isLoggedIn} />,
    <NocturnalSection key="nocturnal" />,
    <CtaSection key="cta" onBackToTop={() => go(0)} isLoggedIn={isLoggedIn} />,
  ];

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background: "var(--color-background)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Wordmark */}
      <div className="absolute top-6 left-8 z-50">
        <Image
          src="/morrow.png"
          alt="Morrow"
          width={50}
          height={26}
          style={{ objectFit: "contain" }}
          priority
        />
      </div>

      {/* Nav */}
      <div className="absolute top-6 right-16 md:right-24 z-50 flex gap-4 items-center">
        {isLoggedIn ? (
          <Link
            href="/home"
            className="font-label text-[12px] uppercase tracking-[0.15em] px-4 py-2 rounded-full glow-btn hover:brightness-110 transition-all"
            style={{ background: "var(--color-primary)", color: "#492900" }}
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/enter"
              className="font-label text-[12px] uppercase tracking-[0.15em] transition-colors"
              style={{ color: "var(--color-on-surface-variant)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-on-surface)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  "var(--color-on-surface-variant)")
              }
            >
              Sign in
            </Link>
            <Link
              href="/join"
              className="font-label text-[12px] uppercase tracking-[0.15em] px-4 py-2 rounded-full glow-btn hover:brightness-110 transition-all"
              style={{ background: "var(--color-primary)", color: "#492900" }}
            >
              Get started
            </Link>
          </>
        )}
      </div>

      {/* Section dots */}
      <div className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-end gap-1">
        <div
          className="font-label text-[9px] uppercase tracking-[0.4em] rotate-90 origin-right mb-6 translate-x-[4px] mt-2 opacity-40"
          style={{ color: "var(--color-primary)" }}
        >
          Index
        </div>
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className="relative flex items-center justify-end w-20 h-10 group"
            aria-label={`Section ${i + 1}`}
          >
            <span
              className={`mr-4 font-label text-[10px] tracking-[0.2em] transition-all duration-500 ${section === i ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-2"}`}
              style={{ color: "var(--color-primary)" }}
            >
              0{i + 1}
            </span>
            <div
              className={`w-[2px] transition-all duration-700 rounded-full ${section === i ? "h-full" : "h-1/3 group-hover:h-2/3"}`}
              style={{
                background:
                  section === i
                    ? "var(--color-primary)"
                    : "rgba(255,255,255,0.1)",
                boxShadow:
                  section === i ? "0 0 15px rgba(251,195,138,0.7)" : "none",
              }}
            />
          </button>
        ))}
      </div>

      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={section}
          custom={dir}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 z-0 will-change-transform"
        >
          {sections[section]}
        </motion.div>
      </AnimatePresence>

      {/* Scroll hint */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-50 transition-opacity duration-700 pointer-events-none ${section === 0 ? "opacity-100" : "opacity-0"}`}
      >
        <div className="flex flex-col items-center gap-3 text-[#d8a876]">
          <span className="font-label uppercase text-[10px] tracking-[0.3em] opacity-60">
            Scroll
          </span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-[#d8a876] to-transparent overflow-hidden relative">
            <div className="w-full h-1/2 bg-white absolute top-0 animate-[slide_2s_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
}
