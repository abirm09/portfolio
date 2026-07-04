"use client";

import { Button } from "@/components";
import { Input } from "@/components/ui/Input";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Textarea } from "@/components/ui/Textarea";
import { Github, Linkedin, Mail, MapPin, Send, Twitter } from "lucide-react";
import Link from "next/link";

const socialLinks = [
  {
    name: "GitHub",
    icon: Github,
    url: "https://github.com/abirm09",
    color: "hover:text-gray-900 dark:hover:text-white",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://www.linkedin.com/in/abirm09",
    color: "hover:text-blue-600",
  },
  {
    name: "Twitter",
    icon: Twitter,
    url: "https://x.com/abirm09",
    color: "hover:text-sky-500",
  },
];

export const Contact = () => {
  return (
    <SectionWrapper id="contact" className="section-bg-contact">
      <SectionTitle
        title="Get In Touch"
        subtitle="// Have a project in mind? Let's talk about how we can work together"
      />

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-4">Let&apos;s Connect</h3>
            <p className="text-muted-foreground leading-relaxed">
              I&apos;m always open to discussing new projects, creative ideas, or opportunities to
              be part of your vision. Feel free to reach out!
            </p>
          </div>

          {/* Contact details */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <a
                  href="mailto:hello@abirmahmud.dev"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  hello@abirmahmud.dev
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="text-foreground">Bangladesh</p>
              </div>
            </div>
          </div>

          {/* Social links */}
          <div>
            <p className="text-sm text-muted-foreground mb-4">Follow me</p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  className={`w-10 h-10 rounded-lg card-glass flex items-center justify-center text-muted-foreground transition-all duration-300 hover:-translate-y-1 ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-6 rounded-xl card-glass">
          <form className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Name
                </label>
                <Input id="name" name="name" placeholder="Your name" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <Input id="email" name="email" type="email" placeholder="your@email.com" required />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                Subject
              </label>
              <Input id="subject" name="subject" placeholder="What's this about?" required />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell me about your project..."
                rows={5}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              <Send className="w-4 h-4" />
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </SectionWrapper>
  );
};
