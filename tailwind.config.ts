import type { Config } from "tailwindcss"
const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        red: {
          100: "#FFEBEE",
          500: "#F44336",
          800: "#C62828",
        },
        blue: {
          100: "#E3F2FD",
          500: "#2196F3",
          800: "#1565C0",
        },
        green: {
          100: "#E8F5E9",
          500: "#4CAF50",
          800: "#2E7D32",
        },
        purple: {
          100: "#F3E5F5",
          500: "#9C27B0",
          800: "#6A1B9A",
        },
        yellow: {
          100: "#FFF8E1",
          500: "#FFC107",
          800: "#F9A825",
        },
        orange: {
          100: "#FFF3E0",
          500: "#FF9800",
          800: "#EF6C00",
        },
        pink: {
          100: "#FCE4EC",
          500: "#E91E63",
          800: "#AD1457",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  safelist: [
    { pattern: /bg-(red|blue|green|purple|yellow|orange|pink)-(100|500|800)/ },
    { pattern: /border-(red|blue|green|purple|yellow|orange|pink)-(100|500|800)/ },
    { pattern: /text-(red|blue|green|purple|yellow|orange|pink)-(100|500|800)/ },
  ],
}

export default config
