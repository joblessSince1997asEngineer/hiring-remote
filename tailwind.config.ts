import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        // Bigger on mobile, normal on desktop
        'xs':  ['0.8125rem', { lineHeight: '1.125rem' }], // 13px (was 12)
        'sm':  ['0.9375rem', { lineHeight: '1.5rem' }],   // 15px (was 14)
      },
    },
  },
  plugins: [],
};
export default config;