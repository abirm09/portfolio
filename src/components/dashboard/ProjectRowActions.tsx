"use client";

import { Button } from "@/components/ui/button";
import { TProject } from "@/data/projects";
import { useDeleteProjectMutation, useToggleFeaturedMutation } from "@/hooks/useProjectsQuery";
import { Edit, ExternalLink, Loader2, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type ProjectRowActionsProps = {
  project: TProject;
};

export const ProjectRowActions = ({ project }: ProjectRowActionsProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const deleteMutation = useDeleteProjectMutation();
  const toggleFeaturedMutation = useToggleFeaturedMutation();

  const handleToggleFeatured = () => {
    toggleFeaturedMutation.mutate({
      id: project.id,
      featured: !project.featured,
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(project.id, {
      onSuccess: () => {
        setShowConfirm(false);
      },
      onError: (err: any) => {
        alert(err.message || "Failed to delete project.");
      },
    });
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      {/* Featured Star toggle */}
      <button
        type="button"
        onClick={handleToggleFeatured}
        disabled={toggleFeaturedMutation.isPending}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
          project.featured
            ? "text-amber-500 hover:bg-amber-500/10"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
        }`}
        title={project.featured ? "Remove from Featured" : "Mark as Featured"}
      >
        {toggleFeaturedMutation.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        ) : (
          <Star className={`w-4 h-4 ${project.featured ? "fill-amber-500" : ""}`} />
        )}
      </button>

      {/* View Public page */}
      <Button variant="ghost" size="icon-sm" asChild title="View on site">
        <Link href={`/projects/${project.slug}`} target="_blank">
          <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-foreground" />
        </Link>
      </Button>

      {/* Edit project */}
      <Button variant="ghost" size="icon-sm" asChild title="Edit project">
        <Link href={`/dashboard/projects/${project.id}/edit`}>
          <Edit className="w-4 h-4 text-primary" />
        </Link>
      </Button>

      {/* Delete project */}
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
        title="Delete project"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-card border border-border p-6 space-y-4 shadow-2xl animate-fade-in text-left">
            <h3 className="font-bold text-lg text-foreground">Delete Project?</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-foreground">{project.title}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirm(false)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
                  </>
                ) : (
                  "Delete Project"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
