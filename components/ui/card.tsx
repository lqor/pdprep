import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type CardProps = ComponentProps<"div">;

export function Card({ className, ...props }: CardProps) {
  return <div className={cn("card", className)} {...props} />;
}
