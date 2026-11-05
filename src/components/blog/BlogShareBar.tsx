"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy, Linkedin, Share2, Twitter } from "lucide-react";
import { useState } from "react";

type BlogShareBarProps = {
  title: string;
  slug: string;
};

export const BlogShareBar = ({ title, slug }: BlogShareBarProps) => {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/blog/${slug}`;
    }
    return `https://abirmahmud.com/blog/${slug}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(`Read "${title}" by @abirmahmud`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank", "noopener");
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank", "noopener");
  };

  return (
    <div className="border-border/70 bg-card/60 flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 shadow-xs">
      <div className="flex items-center gap-2">
        <Share2 className="text-muted-foreground h-4 w-4" />
        <span className="text-foreground text-xs font-semibold">Share this article:</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="gap-1.5 text-xs font-medium"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span>{copied ? "Link Copied!" : "Copy Link"}</span>
        </Button>

        <Button
          variant="outline"
          size="icon-sm"
          onClick={handleShareTwitter}
          title="Share on Twitter / X"
        >
          <Twitter className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="outline"
          size="icon-sm"
          onClick={handleShareLinkedIn}
          title="Share on LinkedIn"
        >
          <Linkedin className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
