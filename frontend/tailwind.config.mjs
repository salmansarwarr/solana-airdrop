/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // SF_Collegiate: ["SF Collegiate", "sans-serif"],
        SF_Collegiate: "var(--font-sf-collegiate)",
        outfit: ["Outfit", "serif"],
      },
      textShadow: {
        "black-outline": "0px 0px 0px 2px black",
      },
    },
  },
  plugins: [],
};
