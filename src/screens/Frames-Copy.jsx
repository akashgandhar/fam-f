import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "../components/header";
import Draggable from "react-draggable";
import FrameIcon from '../assets/images/frame2.png';
import EffectIcon from '../assets/images/effect.png';
import MatIcon from '../assets/images/mat.png';
import BlackFrameIcon from '../assets/images/blackFrame.webp';
import WhiteFrameIcon from '../assets/images/whiteFrame.webp';
import FrameLessIcon from '../assets/images/wood.webp';
import SamplePicIcon from '../assets/images/samplePic2.jpg';
import StickercIcon from '../assets/images/sticker.png';
import TextIcon from '../assets/images/text2.png';
import CropIcon from '../assets/images/crop.png';
// import '../style.css';
import Stickers from "../components/sticker";
import ResizeableContainer from "../components/resizeableContainter";
import { uploadFile } from "../utils/s3Bucket";
import DragableImage from "../components/dragableImage";
import { setCropping, setFramesAll } from "../utils/globleFunc";
import { TextDraggable } from "../components/textDraggable";
import { toPng } from "html-to-image";
import { useDispatch, useSelector } from "react-redux";
import { loaderAction, showCheckOutAction, showLoginAction } from "../redux/actions/global";
import useWindowDimensions from "../components/useWindowDimensions";
import fileUpload from "../components/fileUploader/fileUpload";

var gloableImages = []
const Frames = () => {
    const { width } = useWindowDimensions();
    const profile = useSelector(state => state.userReducer.user);
    const ref = useRef();
    const dispatch = useDispatch()
    const [images, setImages] = useState([]);
    const centerItem = width < 786 ? (images.length < 2 && { justifyContent: 'center' }) : (images.length < 3 && { justifyContent: 'center' })
    const imgRef = useRef([]);
    const div1Ref = useRef([]);
    const div2Ref = useRef([]);
    const divTextRef = useRef([]);
    const div3Ref = useRef([]);
    const divMainRef = useRef([]);
    const [selectedFrame, setSelectedFrame] = useState(-1);

    const handleFileChange = async (e) => {
        e.preventDefault();
        if (e.target.files.length > 0) {
            dispatch(loaderAction(true));
            const tempData = [...images];
            for (let item of e.target.files) {

                const url = await fileUpload(item)
                tempData.push({
                    file: item,
                    url: url,
                    frame: 0,
                    effect: '',
                    text: '',
                    mat: 0,
                    sticker: [],
                    rangeValue: '1',
                    div1Class: 'frame-one',
                    div2Class: 'sub-frame-inner',
                    div3Class: 'frame-image-large',
                    scale: 'translate(0px,0px) rotate(0deg) scale(1)',
                    textPosition: { x: 0, y: 0 },
                    isShowBoundry: true,
                    scaleValue: '1'
                });

            }
            setImages(tempData);
            gloableImages = tempData;
            dispatch(loaderAction(false));
        }
    }

    const createButton = () => (
        <div className="text-center">
            {profile ? '' :
                <>
                    <div className="mb-4">
                        <strong>Sign up</strong> to save your progress & track orders
                        <button className="ml-3 btn btn-orange rounded-pill swingAnimate" onClick={() => dispatch(showLoginAction(true))}>Login Now</button>
                    </div>
                </>
            }
            <div onClick={() => ref.current.click()} className="frame-scale d-inline-block mt-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>

            </div>
            <h5 className="mt-3"><b>Start Creating </b></h5>
        </div>
    )

    const convertHtmlToImg = async () => {
        dispatch(loaderAction(true));
        const tempData2 = [...gloableImages];
        for (let i in gloableImages) {
            tempData2[i].isShowBoundry = false;
        }
        gloableImages = tempData2
        setImages(gloableImages);

        setTimeout(() => { convertHtmlToImg2() }, 2000);
    }

    const convertHtmlToImg2 = async () => {
        const tempData = [...gloableImages];
        const tempFinalData = []
        for (let item in divMainRef.current) {
            try {
                const dataUrl = await toPng(divMainRef.current[item], { cacheBust: false });
                const url = await fileUpload(dataUrl, 'tempImage.png');

                const dataUrlWF = await toPng(div2Ref.current[item], { cacheBust: false });
                const urlWF = await fileUpload(dataUrlWF, 'tempImage.png');
                tempData[item].frameUrl = url;
                tempData[item].url = urlWF;
                tempFinalData.push({
                    "quantity": 1,
                    "picture": urlWF,
                    "frame": url,
                })
            } catch (error) {
                console.log('########@@2', error);
            }
        }
        gloableImages = tempData
        setFramesAll(tempFinalData);
        setImages(gloableImages);
        dispatch(loaderAction(false));
        dispatch(showCheckOutAction(true));

        const tempData2 = [...gloableImages];
        for (let i in gloableImages) {
            tempData2[i].isShowBoundry = true;
        }
        gloableImages = tempData2
        setImages(gloableImages);
    }

    return (
        <div className="bg-banner bg-fixed-grad UserAdmin">
            <Header showCheckout={images.length > 0} convertHtmlToImg={convertHtmlToImg} />
            <section className="h-100">
                <div className="frame-main h-100" >
                    <div id='mainFrameScrollContainer' className="h-100 border border-info ">
                        <div>

                            {images.length == 0 ? createButton() :
                                images.map((item, index) => {
                                    return <FrameContainer item={item} index={index} key={Math.random().toString()}
                                        selectedFrame={selectedFrame}
                                        onSelectedFrame={(indexS) => {
                                            setImages(gloableImages)
                                            setSelectedFrame(indexS)
                                        }}
                                        onDelete={(index) => {
                                            const tempData = gloableImages.filter((item, subIndex) => { return subIndex != index })
                                            setImages(tempData)
                                            gloableImages = tempData;
                                        }}
                                        onDeleteSticker={(index, subItem) => {
                                            const tempData = gloableImages.map((item, subIndex) => {
                                                const tempData = { ...item };
                                                if (subIndex == index) {
                                                    const tempStickers = tempData.sticker.filter((sticketItem) => sticketItem.img != subItem.img);
                                                    tempData.sticker = tempStickers;
                                                }
                                                return tempData
                                            })
                                            setImages(tempData)
                                            gloableImages = tempData
                                        }}
                                        onSizePass={(index, data, sticketIndex) => {
                                            const tempData = gloableImages.map((item, subIndex) => {
                                                const tempData = { ...item };
                                                if (subIndex == index) {
                                                    tempData.sticker[sticketIndex].size = data
                                                }
                                                return tempData
                                            })
                                            gloableImages = tempData
                                        }}
                                        onPosition={(index, data, sticketIndex) => {
                                            const tempData = gloableImages.map((item, subIndex) => {
                                                const tempData = { ...item };
                                                if (subIndex == index) {
                                                    tempData.sticker[sticketIndex].position = data
                                                }
                                                return tempData
                                            })
                                            gloableImages = tempData
                                        }}
                                        onTextPosition={(index, data) => {
                                            const tempData = gloableImages[index]
                                            console.log('######', tempData, index);
                                            tempData.textPosition = data
                                            gloableImages[index] = tempData
                                        }}
                                        ref={imgRef}
                                        div1Ref={div1Ref}
                                        div2Ref={div2Ref}
                                        divTextRef={divTextRef}
                                        div3Ref={div3Ref}
                                        divMainRef={divMainRef}

                                    />
                                })
                            }
                            {images.length > 0 && <BottomSelector onPlusClick={() => {
                                ref.current.click()
                            }}
                                updateImageData={(sticker) => {
                                    if (selectedFrame > -1) {
                                        const tempObj = { ...gloableImages[selectedFrame] }
                                        const tempArraySticker = [...tempObj.sticker]
                                        tempArraySticker.push(sticker)
                                        tempObj.sticker = tempArraySticker
                                        const tempArr = [...gloableImages]
                                        tempArr[selectedFrame] = tempObj
                                        setImages(tempArr);
                                        gloableImages = tempArr;

                                    }
                                    else {
                                        const tempData = gloableImages.map(item => {
                                            const tempObj = { ...item }
                                            const tempArraySticker = [...tempObj.sticker]
                                            tempArraySticker.push(sticker)
                                            tempObj.sticker = tempArraySticker
                                            return tempObj
                                        })
                                        setImages(tempData);
                                        gloableImages = tempData;
                                    }
                                }}
                                updateRange={(rangeValue) => {
                                    if (imgRef.current && imgRef.current.length > 0) {
                                        if (selectedFrame > -1) {
                                            const splitt = gloableImages[selectedFrame].scale.split(' ')
                                            let tempTrans = splitt[0]
                                            if (rangeValue == '1' || rangeValue == 1) {
                                                tempTrans = 'translate(0px,0px)'
                                            }
                                            const value = `${tempTrans} rotate(0deg) scale(${1 + (rangeValue / 10)})`
                                            imgRef.current[selectedFrame].style.setProperty("transform", value);

                                            const tempObj = { ...gloableImages[selectedFrame] }
                                            tempObj.scale = value;
                                            tempObj.scaleValue = rangeValue;

                                            gloableImages[selectedFrame] = tempObj;
                                        }
                                        else {
                                            for (let item in imgRef.current) {
                                                const splitt = gloableImages[item].scale.split(' ')
                                                let tempTrans = splitt[0]
                                                if (rangeValue == '1' || rangeValue == 1) {
                                                    tempTrans = 'translate(0px,0px)'
                                                }
                                                const value = `${tempTrans} rotate(0deg) scale(${1 + (rangeValue / 10)})`
                                                imgRef.current[item].style.setProperty("transform", value);


                                                const tempObj = { ...gloableImages[item] }
                                                tempObj.scale = value;
                                                tempObj.scaleValue = rangeValue;

                                                gloableImages[item] = tempObj;
                                            }
                                        }

                                    }
                                }}
                                updateMat={(mat) => {
                                    if (imgRef.current && imgRef.current.length > 0) {
                                        if (selectedFrame > -1) {
                                            const splitt = gloableImages[selectedFrame].div3Class.split(' ')
                                            div3Ref.current[selectedFrame].className = `${mat} ${splitt[1]}`;

                                            const tempObj = { ...gloableImages[selectedFrame] }
                                            tempObj.div3Class = `${mat} ${splitt[1]}`;
                                            gloableImages[selectedFrame] = tempObj;
                                        }
                                        else {
                                            for (let item in imgRef.current) {
                                                const splitt = gloableImages[item].div3Class.split(' ')
                                                div3Ref.current[item].className = `${mat} ${splitt[1]}`;

                                                const tempObj = { ...gloableImages[item] }
                                                tempObj.div3Class = `${mat} ${splitt[1]}`;

                                                gloableImages[item] = tempObj;
                                            }
                                        }

                                    }
                                }}
                                updateEffect={(effect) => {
                                    if (imgRef.current && imgRef.current.length > 0) {
                                        if (selectedFrame > -1) {
                                            const splitt = gloableImages[selectedFrame].div3Class.split(' ')
                                            div3Ref.current[selectedFrame].className = `${splitt[0]} ${effect}`;

                                            const tempObj = { ...gloableImages[selectedFrame] }
                                            tempObj.div3Class = `${splitt[0]} ${effect}`;
                                            gloableImages[selectedFrame] = tempObj;
                                        }
                                        else {
                                            for (let item in imgRef.current) {
                                                const splitt = gloableImages[item].div3Class.split(' ')
                                                div3Ref.current[item].className = `${splitt[0]} ${effect}`;

                                                const tempObj = { ...gloableImages[item] }
                                                tempObj.div3Class = `${splitt[0]} ${effect}`;

                                                gloableImages[item] = tempObj;
                                            }
                                        }

                                    }
                                }}
                                updateDiv={(frameClass, subFrame, text) => {
                                    if (selectedFrame > -1) {
                                        div1Ref.current[selectedFrame].className = frameClass;
                                        div2Ref.current[selectedFrame].className = subFrame;

                                        const tempObj = { ...gloableImages[selectedFrame] }
                                        tempObj.div1Class = frameClass;
                                        tempObj.div2Class = subFrame;

                                        gloableImages[selectedFrame] = tempObj;
                                    }
                                    else {
                                        if (div1Ref.current && div1Ref.current.length > 0) {
                                            for (let item in div1Ref.current) {
                                                div1Ref.current[item].className = frameClass;
                                                div2Ref.current[item].className = subFrame;

                                                const tempObj = { ...gloableImages[item] }
                                                tempObj.div1Class = frameClass;
                                                tempObj.div2Class = subFrame;

                                                gloableImages[item] = tempObj;
                                            }
                                        }
                                    }
                                }}
                                updateText={(text) => {
                                    if (selectedFrame > -1) {
                                        divTextRef.current[selectedFrame].innerText = text;
                                        const tempObj = { ...gloableImages[selectedFrame] }
                                        tempObj.text = text;
                                        gloableImages[selectedFrame] = tempObj;
                                    }
                                    else {
                                        if (div1Ref.current && div1Ref.current.length > 0) {
                                            for (let item in div1Ref.current) {
                                                divTextRef.current[item].innerText = text;

                                                const tempObj = { ...gloableImages[item] }
                                                tempObj.text = text;

                                                gloableImages[item] = tempObj;
                                            }
                                        }
                                    }
                                }}
                                selectedFrame={selectedFrame}
                            />}
                        </div>
                    </div>
                </div>
                <input
                    ref={ref}
                    accept="image/*"
                    capture={false}
                    onChange={handleFileChange}
                    type="file"
                    id="actual-btn"
                    multiple
                    hidden />
            </section>
        </div>
    )
}

export const FrameContainer = React.forwardRef((props, ref) => {
    const { item, index, onDelete, onDeleteSticker, div1Ref, div2Ref, divTextRef, div3Ref,
        onSizePass,
        onPosition,
        onTextPosition,
        selectedFrame,
        onSelectedFrame,
        divMainRef,
    } = props
    const warnRef = useRef()
    return (
        <div>
            <div ref={temp => { divMainRef.current[index] = temp }} style={{
                padding: item.isShowBoundry ? 0 : 10
            }}>
                <div ref={temp => { div1Ref.current[index] = temp }} className={item.div1Class}>
                    <div className={item.div2Class} ref={temp => { div2Ref.current[index] = temp }}>
                        <div className={item.div3Class}
                            style={{
                                overflow: 'hidden',
                                position: 'relative',
                            }}
                            ref={(reff) => { div3Ref.current[index] = reff }}>
                            <DragableImage
                                item={item} ref2={ref} warnRef={warnRef} index={index}
                                onTransform={value => {
                                    gloableImages[index].scale = value
                                }}
                            />
                        </div>
                        <div style={{
                            position: 'absolute',
                            zIndex: 2,
                        }}>
                            <ResizeableContainer
                                key={Math.random().toString()}
                                onDelete={() => { onDeleteSticker(index, subItem) }}
                                onSizePass={(size) => { onSizePass(index, size, sticketIndex) }}
                                onPosition={(position) => { onPosition(index, position, sticketIndex) }}
                                sizePass={subItem.size} position={subItem.position}
                                div2Ref={div2Ref}
                                index={index}
                                isShowBoundry={item.isShowBoundry}
                            >
                                <TextDraggable item={item} index={index} divTextRef={divTextRef} onTextPosition={onTextPosition} />

                            </ResizeableContainer>
                        </div>

                        {item.sticker.length > 0 &&
                            item.sticker.map(((subItem, sticketIndex) => {
                                return (<ResizeableContainer
                                    key={Math.random().toString()}
                                    onDelete={() => { onDeleteSticker(index, subItem) }}
                                    onSizePass={(size) => { onSizePass(index, size, sticketIndex) }}
                                    onPosition={(position) => { onPosition(index, position, sticketIndex) }}
                                    sizePass={subItem.size} position={subItem.position}
                                    div2Ref={div2Ref}
                                    index={index}
                                    isShowBoundry={item.isShowBoundry}
                                >
                                    <img src={subItem.img} alt="sticker"
                                        draggable="true"
                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}
                                    />
                                </ResizeableContainer>)
                            }))
                        }
                    </div>
                </div>
            </div>
            <div>
                <span style={{ color: 'red' }} ref={warnRef}>{''}</span>
                <span
                    onClick={() => {
                        if (selectedFrame == index) {
                            onSelectedFrame(-1)
                        }
                        else onSelectedFrame(index)
                    }}
                >{selectedFrame == index ? 'Selected' : 'Select'}</span>
                <span onClick={() => onDelete(index)} style={{
                    color: '#f09c01',
                    cursor: 'pointer',
                }}>{'Delete'}</span>
            </div>
        </div>

    )
})
var frameClassGloable
var subFrameGloable
var rangeValueGloable = '1'
var effectGloable, frameSizeGloable
export const BottomSelector = ({ onPlusClick, updateImageData, updateEffect, updateDiv, selectedFrame, updateText, updateMat, updateRange }) => {
    const { width } = useWindowDimensions();
    const [type, setType] = useState('')
    const [frame, setFrame] = useState(0)
    const [effect, setEffect] = useState('')
    const [mat, setMat] = useState(0)
    const [sticker, setSticker] = useState(null)
    const [text, setText] = useState('')
    const [value, setValue] = useState('')
    const [rangeValue, setRangeValue] = useState('1')
    const marginRight = { marginRight: 30 }
    const fontSize = { fontSize: 14 }
    const imageSize = 22
    useEffect(() => {
        if (type === 'crop' && selectedFrame > -1) {
            setRangeValue(gloableImages[selectedFrame].scaleValue);
        }
    }, [type, selectedFrame])
    useEffect(() => {
        if (selectedFrame == -1) {
            rangeValueGloable = rangeValue;
        }
    }, [selectedFrame, rangeValue])
    useEffect(() => {
        if (sticker) {
            updateImageData(sticker)
        }
    }, [sticker])

    useEffect(() => {
        frameClassGloable = frame === 0 ? 'frame-one' : frame === 1 ? 'frame-two' : 'frame-three'
        subFrameGloable = frame == 1 ? 'sub-frame-inner sub-frame' : frame === 2 ? 'sub-frame-inner sub-frame-wood' : 'sub-frame-inner'
        updateDiv(frameClassGloable, subFrameGloable)
    }, [frame])

    useEffect(() => {
        updateText(text)
    }, [text])

    useEffect(() => {
        updateRange(rangeValue)
    }, [rangeValue])

    useEffect(() => {
        effectGloable = effect;
        updateEffect(effectGloable)
    }, [effect])

    useEffect(() => {
        frameSizeGloable = mat === 0 ? 'frame-image-large' : mat === 1 ? 'frame-image-medium' : 'frame-image-small'
        updateMat(frameSizeGloable)
    }, [mat])

    if (type === 'frame') {
        return (
            <div style={{
                top: 66,
                width: '100vw',
                height: '18vh',
                position: 'absolute',
                background: 'white',
                boxShadow: '0px 7px 20px black',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
            }} className="border border-danger">
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                }}
                    onClick={() => setFrame(0)}>
                    <img src={BlackFrameIcon} width={60} height={60} alt="FrameIcon" style={{
                        borderRadius: 4,
                        borderColor: frame === 0 ? '#f09c01' : 'transparent',
                        borderStyle: 'solid',
                        borderWidth: 2
                    }} />
                    <span style={{
                        color: frame === 0 ? '#f09c01' : 'black'
                    }}>Black</span>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: 56,
                    marginRight: 60,
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer'
                }}
                    onClick={() => setFrame(1)}>
                    <img src={WhiteFrameIcon} width={60} height={60} alt="EffectIcon" style={{
                        borderRadius: 4,
                        borderColor: frame === 1 ? '#f09c01' : 'transparent',
                        borderStyle: 'solid',
                        borderWidth: 2
                    }} />
                    <span style={{
                        color: frame === 1 ? '#f09c01' : 'black'
                    }}>White</span>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer'
                }}
                    onClick={() => setFrame(2)}>
                    <img src={FrameLessIcon} width={60} height={60} alt="MatIcon" style={{
                        borderRadius: 4,
                        borderColor: frame === 2 ? '#f09c01' : 'transparent',
                        borderStyle: 'solid',
                        borderWidth: 2
                    }} />
                    <span style={{
                        color: frame === 2 ? '#f09c01' : 'black'
                    }}>Wood</span>
                </div>
                <div onClick={() => setType('')} className="goback_cta">
                    Go Back
                </div>
            </div>
        )
    }
    else if (type === 'effect') {
        return (
            <div style={{
                top: 66,
                width: '100vw',
                height: '18vh',
                position: 'absolute',
                background: 'white',
                boxShadow: '0px 7px 20px black',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }} className="border border-info">
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: width < 576 ? 'flex-start' : 'center',
                    alignItems: 'center',
                    overflow: 'auto',
                    width: width < 576 ? '90%' : '100%',
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                        marginRight: 30,
                        cursor: 'pointer',
                    }}
                        onClick={() => setEffect('')}>
                        <img src={SamplePicIcon} width={60} height={60} alt="FrameIcon" style={{
                            borderRadius: 4,
                            borderColor: effect === '' ? '#f09c01' : 'transparent',
                            borderStyle: 'solid',
                            borderWidth: 2,
                            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                            objectFit: 'cover'
                        }} />

                        <span style={{
                            color: effect === '' ? '#f09c01' : 'black'
                        }}>Normal</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginRight: 30,
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer'
                    }}
                        onClick={() => setEffect('filter-willow')}>
                        <img src={SamplePicIcon} width={60} height={60} alt="EffectIcon" style={{
                            borderRadius: 4,
                            borderColor: effect === 'filter-willow' ? '#f09c01' : 'transparent',
                            borderStyle: 'solid',
                            borderWidth: 2,
                            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                            objectFit: 'cover'
                        }} className="filter-willow" />
                        <span style={{
                            color: effect === 'filter-willow' ? '#f09c01' : 'black'
                        }}>Willow</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginRight: 30,
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer'
                    }}
                        onClick={() => setEffect('filter-inkwell')}>
                        <img src={SamplePicIcon} width={60} height={60} alt="EffectIcon" style={{
                            borderRadius: 4,
                            borderColor: effect === 'filter-inkwell' ? '#f09c01' : 'transparent',
                            borderStyle: 'solid',
                            borderWidth: 2,
                            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                            objectFit: 'cover'
                        }} className="filter-inkwell" />
                        <span style={{
                            color: effect === 'filter-inkwell' ? '#f09c01' : 'black'
                        }}>Inkwell</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                        marginRight: 30,
                        cursor: 'pointer'
                    }}
                        onClick={() => setEffect('filter-aden')}>
                        <img src={SamplePicIcon} width={60} height={60} alt="MatIcon" style={{
                            borderRadius: 4,
                            borderColor: effect === 'filter-aden' ? '#f09c01' : 'transparent',
                            borderStyle: 'solid',
                            borderWidth: 2,
                            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                            objectFit: 'cover'
                        }} className="filter-aden" />
                        <span style={{
                            color: effect === 'filter-aden' ? '#f09c01' : 'black'
                        }}>Aden</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                        marginRight: 30,
                        cursor: 'pointer'
                    }}
                        onClick={() => setEffect('filter-dogpatch')}>
                        <img src={SamplePicIcon} width={60} height={60} alt="MatIcon" style={{
                            borderRadius: 4,
                            borderColor: effect === 'filter-dogpatch' ? '#f09c01' : 'transparent',
                            borderStyle: 'solid',
                            borderWidth: 2,
                            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                            objectFit: 'cover'
                        }} className="filter-dogpatch" />
                        <span style={{
                            color: effect === 'filter-dogpatch' ? '#f09c01' : 'black'
                        }}>Dogpatch</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                        marginRight: 30,
                        cursor: 'pointer'
                    }}
                        onClick={() => setEffect('filter-earlybird')}>
                        <img src={SamplePicIcon} width={60} height={60} alt="MatIcon" style={{
                            borderRadius: 4,
                            borderColor: effect === 'filter-earlybird' ? '#f09c01' : 'transparent',
                            borderStyle: 'solid',
                            borderWidth: 2,
                            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                            objectFit: 'cover'
                        }} className="filter-earlybird" />
                        <span style={{
                            color: effect === 'filter-earlybird' ? '#f09c01' : 'black'
                        }}>Earlybird</span>
                    </div>
                </div>


                <div onClick={() => setType('')} className="goback_cta">
                    Go Back
                </div>
            </div>
        )
    }
    else if (type === 'mat') {
        return (
            <div style={{
                top: 66,
                width: '100vw',
                height: '18vh',
                position: 'absolute',
                background: 'white',
                boxShadow: '0px 7px 20px black',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
            }} className="border border-success">
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                }}
                    onClick={() => setMat(0)}>
                    <img src={SamplePicIcon} width={60} height={60} alt="FrameIcon" style={{
                        borderRadius: 4,
                        borderColor: mat === 0 ? '#f09c01' : '#808080',
                        borderStyle: 'solid',
                        borderWidth: 2
                    }} />
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: 56,
                    marginRight: 60,
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer'
                }}
                    onClick={() => setMat(1)}>
                    <img src={SamplePicIcon} width={60} height={60} alt="EffectIcon" style={{
                        borderRadius: 4,
                        borderColor: mat === 1 ? '#f09c01' : '#808080',
                        borderStyle: 'solid',
                        borderWidth: 2,
                        padding: 8
                    }} />
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer'
                }}
                    onClick={() => setMat(2)}>
                    <img src={SamplePicIcon} width={60} height={60} alt="MatIcon" style={{
                        borderRadius: 4,
                        borderColor: mat === 2 ? '#f09c01' : '#808080',
                        borderStyle: 'solid',
                        borderWidth: 2,
                        padding: 16
                    }} />
                </div>
                <div onClick={() => setType('')} className="goback_cta">
                    Go Back
                </div>
            </div>
        )
    }
    else if (type === 'sticker') {
        return (
            <div style={{
                top: 66,
                width: '100vw',
                height: '18vh',
                position: 'absolute',
                background: 'white',
                boxShadow: '0px 7px 20px black',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }} className="border border-warning">
                <div style={{
                    width: '92vw',
                    height: '18vh',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    overflowX: 'scroll',
                    background: 'white',
                    boxShadow: '0px 7px 20px black',
                }}>
                    <Stickers setSticker={setSticker} />
                </div>
                <div onClick={() => {
                    setText(value)
                    setType('')
                }} className="goback_cta">
                    Go Back
                </div>
                {/* <span onClick={() => setType('')} style={{
                    color: '#f09c01',
                    cursor: 'pointer',
                    fontSize: 14,
                    position: 'fixed',
                    bottom: '15vh',
                    left: '95vw',
                    zIndex: 2,

                }}>{'Close'}</span> */}
            </div>
        )
    }
    else if (type === 'text') {
        return (
            <div style={{
                top: 66,
                width: '100vw',
                height: '18vh',
                position: 'absolute',
                background: 'white',
                boxShadow: '0px 7px 20px black',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: width < 576 ? 'flex-start' : 'center',
                alignItems: 'center',
                overflow: 'auto'
            }} className="border border-primary">
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    marginRight: 30,
                    cursor: 'pointer',
                }}>
                    <input type="text" className="customText"
                        onChange={e => { setValue(e.target.value) }}
                        value={value}
                        placeholder="Write your message here..." maxLength={50} />
                </div>
                <div style={{ gap: 8, display: 'flex' }}>
                    <div onClick={() => {
                        setText(value)
                        setType('')
                    }} className="home-btn" style={{ cursor: 'pointer', marginLeft: 0 }}>
                        Update
                    </div>
                    <div onClick={() => {
                        setType('')
                    }} className="home-btn" style={{ cursor: 'pointer', marginLeft: 0 }}>
                        Close
                    </div>
                </div>
            </div>
        )
    }
    else if (type === 'crop') {
        return (
            <div style={{
                top: 66,
                width: '100vw',
                height: '18vh',
                position: 'absolute',
                background: 'white',
                boxShadow: '0px 7px 20px black',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
            }} className="border border-dark">
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    marginRight: 30,
                    cursor: 'pointer',
                }}>
                    <input type="range" min="1" max="100" className="slider" id="myRange"
                        onChange={e => { setRangeValue(e.target.value) }}
                        value={rangeValue}
                    ></input>
                </div>
                <div onClick={() => {
                    setText(value)
                    setType('')
                    setCropping(false)
                }} className="goback_cta">
                    Go Back
                </div>
            </div>
        )
    }
    return (
        <div className="border border-secondary">
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                marginLeft: width < 576 ? '22vw' : 0,
                ...marginRight
            }}
                onClick={() => setType('frame')}
            >
                <img src={FrameIcon} width={imageSize} height={imageSize} alt="FrameIcon" />
                <span style={{ ...fontSize }}>Frames</span>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                ...marginRight
            }}
                onClick={() => { setType('effect') }}>
                <img src={EffectIcon} width={imageSize} height={imageSize} alt="EffectIcon" />
                <span style={{ ...fontSize }}>Effects</span>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                ...marginRight
            }}
                onClick={() => { setType('sticker') }}>
                <img src={StickercIcon} width={imageSize} height={imageSize} alt="EffectIcon" />
                <span style={{ ...fontSize }}>Stickers</span>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                ...marginRight
            }}
                onClick={() => setType('mat')}>
                <img src={MatIcon} width={imageSize} height={imageSize} alt="MatIcon" />
                <span style={{ ...fontSize }}>Mat</span>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                ...marginRight
            }}
                onClick={() => {
                    setType('crop')
                    setCropping(true)
                }}>
                <img src={CropIcon} width={imageSize} height={imageSize} alt="CropIcon" />
                <span style={{ ...fontSize }}>Crop</span>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer'
            }}
                onClick={() => setType('text')}>
                <img src={TextIcon} width={imageSize} height={imageSize} alt="MatIcon" />
                <span style={{ ...fontSize }}>Add Text</span>
            </div>
            <div onClick={() => onPlusClick()} className={width < 576 ? "frame-scale-mobile2" : "frame-scale2"}>
                <svg xmlns="http://www.w3.org/2000/svg" height="0.6em" viewBox="0 0 512 512"><path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" /></svg>
            </div>
        </div>
    )
}

export default Frames

//https://insta-filters.netlify.app/