import "~/styles/globals.css";

import { Inter } from "next/font/google";
import HomeNav from "~/components/Nav/HomeNav";
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import theme from '~/theme';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body className={`font-sans ${inter.variable} bg-background text-text`}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <nav className="sticky top-0 z-20 bg-background"><HomeNav></HomeNav></nav>
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </body>
  );
}
