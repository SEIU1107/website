import type { Delta } from "quill";
import { toast } from "@zerodevx/svelte-toast";

// === Toast Notifications ===
export const successToast = (m: any, isComponent: boolean = false) => {
  // m could be a string, number, or component.
  toast.push(!isComponent ? m : null, {
    component: isComponent ? m : null,
    theme: {
      "--toastBackground": "#16a34a",
      "--toastColor": "white",
    },
    target: "new",
  });
};

export const warningToast = (m: any, isComponent: boolean = false) => {
  // m could be a string, number, or component.
  toast.push(!isComponent ? m : null, {
    component: isComponent ? m : null,
    theme: {
      "--toastBackground": "#f59e0b",
      "--toastColor": "white",
    },
    target: "new",
  });
};

export const errorToast = (m: any, isComponent: boolean = false) => {
  // m could be a string, number, or component.
  toast.push(!isComponent ? m : null, {
    component: isComponent ? m : null,
    theme: {
      "--toastBackground": "#dc2626",
      "--toastColor": "white",
    },
    target: "new",
  });
};

// === Formatting Stuff ===

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function getMeritIncreaseValue(meritIncreaseString: string): number {
  switch (meritIncreaseString) {
    case "5%":
      return 1.05;
    case "3.4%":
      return 1.034;
    case "2.5%":
      return 1.025;
    case "1.5%":
      return 1.015;
  }
  return 1;
}

// === Contact Form ===

// Key for saved inputs in local and session storage
export const formInputsStorageKey = "contactFormInputs";

// Key for contact form status code
export const contactFormStatusCodeKey = "contactFormStatusCode";

export function saveContactFormInputs(
  // Saves the contact form inputs in localStorage.

  // Contact Form inputs
  nameInputValue: string,
  emailInputValue: string,
  phoneInputValue: string,
  employerInputValue: string,
  inquiryTypeInputValue: string,
  messageDelta: Delta
) {
  // Saves form inputs for later when user leaves page
  const inputsToSave = {
    nameInputValue,
    emailInputValue,
    phoneInputValue,
    employerInputValue,
    inquiryTypeInputValue,
    messageDelta,
  };
  localStorage.setItem(formInputsStorageKey, JSON.stringify(inputsToSave));
}
