import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const AGE_OF_PROPERTY_LABELS: Record<string, string> = {
  ZeroToOne: "0-1 Years",
  OneToThree: "1-3 Years",
  ThreeToSix: "3-6 Years",
  SixToTen: "6-10 Years",
  TenPlus: "10+ Years",
}

export function formatAgeOfProperty(value: string | null | undefined): string {
  if (!value) return ""
  return AGE_OF_PROPERTY_LABELS[value] ?? value
}
