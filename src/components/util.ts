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
