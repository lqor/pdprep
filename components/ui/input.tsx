import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type InputProps = ComponentProps<"input">;

export function Input({ className, ...props }: InputProps) {
  return <input className={cn("input", className)} {...props} />;
}
