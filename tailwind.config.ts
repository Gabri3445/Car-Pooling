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
      'text': '#efd9ff',
      'background': '#0a0014',
      'primary': '#c773fd',
      'secondary': '#ac0291',
      'accent': '#fc14bb',
     },
  },
  plugins: [],
} satisfies Config;
