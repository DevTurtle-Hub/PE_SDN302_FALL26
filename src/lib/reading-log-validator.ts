import { VALID_GENRES, CreateReadingLogInput, UpdateReadingLogInput } from "@/types/reading-log";

export interface ValidationResult {
  isValid: boolean;
  errors: {
    bookTitle?: string;
    minutesRead?: string;
    genre?: string;
    readOn?: string;
  };
  firstError?: string;
}

export function getTodayDateString(): string {
  const now = new Date();
  const utcStr = now.toISOString().slice(0, 10);
  const localYear = now.getFullYear();
  const localMonth = String(now.getMonth() + 1).padStart(2, "0");
  const localDay = String(now.getDate()).padStart(2, "0");
  const localStr = `${localYear}-${localMonth}-${localDay}`;
  return localStr > utcStr ? localStr : utcStr;
}

export function validateReadingLogInput(
  input: Partial<CreateReadingLogInput>,
  isUpdate = false
): ValidationResult {
  const errors: ValidationResult["errors"] = {};

  // Book title validation
  if (!isUpdate || input.bookTitle !== undefined) {
    const title = input.bookTitle;
    if (title === undefined || title === null || String(title).trim() === "") {
      errors.bookTitle = "Book title is required";
    } else if (String(title).length > 80) {
      errors.bookTitle = "Book title must be at most 80 characters";
    }
  }

  // Minutes read validation
  if (!isUpdate || input.minutesRead !== undefined) {
    const mins = input.minutesRead;
    if (mins === undefined || mins === null || String(mins).trim() === "") {
      errors.minutesRead = "Minutes read is required";
    } else {
      const num = Number(mins);
      if (isNaN(num)) {
        errors.minutesRead = "Minutes read is required";
      } else if (num <= 0 || !Number.isInteger(num)) {
        errors.minutesRead = "Minutes read must be a positive number";
      }
    }
  }

  // Genre validation
  if (!isUpdate || input.genre !== undefined) {
    const genre = input.genre;
    if (genre === undefined || genre === null || String(genre).trim() === "") {
      errors.genre = "Please choose a genre";
    } else if (!VALID_GENRES.includes(genre as any)) {
      errors.genre = "Invalid genre";
    }
  }

  // Date (readOn) validation
  if (!isUpdate || input.readOn !== undefined) {
    const date = input.readOn;
    if (date === undefined || date === null || String(date).trim() === "") {
      errors.readOn = "Date is required";
    } else {
      const todayStr = getTodayDateString();
      // Date in future check
      if (String(date) > todayStr) {
        errors.readOn = "Date cannot be in the future";
      }
    }
  }

  const errorKeys = Object.keys(errors) as (keyof typeof errors)[];
  const isValid = errorKeys.length === 0;
  const firstError = isValid ? undefined : errors[errorKeys[0]];

  return { isValid, errors, firstError };
}

