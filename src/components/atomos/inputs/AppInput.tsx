import type { ComponentProps, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AppInputProps = ComponentProps<typeof Input> & {
  icono?: ReactNode;
};

export function AppInput({
  className,
  icono,
  ...props
}: AppInputProps) {
  return (
    <div className="relative w-full">
      {icono != null && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground [&_svg]:size-4"
        >
          {icono}
        </span>
      )}
      <Input
        {...props}
        className={cn(
          "border border-gray-400",
          icono != null && "pl-9",
          className,
        )}
      />
    </div>
  );
}
