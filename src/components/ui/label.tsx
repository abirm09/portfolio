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
        "flex items-center leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-base font-normal data-[state=active]:text-gray-700 dark:data-[state=active]:text-white dark:text-white/80",
        className,
      )}
      {...props}
    >
      {props.children}
      {required && <span className="text-destructive">*</span>}
      {guideline && (
        <>
          <Popover>
            <PopoverTrigger asChild className="ms-2">
              <button className="bg-primary text-primary-foreground w-4 h-4 rounded-full flex justify-center items-center text-xs cursor-pointer">
                ?
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-fit">{guideline}</PopoverContent>
          </Popover>
        </>
      )}
    </LabelPrimitive.Root>
  );
}

export { Label };
