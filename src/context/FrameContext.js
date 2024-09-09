// framecontext.jsx
import { createContext, useContext, useState } from 'react';

const FrameContext = createContext();

export const FrameProvider = ({ children }) => {
  const [numberOfFrames, setNumberOfFrames] = useState(0); 

  return (
    <FrameContext.Provider value={{ numberOfFrames, setNumberOfFrames }}>
      {children}
    </FrameContext.Provider>
  );
};

export const useFrameContext = () => {
  const context = useContext(FrameContext);
  if (context === undefined) {
    throw new Error('useFrameContext must be used within a FrameProvider');
  }
  return [context.numberOfFrames, context.setNumberOfFrames]; // Return an array
};