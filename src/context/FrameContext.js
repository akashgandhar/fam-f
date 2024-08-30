import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const FrameContext = createContext();

export const FrameProvider = ({ children }) => {
  const [validFrameNumbers, setValidFrameNumbers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [routeIsValid, setRouteIsValid] = useState(false);

  useEffect(() => {
    const fetchFrameNumbers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/getAllFrameNumbers');
        setValidFrameNumbers(response.data.map(item => item.numberOfFrames));
        // console.log('validFrameNumbers:', response.data.map(item => item.numberOfFrames));
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching frame numbers:', error);
        toast.error('Failed to fetch frame numbers');
        setIsLoading(false);
      }
    };
    fetchFrameNumbers();
  }, []);


  // Extract `numberOfFrames` from the current location's pathname
  const numberOfFrames = location.pathname.split('/').pop(); 

  useEffect(() => {
    const checkIsValidRoute = () => {
      if (isLoading) {
        return false;
      }

      const parsedNumberOfFrames = parseInt(numberOfFrames, 10);
    //   console.log('parsedNumberOfFrames:', parsedNumberOfFrames);
    //   console.log('validFrameNumbers:', validFrameNumbers);
    //   console.log('validFrameNumbers.includes(parsedNumberOfFrames)', validFrameNumbers.includes(parsedNumberOfFrames));
      return validFrameNumbers.includes(parsedNumberOfFrames);
    };

    setRouteIsValid(checkIsValidRoute());
  }, [isLoading, numberOfFrames, validFrameNumbers]);

  useEffect(() => {
    // console.log('routeIsValid updated:', routeIsValid);
  }, [routeIsValid, validFrameNumbers]); 

  return (
    <FrameContext.Provider value={{ validFrameNumbers, isLoading, routeIsValid }}> 
      {children}
    </FrameContext.Provider>
  );
};

export const useFrameContext = () => {
  const context = React.useContext(FrameContext);
  if (context === undefined) {
    throw new Error('useFrameContext must be used within a FrameProvider');
  }
  return context;
};