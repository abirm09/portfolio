"use client";

import { Button } from "@/components";
import { Input } from "@/components/ui/Input";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Textarea } from "@/components/ui/Textarea";
import { CheckCircle2, Loader2, Mail, MapPin, Send, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";

const socialLinks = [
  {
    name: "GitHub",
    icon: "/github.png",
    url: "https://github.com/abirm09",
    color: "hover:text-gray-900 dark:hover:text-white",
  },
  {
    name: "LinkedIn",
    icon: "/linkedin.png",
    url: "https://www.linkedin.com/in/abirm09",
    color: "hover:text-blue-600",
  },
  {
    name: "Twitter",
    icon: "/twitter.png",
    url: "https://x.com/abirm09",
    color: "hover:text-sky-500",
  },
];

const initialFormState = { name: "", email: "", subject: "", message: "" };

type FormStatus = "idle" | "loading" | "success" | "error";

export const Contact = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Failed to send your message. Please try again later.");
      }

      setStatus("success");
      setFormData(initialFormState);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  };

  return (
    <SectionWrapper id="contact" className="section-bg-contact">
      <SectionTitle
        title="Get In Touch"
        subtitle="// Have a project in mind? Let's talk about how we can work together"
      />

      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h3 className="text-foreground mb-4 text-xl font-bold">Let&apos;s Connect</h3>
            <p className="text-muted-foreground leading-relaxed">
              I&apos;m always open to discussing new projects, creative ideas, or opportunities to
              be part of your vision. Feel free to reach out!
            </p>
          </div>

          {/* Contact details */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                <Mail className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Email</p>
                <a
                  href="mailto:contact@abirmahmud.dev"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  contact@abirmahmud.dev
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                <MapPin className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Location</p>
                <p className="text-foreground">Bangladesh</p>
              </div>
            </div>
          </div>

          {/* Social links */}
          <div>
            <p className="text-muted-foreground mb-4 text-sm">Follow me</p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  className={`card-glass text-muted-foreground flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 hover:-translate-y-1 ${social.color}`}
                  aria-label={social.name}
                >
                  <Image src={social.icon} alt="" width={20} height={20} className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card-glass rounded-xl p-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="text-foreground mb-2 block text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  disabled={status === "loading"}
                />
              </div>
              <div>
                <label htmlFor="email" className="text-foreground mb-2 block text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={status === "loading"}
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="text-foreground mb-2 block text-sm font-medium">
                Subject
              </label>
              <Input
                id="subject"
                name="subject"
                placeholder="What's this about?"
                required
                value={formData.subject}
                onChange={handleChange}
                disabled={status === "loading"}
              />
            </div>

            <div>
              <label htmlFor="message" className="text-foreground mb-2 block text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell me about your project..."
                rows={5}
                required
                value={formData.message}
                onChange={handleChange}
                disabled={status === "loading"}
              />
            </div>

            {status === "success" && (
              <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Thanks! Your message has been sent — I&apos;ll get back to you soon.
              </div>
            )}

            {status === "error" && (
              <div className="bg-destructive/10 text-destructive flex items-center gap-2 rounded-lg px-4 py-3 text-sm">
                <XCircle className="h-4 w-4 shrink-0" />
                {errorMessage}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={status === "loading"}>
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </SectionWrapper>
  );
};
