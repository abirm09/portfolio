import meDark from "@/assets/me-dark.webp";
import meWhite from "@/assets/me-white.webp";
import { Button } from "@/components/ui/button";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Hero = () => (
  <section className="h-[calc(100svh-68px)] min-h-0 px-4 py-4 md:h-[calc(100svh-73px)] md:px-6 md:py-5">
    <div className="hero-panel mx-auto h-full max-w-7xl overflow-hidden rounded-[1.75rem]">
      <div className="grid h-full lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative z-10 flex min-h-0 flex-col justify-between p-6 sm:p-8 lg:px-10 lg:py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-xs font-semibold tracking-[0.12em] text-white uppercase">
              <span className="size-2 rounded-full bg-[#c8ee73]" /> Available for projects
            </span>
            <span className="hero-meta text-xs font-medium tracking-[0.18em] text-white/65 uppercase">
              Based in Bangladesh · Working worldwide
            </span>
          </div>
          <div className="py-4 lg:py-5">
            <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-[#c8ee73] uppercase sm:text-sm">
              Full stack developer / creative problem solver
            </p>
            <h1 className="max-w-[850px] text-[clamp(2.8rem,5.5vw,5.75rem)] leading-[0.94] font-semibold tracking-[-0.065em] text-white">
              Digital ideas,
              <br />
              <span className="text-[#c8ee73]">built to work.</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/72 sm:text-base">
              I&apos;m Abir Mahmud. I build thoughtful web experiences and dependable systems that
              turn ambitious ideas into products people enjoy using.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="h-12 rounded-full bg-[#c8ee73] px-6 font-semibold text-[#152219] shadow-none hover:bg-[#d9fa96]"
                asChild
              >
                <Link href="#projects">
                  Explore my work <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                className="h-12 rounded-full border border-white/30 bg-transparent px-6 text-white shadow-none hover:bg-white/10"
                asChild
              >
                <Link href="#contact">
                  Let&apos;s talk <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="hero-footer flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-4 text-xs text-white/65 sm:text-sm">
            <span className="hidden sm:inline">Next.js · TypeScript · NestJS · PostgreSQL</span>
            <Link
              href="#about"
              className="inline-flex items-center gap-2 font-medium text-white hover:text-[#c8ee73]"
            >
              Scroll to discover <ArrowDownRight className="size-4" />
            </Link>
          </div>
        </div>
        <div className="relative hidden min-h-0 overflow-hidden bg-white lg:block dark:bg-[#0d1111]">
          <div className="absolute top-7 right-7 z-10 rounded-full bg-[#c8ee73] px-4 py-2 text-xs font-semibold tracking-widest text-[#17291f] uppercase">
            Portfolio / 2026
          </div>
          <Image
            src={meWhite}
            alt="Abir Mahmud"
            priority
            className="absolute inset-0 h-full w-full object-cover object-center dark:hidden"
          />
          <Image
            src={meDark}
            alt=""
            priority
            className="absolute inset-0 hidden h-full w-full object-cover object-center dark:block"
          />
          <div className="absolute bottom-6 left-6 z-10 rounded-2xl bg-[#17291f] px-5 py-4 text-white shadow-xl sm:bottom-9 sm:left-9">
            <span className="block text-xs tracking-widest text-[#c8ee73] uppercase">
              Currently focused on
            </span>
            <span className="mt-1 block text-lg font-semibold">Useful digital products.</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);
