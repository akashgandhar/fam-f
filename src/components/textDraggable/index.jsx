import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import RemoveIcon from '../../assets/images/remove.png';
import styles from '../resizeableContainter/index.module.css';

export const TextDraggable = (props) => {
    const { item, index, divTextRef, onTextPosition, deleteText,cross, setCross } = props;
    const draggableValue = 140;
const [ cross1, setCross1]=useState(false)
    const [textPosition, setTextPosition] = useState(item.textPosition);

    const handleDeleteText = (event) => {
        debugger
        event.stopPropagation();
        deleteText();
        setCross1(false);
        setCross(false);
    };
useEffect(()=>{
item.text!==""&& setCross1(true)
item.text==="" && setCross(false) && setCross1(false)
},[item?.text])
    return (
        <Draggable

            onDrag={(e, data) => {
                onTextPosition(index, {
                    x: data.x,
                    y: data.y
                });
                setTextPosition({
                    x: data.x,
                    y: data.y
                });
            }}
           
            position={textPosition}
            bounds={{ top: -(draggableValue), left: -draggableValue, right: draggableValue, bottom: (draggableValue) }}
        >
            <div style={{
                textShadow: '2px 2px 4px #000000',
                color: "white",
                cursor: 'pointer',
                fontSize: 18,
            }}>
                <div style={{
                    border: `1px solid ${(cross||cross1) ? "blue" : "transparent"}`,
                    padding: "10px"
                }}>

                    <div ref={temp => {
                        divTextRef.current[index] = temp;
                    }}
                    
               
                    >
                        {item?.text}
                    </div>
                    {(cross|| cross1) && <img
                        style={{ zIndex: 20 }}
                        onClick={handleDeleteText}
                        onTouchStart={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            handleDeleteText(e)
                            console.log("object");
                        }}
                        id={styles.deleteIcon}
                        src={RemoveIcon}
                        width={20}
                        draggable={"false"}
                    />}
                </div>
            </div>
        </Draggable>
    );
};
