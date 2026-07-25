import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          50: "#FFF0F2",
          100: "#FDE2E4",
          200: "#F8B4B9",
          300: "#EF7B85",
          400: "#E54855",
          500: "#C12A37",
          600: "#9E1F2A",
          700: "#7B151F",
          800: "#580F15",
          900: "#39080C",
        },
        slateAccent: "#64748B",
        status: {
          success: "#10B981",
          successBg: "#ECFDF5",
          warning: "#F59E0B",
          warningBg: "#FFFBEB",
          error: "#DC2626",
          errorBg: "#FEF2F2",
          info: "#3B82F6",
          infoBg: "#EFF6FF",
        },
        surface: {
          dark: {
            app: "#0D0E12",
            card: "#16181E",
            elevated: "#1F222B",
            border: "#2E3340",
          },
          light: {
            app: "#FAFAFB",
            card: "#FFFFFF",
            elevated: "#F1F5F9",
            border: "#E2E8F0",
          },
        },
        // shadcn/ui semantic tokens (admin dashboard only — see src/index.css)
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "focus-ring": "0 0 0 3px rgba(193, 42, 55, 0.4)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
