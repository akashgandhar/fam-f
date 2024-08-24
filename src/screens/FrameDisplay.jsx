import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/header';


const FrameDisplay = () => {
  const { size, numberOfFrames } = useParams();
  const [frames, setFrames] = useState([]);

  useEffect(() => {
    // Generate the frames based on the numberOfFrames from the URL
    const initialFrames = Array.from({ length: Number(numberOfFrames) }, (_, index) => ({
      id: index + 1,
      image: null, // Initially no image
    }));
    setFrames(initialFrames);
  }, [numberOfFrames]);

  const handleAddImage = (frameId, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFrames(prevFrames => 
          prevFrames.map(frame => 
            frame.id === frameId ? { ...frame, image: e.target.result } : frame
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  // Define the frame dimensions based on the size from the URL
  const frameDimensions = size === '1x1' ? { width: '150px', height: '150px' } : { width: '150px', height: '267px' };

  return (
    <>
      <Header />
      <section className="h-100">
        <div className="frame-main h-100">
          <div id='mainFrameScrollContainer' className="h-100">
            <h5>Number of Frames: {numberOfFrames} | Frame Size: {size}</h5>
            <div className="frames-container" style={{ display: 'flex', flexWrap: 'wrap' }}>
              {frames.map(frame => (
                <div 
                  key={frame.id} 
                  className="frame" 
                  style={{
                    ...frameDimensions, 
                    border: '1px solid #ccc', 
                    padding: '10px', 
                    margin: '10px', 
                    position: 'relative'
                  }}
                >
                  {frame.image ? (
                    <img src={frame.image} alt={`Frame ${frame.id}`} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                  ) : (
                    <p>Click to add image to Frame {frame.id}</p>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                    onChange={(e) => handleAddImage(frame.id, e)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};



export default FrameDisplay;
