"use client";

import { Button } from "@/components";
import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="flex items-center justify-center relative overflow-hidden py-16 md:py-28">
      {/* Ambient backdrop: aurora blobs + blueprint grid */}
      <div className="absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0" />
        <div className="aurora-blob animate-aurora top-[-10%] left-[-5%] w-[38rem] h-[38rem] bg-primary/40" />
        <div
          className="aurora-blob animate-aurora bottom-[-15%] right-[-8%] w-[42rem] h-[42rem] bg-accent/35"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="aurora-blob animate-aurora top-[30%] left-[45%] w-[26rem] h-[26rem] bg-primary/25"
          style={{ animationDelay: "-11s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 md:px-5 text-center">
        {/* Greeting badge */}
        <div className="gradient-border inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/40 backdrop-blur-md mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-sm text-foreground/80">Available for work</span>
        </div>

        {/* Main heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-slide-up">
          Hi, I&apos;m <span className="gradient-text">Abir Mahmud</span>
        </h1>

        {/* Title */}
        <p className="text-md md:text-lg text-muted-foreground mb-4 animate-slide-up delay-100">
          Full Stack Web Developer
        </p>

        {/* Tagline */}
        <p className="text-sm md:text-md text-foreground/80 max-w-3xl mx-auto mb-10 animate-slide-up delay-200">
          I build responsive websites, scalable APIs,{" "}
          <span className="text-primary font-medium">authentication systems</span>, and{" "}
          <span className="text-primary font-medium">modern web applications</span> using
          JavaScript, TypeScript, React, Next.js, Node.js, Python, and FastAPI.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-300">
          <Button size="lg" variant="gradient" className="group" asChild>
            <Link href="#projects">
              View Projects
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="backdrop-blur-md" asChild>
            <Link href="#" target="_blank">
              <Download className="size-4" />
              Download Resume
            </Link>
          </Button>
        </div>

        {/* Tech stack preview */}
        <div className="mt-16 animate-fade-in delay-500">
          <p className="text-sm text-muted-foreground mb-4">Tech Stack</p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-muted-foreground">
            {[
              "React",
              "Next.js",
              "Node.js",
              "FastAPI",
              "MongoDB",
              "PostgreSQL",
              "TypeScript",
              "Python",
            ].map((tech) => (
              <span
                key={tech}
                className="text-sm font-medium px-3 py-1.5 rounded-lg card-glass text-foreground/80 hover:text-primary hover:-translate-y-0.5"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
