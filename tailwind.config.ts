import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      
    },
    colors: {
      'text': '#d5e0fa',
      'background': '#01040a',
      'primary': '#7897ed',
      'secondary': '#2b138d',
      'accent': '#6b28e3',
      },
  },
  plugins: [],
} satisfies Config;
