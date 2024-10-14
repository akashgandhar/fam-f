import { useRef, useState } from "react";
import styles from "./index.module.css";
import ResizeIcon from "../../assets/images/resize.png";
import RemoveIcon from "../../assets/images/remove.png";

const ResizeableContainer = ({
  children,
  onDelete,
  position,
  sizePass,
  onSizePass,
  onPosition,
  div2Ref,
  index,
  isShowBoundry,
}) => {
  const [size, setSize] = useState(sizePass);
  const ref = useRef();
  var x = 0;
  var y = 0;
  const isShowBoundryStyle = !isShowBoundry ? { display: "none" } : null;
  const isShowBoundryStyle2 = !isShowBoundry ? { border: "none" } : null;
  const [MousePosition, setMousePosition] = useState(position);
  const [initPosition, setInitPosition] = useState({
    x: 0,
    y: 0,
  });

  const handler = (mouseDownEvent) => {
    const startSize = size;
    const startPosition = { x: mouseDownEvent.pageY, y: mouseDownEvent.pageY };

    function onMouseMove(mouseMoveEvent) {
      onSizePass({
        x: startSize.x - startPosition.x + mouseMoveEvent.pageY,
        y: startSize.y - startPosition.y + mouseMoveEvent.pageY,
      });
      setSize((currentSize) => ({
        x: startSize.x - startPosition.x + mouseMoveEvent.pageY,
        y: startSize.y - startPosition.y + mouseMoveEvent.pageY,
      }));
    }
    function onMouseUp() {
      document.body.removeEventListener("mousemove", onMouseMove);
      // uncomment the following line if not using `{ once: true }`
      // document.body.removeEventListener("mouseup", onMouseUp);
    }

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  };

  const touchHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById("mainFrameScrollContainer").style.overflow =
      "hidden";
    document.getElementById("root").style.overflow = "hidden";
    const mouseDownEvent = e.touches[0];
    const startSize = size;
    const startPosition = { x: mouseDownEvent.pageY, y: mouseDownEvent.pageY };
    function onTouchMove(ee) {
      ee.preventDefault();
      ee.stopPropagation();
      const mouseMoveEvent = ee.touches[0];
      onSizePass({
        x: startSize.x - startPosition.x + mouseMoveEvent.pageY,
        y: startSize.y - startPosition.y + mouseMoveEvent.pageY,
      });
      setSize((currentSize) => ({
        x: startSize.x - startPosition.x + mouseMoveEvent.pageY,
        y: startSize.y - startPosition.y + mouseMoveEvent.pageY,
      }));
    }
    function onMouseUp(eee) {
      eee.preventDefault();
      eee.stopPropagation();
      document.getElementById("mainFrameScrollContainer").style.overflow =
        "auto";
      document.getElementById("root").style.overflow = "auto";
      document.body.removeEventListener("touchmove", onTouchMove, {
        passive: false,
      });
    }

    document.body.addEventListener("touchmove", onTouchMove, {
      passive: false,
    });
    document.body.addEventListener("touchend", onMouseUp, { once: true });
  };

  const moveHandler = (mouseDownEvent) => {
    const sttickerBoundry = ref.current.getBoundingClientRect();
    function onMouseMove(mouseMoveEvent) {
      const frameBoundry = div2Ref.current[index].getBoundingClientRect();
      const tempTop =
        mouseMoveEvent.y - frameBoundry.y - sttickerBoundry.height / 2;
      const tempLeft =
        mouseMoveEvent.x - frameBoundry.x - sttickerBoundry.width / 2;
      setMousePosition({
        left: tempLeft,
        top: tempTop,
      });
      onPosition({
        left: tempLeft,
        top: tempTop,
      });
    }
    function onMouseUp() {
      document.body.removeEventListener("mousemove", onMouseMove);
    }

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  };

  const touchMoveHandler = (ee) => {
    ee.preventDefault();
    ee.stopPropagation();
    document.getElementById("mainFrameScrollContainer").style.overflow =
      "hidden";
    document.getElementById("root").style.overflow = "hidden";
    const sttickerBoundry = ref.current.getBoundingClientRect();
    function onMouseMove(e) {
      e.preventDefault();
      e.stopPropagation();
      const mouseMoveEvent = e.touches[0];
      const frameBoundry = div2Ref.current[index].getBoundingClientRect();
      const tempTop =
        mouseMoveEvent.clientY - frameBoundry.y - sttickerBoundry.height / 2;
      const tempLeft =
        mouseMoveEvent.clientX - frameBoundry.x - sttickerBoundry.width / 2;
      setMousePosition({
        left: tempLeft,
        top: tempTop,
      });
      onPosition({
        left: tempLeft,
        top: tempTop,
      });
    }
    function onMouseUp(eee) {
      eee.preventDefault();
      eee.stopPropagation();
      document.getElementById("mainFrameScrollContainer").style.overflow =
        "auto";
      document.getElementById("root").style.overflow = "auto";
      document.body.removeEventListener("touchmove", onMouseMove, {
        passive: false,
      });
    }

    document.body.addEventListener("touchmove", onMouseMove, {
      passive: false,
    });
    document.body.addEventListener("touchend", onMouseUp, { once: true });
  };

  return (
    <div
      id={styles.resizeContainer}
      style={{
        width: size.x,
        height: size.y,
        left: MousePosition.left,
        top: MousePosition.top,
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 3,
        ...isShowBoundryStyle2,
      }}
      ref={ref}
    >
      <div
        style={{
          width: "84%",
          height: "84%",
        }}
        onMouseDown={moveHandler}
        onTouchStart={touchMoveHandler}
      >
        {children}
      </div>
      <img
        id={styles.draghandle}
        src={ResizeIcon}
        width={12}
        draggable="false"
        onMouseDown={handler}
        onTouchStart={touchHandler}
        style={isShowBoundryStyle}
      />
      <img
        onClick={() => onDelete()}
        id={styles.deleteIcon}
        src={RemoveIcon}
        width={16}
        draggable="false"
        style={isShowBoundryStyle}
      />
    </div>
  );
};

export default ResizeableContainer;
