import { grey } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';

interface IColorModeContext {
  toggleColorMode: () => void;
  mode: 'dark' | 'light';
}

export const ColorModeContext = React.createContext<IColorModeContext>({
  toggleColorMode: () => {},
  mode: 'light',
});

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'dark' | 'light'>(() => {
    const savedMode = localStorage.getItem('colorMode');
    return savedMode ? (savedMode as 'dark' | 'light') : 'light';
  });

  useEffect(() => {
    localStorage.setItem('colorMode', mode);
  }, [mode]);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#1C4997' : '#35C3CF',
            contrastText: '#fff',
          },
          secondary: {
            main: mode === 'light' ? '#35C3CF' : '#1C4997',
            contrastText: '#fff',
          },
          background: {
            paper: mode === 'light' ? grey[100] : '#101010',
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => React.useContext(ColorModeContext);
