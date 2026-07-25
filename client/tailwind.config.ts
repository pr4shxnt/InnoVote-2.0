import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
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
      },
      boxShadow: {
        "focus-ring": "0 0 0 3px rgba(193, 42, 55, 0.4)",
      },
    },
  },
  plugins: [],
} satisfies Config;
