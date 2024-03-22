'use client';
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
        main: '#c773fd'
    },
    secondary: {
        main: '#ac0291'
    },
    text: {
        primary: '#efd9ff',
    }
  }
});

export default theme;