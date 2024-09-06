import React, { useEffect, useState } from 'react';
import { baseUrl } from '../../theme/appConstants'; 
export const SizeSelector = ({ onSizeChange, selectedFrame, gloableImages }) => {
  const [sizes, setSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const response = await fetch('http://localhost:8000/getAllFrames'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSizes(data);

        if (selectedFrame > -1 && gloableImages[selectedFrame].size) {
          setSelectedSize(gloableImages[selectedFrame].size);
        }
      } catch (error) {
        console.error('Error fetching sizes:', error);
      }
    };

    fetchSizes();
}, []); 

const handleSizeClick = (size) => {
  setSelectedSize(size);
  onSizeChange(size); 
};

return (
  <div className="ToolBox Size">
    {sizes.map(size => (
      <div 
        key={size._id} 
        className={`toolContent ${selectedSize === size.size ? 'activeEffect' : ''}`}
        onClick={() => handleSizeClick(size.size)}
      >
        <span>{size.size}</span> 
      </div>
    ))}
    <div onClick={() => onSizeChange(null)} className="goback_cta">
      Go Back
    </div>
  </div>
);
};