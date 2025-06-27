import type { LucideIcon } from "lucide-react";

export interface CustomizationOption {
  value: string;
  label: string;
  price: number;
  icon?: LucideIcon;
  color?: string;
  aliases?: string[];
}

export interface Selections {
  interior: CustomizationOption;
  comfort: CustomizationOption[];
}
