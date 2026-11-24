import { Field, FieldContent, FieldLabel } from "./field";
import { cn } from "../lib/utils";

interface LabeledFieldProps {
  label: string;
  value?: React.ReactNode;
  className?: string;
}

export function LabeledField({ label, value, className }: LabeledFieldProps) {
  if (value === undefined || value === null || value === false || value === "") return null;
  return (
    <Field className={cn("items-start gap-1.5", className)}>
      <FieldLabel className="text-xs font-normal text-muted-foreground">{label}</FieldLabel>
      <FieldContent className="text-sm font-medium text-foreground tabular-nums">{value}</FieldContent>
    </Field>
  );
}
