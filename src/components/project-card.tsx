import Link from "next/link";
import type { Project } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { title, description, tasks, team, id } = project;
  const completedTasks = tasks.filter(task => task.status === 'Done').length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <Link href={`/projects/${id}`} className="block hover:shadow-lg transition-shadow duration-300 rounded-lg">
      <Card className="h-full flex flex-col transition-all border-border hover:border-primary">
        <CardHeader>
          <CardTitle className="font-headline">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex space-x-2 items-center text-sm text-muted-foreground">
            <span className="font-medium">Team:</span>
            <div className="flex -space-x-2 rtl:space-x-reverse">
              {team.map(user => (
                <Avatar key={user.id} className="w-8 h-8 border-2 border-card">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.slice(0,2)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2">
          <div className="w-full flex justify-between items-center text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardFooter>
      </Card>
    </Link>
  );
}
