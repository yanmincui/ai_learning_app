import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        mist: "#eef6f8",
        coral: "#f36f4f",
        mint: "#2bbf9f",
        sun: "#f7be45",
        grape: "#6554c0"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23, 32, 51, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
