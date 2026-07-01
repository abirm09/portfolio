"use client";

import { Button } from "@/components";
import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="flex items-center justify-center relative overflow-hidden py-10 md:py-20">
      {/* Background gradient decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-3 md:px-5 text-center">
        {/* Greeting badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">Available for work</span>
        </div>

        {/* Main heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 animate-slide-up">
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
          <Button size="lg" className="group" asChild>
            <Link href="#projects">
              View Projects
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          {/* <Button size="lg" variant="outline" asChild>
            <Link href="#contact">
              <Mail className="size-4" />
              Contact Me
            </Link>
          </Button> */}
          <Button size="lg" variant="outline" asChild>
            <Link href="#" target="_blank">
              <Download className="size-4" />
              Download Resume
            </Link>
          </Button>
        </div>

        {/* Tech stack preview */}
        <div className="mt-16 animate-fade-in delay-500">
          <p className="text-sm text-muted-foreground mb-4">Tech Stack</p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
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
                className="text-sm font-medium px-3 py-1.5 rounded-lg bg-secondary/50 border border-border hover:border-primary/50 transition-colors"
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
