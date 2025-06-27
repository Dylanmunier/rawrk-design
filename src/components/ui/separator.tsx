import * as React from "react";
import { cn } from "@/lib/utils";

export function Separator({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className={cn("border-t border-border my-4", className)} {...props} />;
}
