"use server";

import { suggestProjectImprovements } from "@/ai/flows/suggest-project-improvements";
import { projects } from "@/lib/data";
import type { Project } from "@/lib/types";

// Helper function to format project data for the AI prompt
function formatProjectForAI(project: Project): string {
    const taskSummary = project.tasks.map(t => `- ${t.title} (Status: ${t.status})`).join('\n');
    return `
      Project: ${project.title}
      Description: ${project.description}
      Approach & Tasks:
      ${taskSummary}
      Team Size: ${project.team.length}
      Outcome: Considered successful, completed on time and on budget.
    `;
}

export async function getAISuggestions(currentProject: Project) {
  try {
    const successfulProjectsData = projects
        .filter(p => p.id !== currentProject.id) // Exclude the current project
        .map(formatProjectForAI);

    const result = await suggestProjectImprovements({
      title: currentProject.title,
      description: currentProject.longDescription || currentProject.description,
      successfulProjects: successfulProjectsData,
    });
    
    return result;
  } catch (error) {
    console.error("Error getting AI suggestions:", error);
    throw new Error("Failed to get suggestions from AI assistant. Please try again later.");
  }
}
