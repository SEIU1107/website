import type { Delta } from "quill";
import { toast } from "@zerodevx/svelte-toast";

// === Image Util ===

// Given an ImageMetadata or a string representing an image, returns the source
export function getImageSource(
  image: HTMLImageElement | ImageMetadata | string
): string {
  return typeof image === "object" && "src" in image ? image.src : image;
}

// Returns a list of image objects given a list of ImageMetadatas / image sources
export function preloadImages(
  images: (ImageMetadata | string)[],
  imageClass?: string
): HTMLImageElement[] {
  return images.map((img) => {
    const image = new Image();
    image.src = getImageSource(img);
    image.className = imageClass ?? "";
    return image;
  });
}

// Measure the height and aspect ratio of each image as it would be rendered
export async function measureImageHeights(
  imageElements: HTMLImageElement[],
  imageStyle?: string
): Promise<{ height: number; ratio: number }> {
  const hiddenContainer = document.createElement("div");
  hiddenContainer.style.visibility = "hidden";
  hiddenContainer.style.position = "absolute";
  hiddenContainer.style.top = "-9999px";
  hiddenContainer.style.left = "-9999px";
  hiddenContainer.style.width = "1000px"; // simulate real layout width
  document.body.appendChild(hiddenContainer);

  const imageObjects = imageElements.map((img) => {
    const image = new Image();
    image.src = getImageSource(img);
    image.className = imageStyle ?? "";
    hiddenContainer.appendChild(image);
    return image;
  });

  // Wait until all images load and can be measured
  await Promise.all(
    imageObjects.map(
      (img) =>
        new Promise<void>((resolve) => {
          img.onload = () => resolve();
        })
    )
  );

  let maxHeight = 0;
  let bestRatio = 1;

  for (const img of imageObjects) {
    const height = img.offsetHeight;
    const width = img.offsetWidth;
    const ratio = width / height;

    if (height > maxHeight) {
      maxHeight = height;
      bestRatio = ratio;
    }
  }

  document.body.removeChild(hiddenContainer);
  return { height: maxHeight, ratio: bestRatio };
}

// === Toast Notifications ===
export const successToast = (
  m: any,
  isComponent: boolean = false,
  duration: number = 0
) => {
  // m could be a string, number, or component.
  toast.push(!isComponent ? m : null, {
    component: isComponent ? m : null,
    theme: {
      "--toastBackground": "#16a34a",
      "--toastColor": "white",
    },
    target: "new",
    ...(duration !== 0 ? { duration } : {}),
  });
};

export const warningToast = (
  m: any,
  isComponent: boolean = false,
  options: object = {}
) => {
  // m could be a string, number, or component.
  toast.push(!isComponent ? m : null, {
    component: isComponent ? m : null,
    theme: {
      "--toastBackground": "#f59e0b",
      "--toastBarBackground": "#f59e0b",
      "--toastColor": "white",
    },
    target: "new",
    ...options,
  });
};

export const errorToast = (
  m: any,
  isComponent: boolean = false,
  duration: number = 0
) => {
  // m could be a string, number, or component.
  toast.push(!isComponent ? m : null, {
    component: isComponent ? m : null,
    theme: {
      "--toastBackground": "#dc2626",
      "--toastColor": "white",
    },
    target: "new",
    ...(duration !== 0 ? { duration } : {}),
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
