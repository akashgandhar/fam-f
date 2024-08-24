import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FrameSelection = () => {
  const frameSizes = ['1x1', '9x16'];
  const [selectedSize, setSelectedSize] = useState(frameSizes[0]);
  const [numberOfFrames, setNumberOfFrames] = useState(1);
  const navigate = useNavigate();

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  const handleFrameNumberChange = (e) => {
    setNumberOfFrames(e.target.value);
  };

  const handleSubmit = () => {
    navigate(`/frames/${selectedSize}/${numberOfFrames}`);
  };

  return (
    <div>
      <select onChange={handleSizeChange} value={selectedSize}>
        {frameSizes.map(size => (
          <option key={size} value={size}>{size} Frame</option>
        ))}
      </select>
      <input 
        type="number" 
        value={numberOfFrames} 
        onChange={handleFrameNumberChange} 
        min="1" 
        placeholder="Number of Frames" 
      />
      <button onClick={handleSubmit}>Go</button>
    </div>
  );
};

export default FrameSelection;