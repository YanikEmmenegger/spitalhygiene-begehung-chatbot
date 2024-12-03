import type {Config} from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lightGreen: '#009870',
        darkGreen: '#00654a',
        lightRed: '#cd0601',
        darkRed: '#9E080C',
        lightGray: '#677078',
        darkGray: '#4B5457',
      }
    },
  },
  plugins: [],
} satisfies Config;
