import type { ComponentProps } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function AppSeparator({
  className,
  ...props
}: ComponentProps<typeof Separator>) {
  return (
    <Separator
      {...props}
      className={cn("bg-gray-300", className)}
    />
  );
}
