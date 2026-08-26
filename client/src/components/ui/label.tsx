import * as React from "react";
import { cn } from "../../lib/utils";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      className={cn("grid gap-2 text-sm font-medium text-foreground", className)}
      ref={ref}
      {...props}
    />
  )
);

Label.displayName = "Label";
