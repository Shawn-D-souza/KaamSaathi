import { createContext, useContext, useState } from 'react';

const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState('posting'); // 'posting' or 'working'

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'posting' ? 'working' : 'posting'));
  };

  const value = {
    mode,
    setMode,
    toggleMode,
  };

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
};

export const useMode = () => {
  return useContext(ModeContext);
};