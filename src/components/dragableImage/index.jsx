import { useRef } from 'react';
import { getCropping } from '../../utils/globleFunc';

const DragableImage = ({ item, ref2, warnRef, index, onTransform }) => {
  var x = 0;
  var y = 0;
  const ref = useRef();

  const moveHandler = (mouseDownEvent) => {
    x = mouseDownEvent.x;
    y = mouseDownEvent.y;
    function onMouseMove(mouseMoveEvent) {
      let tempTop = mouseMoveEvent.y - y;
      let tempLeft = mouseMoveEvent.x - x;
      const splitt = ref.current.style.transform.split(' ');
      tempLeft = tempLeft ?? 0;
      tempTop = tempTop ?? 0;
      const oldLeft = parseInt(splitt[0].slice(10).split('px,')[0]) + tempLeft;
      const oldTop = parseInt(splitt[1].split('px)')[0]) + tempTop;
      const spiltt = splitt.length == 3 ? splitt[2] : splitt[3];
      const value = `translate(${oldLeft}px,${oldTop}px) rotate(0deg) ${spiltt}`;
      ref.current.style.setProperty("transform", value);
      onTransform(value);
      x = mouseMoveEvent.x;
      y = mouseMoveEvent.y;
    }
    function onMouseUp() {
      document.body.removeEventListener("mousemove", onMouseMove);
    }
    if (getCropping()) {
      document.body.addEventListener("mousemove", onMouseMove);
      document.body.addEventListener("mouseup", onMouseUp, { once: true });
    }
  };

  const touchMoveHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('mainFrameScrollContainer').style.overflow = 'hidden';
    document.getElementById('root').style.overflow = 'hidden';
    const mouseDownEvent = e.touches[0];
    x = mouseDownEvent.clientX;
    y = mouseDownEvent.clientY;
    function onMouseMove(ee) {
      ee.preventDefault();
      ee.stopPropagation();
      const mouseMoveEvent = ee.touches[0];
      let tempTop = mouseMoveEvent.clientY - y;
      let tempLeft = mouseMoveEvent.clientX - x;
      const splitt = ref.current.style.transform.split(' ');
      const oldLeft = parseInt(splitt[0].slice(10).split('px,')[0]) + tempLeft ? parseInt(splitt[0].slice(10).split('px,')[0]) + tempLeft : 0;
      const oldTop = parseInt(splitt[1].split('px)')[0]) + tempTop ? parseInt(splitt[1].split('px)')[0]) + tempTop : 0;
      const spiltt = splitt.length == 3 ? splitt[2] : splitt[3];
      const value = `translate(${oldLeft}px,${oldTop}px) rotate(0deg) ${spiltt}`;
      ref.current.style.setProperty("transform", value);
      onTransform(value);
      x = mouseMoveEvent.clientX;
      y = mouseMoveEvent.clientY;
    }
    function onMouseUp(eee) {
      eee.preventDefault();
      eee.stopPropagation();
      document.getElementById('mainFrameScrollContainer').style.overflow = 'auto';
      document.getElementById('root').style.overflow = 'auto';
      document.body.removeEventListener("touchmove", onMouseMove, { passive: false });
    }
    if (getCropping()) {
      document.body.addEventListener("touchmove", onMouseMove, { passive: false });
      document.body.addEventListener("touchend", onMouseUp, { once: true });
    }
  };

  const checkImageQuality = (image) => {
    const minPixelCount = 2000000; // Adjust this value for the desired minimum pixel count
    // console.log(image.src);
    if (image.src.endsWith('.svg')) {
        return false; // SVGs are assumed to be good quality
      }

    const totalPixels = image.naturalWidth * image.naturalHeight;
    return totalPixels < minPixelCount;
  };

  return (
    <div 
      className="text-center" 
      style={{ width: '100%', height: '100%' }}
      onMouseDown={moveHandler}
      onTouchStart={touchMoveHandler}
    >
      <img 
        src={item.localUrl} 
        alt="frames"
        draggable='false'
        style={{ width: '100%', height: '100%', transform: item.scale }}
        id='ball'
        ref={(reff) => {
          ref2.current[index] = reff
          ref.current = reff
        }}
        onLoad={e => {
          if (checkImageQuality(e.currentTarget)) {
            // console.log(checkImageQuality(e.currentTarget));
            warnRef.current.innerText = 'Warning! Low Image Quality';
          } else {
            warnRef.current.innerText = ''; 
          }
        }}
      />
    </div>
  );
}

export default DragableImage;