import { cn } from "../lib/utils";
import { Button } from "./button";

interface TogglePillsProps {
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function TogglePills({
  options,
  selected,
  onToggle,
  disabled,
  className,
  "aria-label": ariaLabel,
}: TogglePillsProps) {
  return (
    <div
      data-slot="toggle-pills"
      role="group"
      aria-label={ariaLabel}
      className={cn("flex flex-wrap gap-2", className)}
    >
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <Button
            key={option}
            type="button"
            size="sm"
            variant={isSelected ? "default" : "secondary"}
            aria-pressed={isSelected}
            disabled={disabled}
            onClick={() => onToggle(option)}
            className={cn(!isSelected && "text-muted-foreground hover:text-foreground")}
          >
            {option}
          </Button>
        );
      })}
    </div>
  );
}
