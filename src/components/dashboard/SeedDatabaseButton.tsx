"use client";

import { Button } from "@/components/ui/button";
import { useSeedProjectsMutation } from "@/hooks/useProjectsQuery";
import { Check, Database, Loader2 } from "lucide-react";
import { useState } from "react";

export const SeedDatabaseButton = () => {
  const [done, setDone] = useState(false);
  const seedMutation = useSeedProjectsMutation();

  const handleSeed = () => {
    if (
      !confirm(
        "Do you want to sync/seed initial sample projects into your Supabase database?",
      )
    ) {
      return;
    }

    seedMutation.mutate(undefined, {
      onSuccess: () => {
        setDone(true);
        setTimeout(() => setDone(false), 3000);
      },
      onError: (err: any) => {
        alert(err.message || "Failed to seed database.");
      },
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSeed}
      disabled={seedMutation.isPending || done}
      className="text-xs h-8 gap-1.5"
    >
      {seedMutation.isPending ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Seeding DB...
        </>
      ) : done ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-500" /> Seeded!
        </>
      ) : (
        <>
          <Database className="w-3.5 h-3.5" /> Sync/Seed Initial Data
        </>
      )}
    </Button>
  );
};
