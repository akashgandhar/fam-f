import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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

import Stickers from "../components/sticker";
import ResizeableContainer from "../components/resizeableContainter";
import DragableImage from "../components/dragableImage";
import { setCropping, setFramesAll } from "../utils/globleFunc";
import { TextDraggable } from "../components/textDraggable";
import { toPng } from "html-to-image";
import { useDispatch, useSelector } from "react-redux";
import { loaderAction, showCheckOutAction, showLoginAction } from "../redux/actions/global";
import useWindowDimensions from "../components/useWindowDimensions";
import html2canvas from 'html2canvas';
import { baseUrl } from "../theme/appConstants";
import fileUpload from "../components/fileUploader/fileUpload";
import { getImage } from "../components/fileUploader/getImage";
import { handleUnlinkFile } from "../components/fileUploader/deleteImg";

var gloableImages = []
const Frames = () => {
    const { width } = useWindowDimensions();
    const profile = useSelector(state => state.userReducer.user);
    const [oldImages, setOldImages] = useState([])
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
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;


    useLayoutEffect(() => {
        window.scrollTo(scrollX, scrollY);
    });

    async function createwBlobUrl(imageUrl) {
        return await getImage(imageUrl, "products")
        // return await fetch(imageUrl)
        //     .then((response) => response.blob())
        //     .then((imageBlob) => {
        //         return URL.createObjectURL(imageBlob);
        //     })
        //     .catch((error) => {
        //         console.error('Error fetching the image:', error);
        //     });
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const localData = await getLocalStorageData();
                setOldImages(localData);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
        
    }, []);

    useEffect(() => {
        if (oldImages && oldImages.length > 0) {
            setImages(oldImages)
            gloableImages = oldImages
        console.log(gloableImages);
        }

    }, [oldImages])

    async function getLocalStorageData() {
        const storedData = localStorage.getItem('family_vibes_images_data');
        const parsedData = JSON.parse(storedData);
        const updatedData = await Promise.all(parsedData.map(async (item) => {
            const newUrl = await createwBlobUrl(item.url)
            item.localUrl = newUrl;
            return item;
        }));
        return updatedData;
    }

    function updateAndSaveImagesInLocalStorage(items) {
        const data = JSON.stringify(items);
        localStorage.setItem('family_vibes_images_data', data);
    }

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
                    scaleValue: '1',
                    localUrl: URL.createObjectURL(item)
                });
            }
            setImages(tempData);
            updateAndSaveImagesInLocalStorage(tempData)
            gloableImages = tempData;
            dispatch(loaderAction(false));
        }
    }

    const createButton = () => (
        <div className="text-center">
            {profile ? '' :
                <>
                    <div className="my-4">
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
            <h5 className="mt-3 font-weight-600">Start Creating</h5>
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
        const previousimage = [...gloableImages];
        for (let item in divMainRef.current) {
            try {
                let dataUrl, dataUrlWF, canvas, canvas2;
                const isiPhone = /iPhone/i.test(navigator.userAgent);
                if (isiPhone) {
                    canvas = await html2canvas(divMainRef.current[item], { useCORS: true });
                    dataUrl = canvas.toDataURL();
                    canvas2 = await html2canvas(div2Ref.current[item]);
                    dataUrlWF = canvas2.toDataURL();
                }
                else {
                    dataUrl = await toPng(divMainRef.current[item], { cacheBust: false });
                    dataUrlWF = await toPng(div2Ref.current[item], { cacheBust: false });
                }
                const url = await fileUpload(dataUrl, true);
                const urlWF = await fileUpload(dataUrlWF, true);
                const original_image = previousimage[item].url

                //older code
                // const canvas = await html2canvas(divMainRef.current[item]);
                // const dataUrl = canvas.toDataURL();  
                // const dataUrl = await toPng(divMainRef.current[item], { cacheBust: false });
                // const url = await uploadFile(dataUrl, 'tempImage.png');
                // const original_image = tempData[item].url
                // const dataUrlWF = await toPng(div2Ref.current[item], { cacheBust: false });
                // const urlWF = await uploadFile(dataUrlWF, 'tempImage.png');
                //end here               

                tempData[item].frameUrl = url;
                tempData[item].url = urlWF;
                tempData[item].original_image = original_image
                tempFinalData.push({
                    "quantity": 1,
                    "picture": urlWF,
                    "frame": url,
                    "original_image": original_image
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
    const [cross,setCross]=useState(false)
    const [value, setValue] = useState('')

    return (
        <div className="UserAdmin">
            <Header showCheckout={images.length > 0} convertHtmlToImg={convertHtmlToImg} />
            <section className="h-100">
                <div className="frame-main h-100">
                    <div id='mainFrameScrollContainer' className="h-100">
                        {/* ---------------------------- */}
                        {images.length > 0 && <BottomSelector onPlusClick={() => {
                            ref.current.click()
                        }}
                        
                        value={value} setValue={setValue}
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
                                updateAndSaveImagesInLocalStorage(gloableImages)
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

                                        imgRef.current[selectedFrame].style.transform = value
                                        //imgRef.current[selectedFrame].style.setProperty("transform", value);

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


                                            imgRef.current[item].style.transform = value;
                                            //imgRef.current[item].style.setProperty("transform", value);
                                            const tempObj = { ...gloableImages[item] }
                                            tempObj.scale = value;
                                            tempObj.scaleValue = rangeValue;
                                            gloableImages[item] = tempObj;
                                        }
                                    }
                                    updateAndSaveImagesInLocalStorage(gloableImages)
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
                                    updateAndSaveImagesInLocalStorage(gloableImages)

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
                                    updateAndSaveImagesInLocalStorage(gloableImages)
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
                                updateAndSaveImagesInLocalStorage(gloableImages)
                            }}
                            updateText={(text) => {
                                console.log(selectedFrame);
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
                                if(text===""){
                                setCross(false)
                                    
                                }else{
                                setCross(true)

                                }
                                updateAndSaveImagesInLocalStorage(gloableImages)
                            }}
                            cross={cross} setCross={setCross}
                            selectedFrame={selectedFrame}
                        />}
                        {/* ------------------------- Image Previoew Box */}
                        {images.length == 0 ? createButton() :
                            images.map((item, index) => {

                                return <FrameContainer item={item} index={index} key={Math.random().toString()}
                                    selectedFrame={selectedFrame}
                                    onSelectedFrame={(indexS) => {
                                        setImages(gloableImages)
                                        setSelectedFrame(indexS)
                                        updateAndSaveImagesInLocalStorage(gloableImages)
                                    }}
                                    deleteText={() => {
                                        debugger
                                        const tempData = gloableImages.map((item, subIndex) => {
                                            const tempData = { ...item };
                                            if (subIndex == index) {
                                                tempData["text"]=""
                                            }
                                            return tempData
                                        })
                                        setImages(tempData)
                                        setValue("")
                                        gloableImages = tempData
                                        updateAndSaveImagesInLocalStorage(gloableImages)

                                    }}
                                    onDelete={async (index) => {
                                        const tempData = gloableImages.filter((item, subIndex) => { return subIndex != index })
                                        setImages(tempData)
                                        // gloableImages?.forEach(async (e)=>{
                                        await handleUnlinkFile(gloableImages?.[index]?.url)
                                        gloableImages?.[index]?.frameUrl && await handleUnlinkFile(gloableImages?.[index]?.frameUrl)
                                        gloableImages?.[index]?.original_image && await handleUnlinkFile(gloableImages?.[index]?.original_image)
                                        // })
                                        gloableImages = tempData;
                                        updateAndSaveImagesInLocalStorage(gloableImages)
                                    }}
                                    onDeleteSticker={(index, subItem,sticketIndex) => {
                                        debugger
                                        const tempData = gloableImages.map((item, subIndex) => {
                                            const tempData = { ...item };
                                            if (subIndex == index) {
                                                console.log(tempData.sticker[sticketIndex]);
                                                const removedSticker = tempData.sticker[sticketIndex];

                                                const tempStickers = tempData.sticker.filter((stickerItem, index) => {
                                                    return index !== sticketIndex;
                                                });
                                                tempData.sticker = tempStickers;
                                            }
                                            return tempData
                                        })
                                        setImages(tempData)
                                        gloableImages = tempData
                                        updateAndSaveImagesInLocalStorage(gloableImages)

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
                                        updateAndSaveImagesInLocalStorage(gloableImages)
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
                                        updateAndSaveImagesInLocalStorage(gloableImages)
                                    }}
                                    onTextPosition={(index, data) => {
                                        const tempData = gloableImages[index]
                                        tempData.textPosition = data
                                        gloableImages[index] = tempData
                                        updateAndSaveImagesInLocalStorage(gloableImages)
                                    }}
                                    cross={cross} setCross={setCross}
                                    ref={imgRef}
                                    div1Ref={div1Ref}
                                    div2Ref={div2Ref}
                                    divTextRef={divTextRef}
                                    div3Ref={div3Ref}
                                    divMainRef={divMainRef}

                                />
                            })
                        }
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
        deleteText
        ,cross,setCross
    } = props
    const warnRef = useRef()
    return (
        <div className={`FrameContainer ${selectedFrame == index ? 'SelectedFrame' : ''}`}>
            <div className="ImageContainer" ref={temp => { divMainRef.current[index] = temp }} style={{
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
                       {
                          <div style={{
                            position: 'absolute',
                        }} >
                            <TextDraggable item={item} index={index} divTextRef={divTextRef} onTextPosition={onTextPosition} deleteText={deleteText} setCross={setCross} cross={cross}  />
                            
                        </div>
                       }

                        {item.sticker.length > 0 &&
                            item.sticker.map(((subItem, sticketIndex) => {

                                return (<ResizeableContainer
                                    key={Math.random().toString()}
                                    onDelete={() => { onDeleteSticker(index, subItem,sticketIndex) }}
                                    onSizePass={(size) => { onSizePass(index, size, sticketIndex) }}
                                    onPosition={(position) => { onPosition(index, position, sticketIndex) }}
                                    sizePass={subItem.size} position={subItem.position}
                                    div2Ref={div2Ref}
                                    index={index}
                                    isShowBoundry={item.isShowBoundry}
                                >
                                    <img src={subItem.img} alt="sticker"
                                        draggable="false"
                                        style={{
                                            width: '100%',
                                            height: '100%',

                                        }}
                                    />
                                </ResizeableContainer>)
                            }))
                        }
                    </div>
                </div>
            </div>
            <div className="frameMessage">
                <span className="frameImageError" ref={warnRef}>{''}</span>
                <span
                    onClick={() => {
                        if (selectedFrame == index) {
                            onSelectedFrame(-1)
                        }
                        else onSelectedFrame(index)
                    }} className={selectedFrame == index ? 'badge badge-success' : 'badge badge-secondary'} >{selectedFrame == index ? 'Selected' : 'Select'}</span>
                <span onClick={() => onDelete(index)} className="badge badge-danger">{'Delete'}</span>
            </div>
        </div>

    )
})
var frameClassGloable
var subFrameGloable
var rangeValueGloable = '1'
var effectGloable, frameSizeGloable
export const BottomSelector = ({ onPlusClick, updateImageData, updateEffect, updateDiv, selectedFrame, updateText, updateMat,value, setValue, updateRange }) => {
    const { width } = useWindowDimensions();
    const [type, setType] = useState('')
    const [frame, setFrame] = useState(-1)
    const [effect, setEffect] = useState(-1)
    const [mat, setMat] = useState(-1)
    const [sticker, setSticker] = useState(null)
    const [text, setText] = useState(-1)
    const [rangeValue, setRangeValue] = useState(-1)
    const marginRight = { marginRight: 30 }
    // const fontSize = { fontSize: 14 }
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
        if (frame != -1) {
            frameClassGloable = frame === 0 ? 'frame-one' : frame === 1 ? 'frame-two' : 'frame-three'
            subFrameGloable = frame == 1 ? 'sub-frame-inner sub-frame' : frame === 2 ? 'sub-frame-inner sub-frame-wood' : 'sub-frame-inner'
            updateDiv(frameClassGloable, subFrameGloable)
        }
    }, [frame])

    useEffect(() => {
        if (text != -1) {
            updateText(text)
        }
    }, [text])

    useEffect(() => {
        if (rangeValue != -1) {
            updateRange(rangeValue)
        }
    }, [rangeValue])

    useEffect(() => {
        if (effect != -1) {
            effectGloable = effect;
            updateEffect(effectGloable)
        }
    }, [effect])

    useEffect(() => {
        if (mat != -1) {
            frameSizeGloable = mat === 0 ? 'frame-image-large' : mat === 1 ? 'frame-image-medium' : 'frame-image-small'
            updateMat(frameSizeGloable)
        }
    }, [mat])
    const stickerListRef = useRef(null);

    const handleMouseWheel = (e) => {
        const delta = e.deltaY || e.detail || e.wheelDelta;

        if (stickerListRef.current) {
            stickerListRef.current.scrollLeft += delta;
        }
    }
    if (type === 'frame') {
        return (
            <div className="ToolBox Frame">
                <div className={`toolContent ${frame === 0 ? 'activeEffect' : ''}`} onClick={() => setFrame(0)}>
                    <img src={BlackFrameIcon} width={60} height={60} alt="FrameIcon" />
                    <span>Black</span>
                </div>
                <div className={`toolContent ${frame === 1 ? 'activeEffect' : ''}`} onClick={() => setFrame(1)}>
                    <img src={WhiteFrameIcon} width={60} height={60} alt="EffectIcon" />
                    <span>White</span>
                </div>
                <div className={`toolContent ${frame === 2 ? 'activeEffect' : ''}`} onClick={() => setFrame(2)}>
                    <img src={FrameLessIcon} width={60} height={60} alt="MatIcon" />
                    <span>Wood</span>
                </div>
                <div onClick={() => setType('')} className="goback_cta">
                    Go Back
                </div>
            </div>
        )
    }
    else if (type === 'effect') {
        return (
            <div className="ToolBox Effect">
                <div className={`toolContent ${effect === '' ? 'activeEffect' : ''}`} onClick={() => setEffect('')}>
                    <img src={SamplePicIcon} width={60} height={60} alt="FrameIcon" />
                    <span>Normal</span>
                </div>
                <div className={`toolContent ${effect === 'filter-willow' ? 'activeEffect' : ''}`} onClick={() => setEffect('filter-willow')}>
                    <img src={SamplePicIcon} width={60} height={60} alt="EffectIcon" className="filter-willow" />
                    <span>Willow</span>
                </div>
                <div className={`toolContent ${effect === 'filter-inkwell' ? 'activeEffect' : ''}`} onClick={() => setEffect('filter-inkwell')}>
                    <img src={SamplePicIcon} width={60} height={60} alt="EffectIcon" className="filter-inkwell" />
                    <span>Inkwell</span>
                </div>
                <div className={`toolContent ${effect === 'filter-aden' ? 'activeEffect' : ''}`} onClick={() => setEffect('filter-aden')}>
                    <img src={SamplePicIcon} width={60} height={60} alt="MatIcon" className="filter-aden" />
                    <span>Aden</span>
                </div>
                <div className={`toolContent ${effect === 'filter-dogpatch' ? 'activeEffect' : ''}`} onClick={() => setEffect('filter-dogpatch')}>
                    <img src={SamplePicIcon} width={60} height={60} alt="MatIcon" className="filter-dogpatch" />
                    <span>Dogpatch</span>
                </div>
                <div className={`toolContent ${effect === 'filter-earlybird' ? 'activeEffect' : ''}`} onClick={() => setEffect('filter-earlybird')}>
                    <img src={SamplePicIcon} width={60} height={60} alt="MatIcon" className="filter-earlybird" />
                    <span>Earlybird</span>
                </div>
                <div onClick={() => setType('')} className="goback_cta">
                    Go Back
                </div>
            </div>
        )
    }
    else if (type === 'mat') {
        return (
            <div className="ToolBox Mat">
                <div className={`toolContent ${mat === 0 ? 'activeEffect' : ''}`} onClick={() => setMat(0)}>
                    <img src={SamplePicIcon} width={60} height={60} alt="FrameIcon" />
                </div>
                <div className={`toolContent ${mat === 1 ? 'activeEffect' : ''}`} onClick={() => setMat(1)}>
                    <img src={SamplePicIcon} width={60} height={60} alt="EffectIcon" className="p-2" />
                </div>
                <div className={`toolContent ${mat === 2 ? 'activeEffect' : ''}`} onClick={() => setMat(2)}>
                    <img src={SamplePicIcon} width={60} height={60} alt="MatIcon" className="p-3" />
                </div>
                <div onClick={() => setType('')} className="goback_cta">
                    Go Back
                </div>
            </div>
        )
    }
    else if (type === 'sticker') {
        return (
            <div className="ToolBox Sticker justify-content-start">
                <div className="stickerList" onWheel={handleMouseWheel} ref={stickerListRef}>
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
            <div className="ToolBox Text">
                <div className="toolContent">
                    <input type="text" className="form-control"
                        onChange={e => { setValue(e.target.value) }}
                        value={value}
                        placeholder="Write your message here..." />
                </div>
                <div className="toolContent">
                    <button onClick={() => {
                        setText(value)
                        setType('')
                    }} className="btn btn-orange">
                        Update
                    </button>
                </div>
                <div onClick={() => { setType('') }} className="goback_cta">
                    Go Back
                </div>
            </div>
        )
    }
    else if (type === 'crop') {
        return (
            <div className="ToolBox Crop">
                <div className="toolContent">
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
        <div className="ToolBox">
            <div className="toolContent" onClick={() => setType('frame')}>
                <img src={FrameIcon} alt="FrameIcon" />
                <span>Frames</span>
            </div>
            <div className="toolContent" onClick={() => { setType('effect') }}>
                <img src={EffectIcon} alt="EffectIcon" />
                <span>Effects</span>
            </div>
            <div className="toolContent" onClick={() => { setType('sticker') }}>
                <img src={StickercIcon} alt="EffectIcon" />
                <span>Stickers</span>
            </div>
            <div className="toolContent" onClick={() => setType('mat')}>
                <img src={MatIcon} alt="MatIcon" />
                <span>Mat</span>
            </div>
            <div className="toolContent" onClick={() => {
                setType('crop')
                setCropping(true)
            }}>
                <img src={CropIcon} alt="CropIcon" />
                <span>Crop</span>
            </div>
            <div className="toolContent" onClick={() => setType('text')}>
                <img src={TextIcon} alt="MatIcon" />
                <span>Add Text</span>
            </div>
            <div className="toolContent zoom-in-out-box" onClick={() => onPlusClick()} >
                <svg xmlns="http://www.w3.org/2000/svg" fill="#ff5814" viewBox="0 0 512 512"><path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" /></svg>
                <span style={{ color: "#ff5814" }}>Add Frame</span>
            </div>
        </div>
    )
}

export default Frames

//https://insta-filters.netlify.app/
