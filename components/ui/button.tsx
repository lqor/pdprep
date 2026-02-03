import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost:
    "neo-border px-4 py-2 shadow-brutal bg-transparent text-textPrimary hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-brutal-lg transition",
};

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(variantClasses[variant], className)}
      {...props}
    />
  );
}
