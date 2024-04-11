'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
        main: '#7897ed'
    },
    secondary: {
        main: '#2b138d'
    },
    text: {
        primary: '#d5e0fa',
    }
  }
});

export default theme;