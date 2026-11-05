"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type LabelProps = React.ComponentProps<typeof LabelPrimitive.Root> & {
  required?: boolean;
  guideline?: React.ReactNode;
};

function Label({ className, required, guideline, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center text-base leading-none font-normal select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 data-[state=active]:text-gray-700 dark:text-white/80 dark:data-[state=active]:text-white",
        className,
      )}
      {...props}
    >
      {props.children}
      {required && <span className="text-destructive">*</span>}
      {guideline && (
        <Popover>
          <PopoverTrigger asChild className="ms-2">
            <button className="bg-primary text-primary-foreground flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-xs">
              ?
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-fit">{guideline}</PopoverContent>
        </Popover>
      )}
    </LabelPrimitive.Root>
  );
}

export { Label };
