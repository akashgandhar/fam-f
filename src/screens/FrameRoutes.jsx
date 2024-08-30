import { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useParams } from "react-router-dom";
import { useFrameContext } from "../context/FrameContext";
import Frames from "./Frames";

function FrameRoutes() {
  const { isLoading, validFrameNumbers } = useFrameContext();
  const { numberOfFrames } = useParams();
  const [routeIsValid, setRouteIsValid] = useState(false);

  useEffect(() => {
    const checkIsValidRoute = () => {
      if (isLoading) {
        return false;
      }
      console.log('validFrameNumbers from frameroutes:', validFrameNumbers);

      if (numberOfFrames && validFrameNumbers.length > 0) {
        const parsedNumberOfFrames = parseInt(numberOfFrames, 10);
        console.log('parsedNumberOfFrames:', parsedNumberOfFrames);
        console.log('validFrameNumbers.includes(parsedNumberOfFrames',  validFrameNumbers.includes(parsedNumberOfFrames));
        return validFrameNumbers.includes(parsedNumberOfFrames);
      }

      return false;
    };

    setRouteIsValid(checkIsValidRoute());
    console.log('isvalid:', routeIsValid);
  }, [isLoading, numberOfFrames, validFrameNumbers]); // Dependency array ensures effect runs when these values change

  // Render "Loading..." div when isLoading is true
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render routes when isLoading is false and route is valid
  return (
    <Routes>
      <Route 
        path="/frames/:numberOfFrames" 
        element={ <Frames />}
      />
    </Routes>
  );
}

export default FrameRoutes;