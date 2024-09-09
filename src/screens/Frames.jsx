import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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

var globalImages = []
const Frames = () => {
    const { width } = useWindowDimensions();
    const profile = useSelector(state => state.userReducer.user);
    const [oldImages, setOldImages] = useState([])
    const ref = useRef();
    const dispatch = useDispatch()
    const [images, setImages] = useState([]);
    const centerItem = width < 786 ? (images?.length < 2 && { justifyContent: 'center' }) : (images?.length < 3 && { justifyContent: 'center' })
    const imgRef = useRef([]);
    const div1Ref = useRef([]);
    const div2Ref = useRef([]);
    const divTextRef = useRef([]);
    const div3Ref = useRef([]);
    const divMainRef = useRef([]);
    const [selectedFrame, setSelectedFrame] = useState(-1);
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const [cross, setCross] = useState(false);
    const [value, setValue] = useState('');
    const [type, setType] = useState('');
    const [size1, setSize1] = useState("1x1");
    const [numberOfFrames, setNumberOfFrames] = useState();
    const [sizes, setSizes] = useState([]);


    function calculateFrameDimensions(aspectRatioString) {
        const [widthRatio, heightRatio] = aspectRatioString.split('x').map(Number);
        const maxWidth = 400;
        const maxHeight = 300;

        let frameWidth = maxWidth;
        let frameHeight = (frameWidth / widthRatio) * heightRatio;

        if (frameHeight > maxHeight) {
            frameHeight = maxHeight;
            frameWidth = (frameHeight / heightRatio) * widthRatio;
        }

        console.log('frameWidth:', frameWidth, 'frameHeight:', frameHeight);

        return [frameWidth, frameHeight];
    }

    useLayoutEffect(() => {
        window.scrollTo(scrollX, scrollY);
    });

    useEffect(() => {
        // Update numberOfFrames whenever images changes
        setNumberOfFrames(images.length); 
        console.log('images.length', images.length);
        console.log('images: ', images);
      }, [images]);

    async function createwBlobUrl(imageUrl) {
        return await getImage(imageUrl, "products")
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
            globalImages = oldImages
        }
    }, [oldImages]);




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
        if (e.target.files?.length > 0) {
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
                    localUrl: URL.createObjectURL(item),
                    size: size1,
                });
            }
            setImages(tempData);
            updateAndSaveImagesInLocalStorage(tempData)
            globalImages = tempData;
            dispatch(loaderAction(false));
        }
    }

    // const handleSizeChange = (newSize) => {
    //     if (newSize === null) {
    //         setType('');
    //         return;
    //     }

    //     if (selectedFrame > -1) {
    //         // Update the size of the selected frame
    //         const updatedImages = [...globalImages];
    //         updatedImages[selectedFrame].size = newSize;
    //         setImages(updatedImages);
    //         globalImages = updatedImages;
    //         updateAndSaveImagesInLocalStorage(globalImages);

    //         // Recalculate frame dimensions and update the frame
    //         const [frameWidth, frameHeight] = calculateFrameDimensions(newSize);
    //         // console.log('frameWidth:', frameWidth, 'frameHeight:', frameHeight);
    //         div1Ref.current[selectedFrame].style.width = `${frameWidth}px`;
    //         div1Ref.current[selectedFrame].style.height = `${frameHeight}px`;

    //         // Adjust image scale to fit the new frame dimensions
    //         const scaleToFit = Math.min(frameWidth / 400, frameHeight / 300);
    //         const newScale = `translate(0px, 0px) rotate(0deg) scale(${scaleToFit})`;
    //         imgRef.current[selectedFrame].style.transform = newScale;
    //         updatedImages[selectedFrame].scale = newScale;
    //         updatedImages[selectedFrame].scaleValue = scaleToFit.toString();
    //     }
    // };


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
        const tempData2 = [...globalImages];
        for (let i in globalImages) {
            tempData2[i].isShowBoundry = false;
        }
        globalImages = tempData2
        setImages(globalImages);

        setTimeout(() => { convertHtmlToImg2() }, 2000);
    }

    const convertHtmlToImg2 = async () => {
        const tempData = [...globalImages];
        const tempFinalData = []
        const previousimage = [...globalImages];
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
        globalImages = tempData
        setFramesAll(tempFinalData);
        setImages(globalImages);
        dispatch(loaderAction(false));
        dispatch(showCheckOutAction(true));
        const tempData2 = [...globalImages];
        for (let i in globalImages) {
            tempData2[i].isShowBoundry = true;
        }
        globalImages = tempData2
        setImages(globalImages);
    }

    useEffect(() => {
        const [frameWidth, frameHeight] = calculateFrameDimensions(size1);

        const storedImages = localStorage.getItem('family_vibes_images_data');
        let initialImages = [];
        if (storedImages) {
            const parsedImages = JSON.parse(storedImages);
            if (parsedImages?.length === numberOfFrames) {
                initialImages = parsedImages.map(item => ({
                    ...item,
                    width: frameWidth,
                    height: frameHeight,
                }));
            }
        }

        if (initialImages?.length === 0) {
            initialImages = Array.from({ length: numberOfFrames }, (_, index) => {
                const scaleToFit = Math.min(frameWidth / 400, frameHeight / 300);

                return {
                    width: frameWidth,
                    height: frameHeight,
                    frame: 0,
                    effect: "",
                    text: "",
                    mat: 0,
                    sticker: [],
                    rangeValue: "1",
                    div1Class: "frame-one",
                    div2Class: "sub-frame-inner",
                    div3Class: "frame-image-large",
                    scale: `translate(0px, 0px) rotate(0deg) scale(${scaleToFit})`,
                    textPosition: { x: 0, y: 0 },
                    isShowBoundry: true,
                    scaleValue: scaleToFit.toString(),
                    localUrl: null,
                    size: size1,
                };
            });
        }

        setImages(initialImages);
        globalImages = initialImages;
        updateAndSaveImagesInLocalStorage(initialImages);
    }, [numberOfFrames, size1]);

    return (
        <div className="UserAdmin">
            <Header showCheckout={images?.length > 0} convertHtmlToImg={convertHtmlToImg} />
            <section className="h-100">
                <div className="frame-main h-100">
                    <div id='mainFrameScrollContainer' className="h-100">
                        {images?.length > 0 && (
                            <BottomSelector
                                setImages={setImages}
                                updateAndSaveImagesInLocalStorage={updateAndSaveImagesInLocalStorage}
                                div1Ref={div1Ref}
                                setSize1={setSize1}
                                setType={setType}
                                onPlusClick={() => {
                                    ref.current.click()
                                }}
                                value={value}
                                setValue={setValue}
                                updateImageData={(sticker) => {
                                    if (selectedFrame > -1) {
                                        const tempObj = { ...globalImages[selectedFrame] }
                                        const tempArraySticker = [...tempObj.sticker]
                                        tempArraySticker.push(sticker)
                                        tempObj.sticker = tempArraySticker
                                        const tempArr = [...globalImages]
                                        tempArr[selectedFrame] = tempObj
                                        setImages(tempArr);
                                        globalImages = tempArr;

                                    } else {
                                        const tempData = globalImages.map(item => {
                                            const tempObj = { ...item }
                                            const tempArraySticker = [...tempObj.sticker]
                                            tempArraySticker.push(sticker)
                                            tempObj.sticker = tempArraySticker
                                            return tempObj
                                        })
                                        setImages(tempData);
                                        globalImages = tempData;
                                    }
                                    updateAndSaveImagesInLocalStorage(globalImages)
                                }}
                                updateRange={(rangeValue) => {
                                    if (imgRef.current && imgRef.current.length > 0) {
                                        if (selectedFrame > -1) {
                                            const splitt = globalImages[selectedFrame].scale.split(' ')
                                            let tempTrans = splitt[0]
                                            if (rangeValue == '1' || rangeValue == 1) {
                                                tempTrans = 'translate(0px,0px)'
                                            }
                                            const value = `${tempTrans} rotate(0deg) scale(${1 + (rangeValue / 10)})`
                                            imgRef.current[selectedFrame].style.setProperty("transform", value);

                                            const tempObj = { ...globalImages[selectedFrame] }
                                            tempObj.scale = value;
                                            tempObj.scaleValue = rangeValue;

                                            globalImages[selectedFrame] = tempObj;
                                        }
                                        else {
                                            for (let item in imgRef.current) {
                                                const splitt = globalImages[item].scale.split(' ')
                                                let tempTrans = splitt[0]
                                                if (rangeValue == '1' || rangeValue == 1) {
                                                    tempTrans = 'translate(0px,0px)'
                                                }
                                                const value = `${tempTrans} rotate(0deg) scale(${1 + (rangeValue / 10)})`
                                                imgRef.current[item].style.setProperty("transform", value);


                                                const tempObj = { ...globalImages[item] }
                                                tempObj.scale = value;
                                                tempObj.scaleValue = rangeValue;

                                                globalImages[item] = tempObj;
                                            }
                                        }

                                    }
                                }}
                                updateMat={(mat) => {
                                    if (imgRef.current && imgRef.current?.length > 0) {
                                        if (selectedFrame > -1) {
                                            const splitt = globalImages[selectedFrame].div3Class.split(' ')
                                            div3Ref.current[selectedFrame].className = `${mat} ${splitt[1]}`;

                                            const tempObj = { ...globalImages[selectedFrame] }
                                            tempObj.div3Class = `${mat} ${splitt[1]}`;
                                            globalImages[selectedFrame] = tempObj;
                                        } else {
                                            for (let item in imgRef.current) {
                                                const splitt = globalImages[item].div3Class.split(' ')
                                                div3Ref.current[item].className = `${mat} ${splitt[1]}`;

                                                const tempObj = { ...globalImages[item] }
                                                tempObj.div3Class = `${mat} ${splitt[1]}`;

                                                globalImages[item] = tempObj;
                                            }
                                        }
                                        updateAndSaveImagesInLocalStorage(globalImages)

                                    }
                                }}
                                updateEffect={(effect) => {
                                    if (imgRef.current && imgRef.current?.length > 0) {
                                        if (selectedFrame > -1) {
                                            const splitt = globalImages[selectedFrame].div3Class.split(' ')
                                            div3Ref.current[selectedFrame].className = `${splitt[0]} ${effect}`;

                                            const tempObj = { ...globalImages[selectedFrame] }
                                            tempObj.div3Class = `${splitt[0]} ${effect}`;
                                            globalImages[selectedFrame] = tempObj;
                                        } else {
                                            for (let item in imgRef.current) {
                                                const splitt = globalImages[item].div3Class.split(' ')
                                                div3Ref.current[item].className = `${splitt[0]} ${effect}`;

                                                const tempObj = { ...globalImages[item] }
                                                tempObj.div3Class = `${splitt[0]} ${effect}`;

                                                globalImages[item] = tempObj;
                                            }
                                        }
                                        updateAndSaveImagesInLocalStorage(globalImages)
                                    }
                                }}
                                updateDiv={(frameClass, subFrame, text) => {
                                    if (selectedFrame > -1) {
                                        div1Ref.current[selectedFrame].className = frameClass;
                                        div2Ref.current[selectedFrame].className = subFrame;

                                        const tempObj = { ...globalImages[selectedFrame] }
                                        tempObj.div1Class = frameClass;
                                        tempObj.div2Class = subFrame;

                                        globalImages[selectedFrame] = tempObj;
                                    } else {
                                        if (div1Ref.current && div1Ref.current?.length > 0) {
                                            for (let item in div1Ref.current) {
                                                div1Ref.current[item].className = frameClass;
                                                div2Ref.current[item].className = subFrame;

                                                const tempObj = { ...globalImages[item] }
                                                tempObj.div1Class = frameClass;
                                                tempObj.div2Class = subFrame;

                                                globalImages[item] = tempObj;
                                            }
                                        }
                                    }
                                    updateAndSaveImagesInLocalStorage(globalImages)
                                }}
                                updateText={(text) => {
                                    if (selectedFrame > -1) {
                                        divTextRef.current[selectedFrame].innerText = text;
                                        const tempObj = { ...globalImages[selectedFrame] }
                                        tempObj.text = text;
                                        globalImages[selectedFrame] = tempObj;

                                    } else {
                                        if (div1Ref.current && div1Ref.current?.length > 0) {
                                            for (let item in div1Ref.current) {
                                                divTextRef.current[item].innerText = text;

                                                const tempObj = { ...globalImages[item] }
                                                tempObj.text = text;

                                                globalImages[item] = tempObj;
                                            }
                                        }
                                    }
                                    if (text === "") {
                                        setCross(false)

                                    } else {
                                        setCross(true)
                                    }
                                    updateAndSaveImagesInLocalStorage(globalImages)
                                }}
                                cross={cross}
                                setCross={setCross}
                                selectedFrame={selectedFrame}
                                // updateSize={handleSizeChange}
                                globalImages={globalImages}

                            // handleSizeChange={handleSizeChange}
                            />
                        )}
                        {images?.length == 0 ? createButton() :
                            images.map((item, index) => {

                                return <FrameContainer item={item} index={index} key={Math.random().toString()}
                                    selectedFrame={selectedFrame}
                                    onSelectedFrame={(indexS) => {
                                        setImages(globalImages)
                                        setSelectedFrame(indexS)
                                        updateAndSaveImagesInLocalStorage(globalImages)
                                    }}
                                    deleteText={() => {
                                        const tempData = globalImages.map((item, subIndex) => {
                                            const tempData = { ...item };
                                            if (subIndex == index) {
                                                tempData["text"] = ""
                                            }
                                            return tempData
                                        })
                                        setImages(tempData)
                                        setValue("")
                                        globalImages = tempData
                                        updateAndSaveImagesInLocalStorage(globalImages)

                                    }}
                                    onDelete={async (index) => {
                                        const tempData = globalImages.filter((item, subIndex) => subIndex != index);
                                    
                                        // Handle file unlinking
                                        await handleUnlinkFile(globalImages?.[index]?.url);
                                        globalImages?.[index]?.frameUrl && await handleUnlinkFile(globalImages?.[index]?.frameUrl);
                                        globalImages?.[index]?.original_image && await handleUnlinkFile(globalImages?.[index]?.original_image);
                                    
                                        // Update globalImages with a new array
                                        globalImages = [...tempData]; 
                                    
                                        // Update localStorage *before* setting the images state
                                        updateAndSaveImagesInLocalStorage(globalImages); 
                                        setImages(tempData);
                                    }}
                                    onDeleteSticker={(index, subItem, sticketIndex) => {
                                        const tempData = globalImages.map((item, subIndex) => {
                                            const tempData = { ...item };
                                            if (subIndex == index) {
                                                const tempStickers = tempData.sticker.filter((stickerItem, index) => {
                                                    return index !== sticketIndex;
                                                });
                                                tempData.sticker = tempStickers;
                                            }
                                            return tempData
                                        })
                                        setImages(tempData)
                                        globalImages = tempData
                                        updateAndSaveImagesInLocalStorage(globalImages)

                                    }}
                                    onSizePass={(index, data, sticketIndex) => {
                                        const tempData = globalImages.map((item, subIndex) => {
                                            const tempData = { ...item };
                                            if (subIndex == index) {
                                                tempData.sticker[sticketIndex].size = data
                                            }
                                            return tempData
                                        })
                                        globalImages = tempData
                                        updateAndSaveImagesInLocalStorage(globalImages)
                                    }}
                                    onPosition={(index, data, sticketIndex) => {
                                        const tempData = globalImages.map((item, subIndex) => {
                                            const tempData = { ...item };
                                            if (subIndex == index) {
                                                tempData.sticker[sticketIndex].position = data
                                            }
                                            return tempData
                                        })
                                        globalImages = tempData
                                        updateAndSaveImagesInLocalStorage(globalImages)
                                    }}
                                    onTextPosition={(index, data) => {
                                        const tempData = globalImages[index]
                                        tempData.textPosition = data
                                        globalImages[index] = tempData
                                        updateAndSaveImagesInLocalStorage(globalImages)
                                    }}
                                    cross={cross} setCross={setCross}
                                    ref={imgRef}
                                    div1Ref={div1Ref}
                                    div2Ref={div2Ref}
                                    divTextRef={divTextRef}
                                    div3Ref={div3Ref}
                                    divMainRef={divMainRef}
                                    size={size1}
                                    // onSizeChange={handleSizeChange}
                                    setSize1={setSize1}
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

var frameClassGloable
var subFrameGloable
var rangeValueGloable = '1'
var effectGloable, frameSizeGloable
export const BottomSelector = ({ onPlusClick, updateImageData, updateEffect, updateDiv, selectedFrame, updateText, updateMat, value, setValue, updateRange, setSize1, setImages, updateAndSaveImagesInLocalStorage, div1Ref }) => {
    const { width } = useWindowDimensions();
    const [type, setType] = useState('')
    const [frame, setFrame] = useState(-1)
    const [effect, setEffect] = useState(-1)
    const [mat, setMat] = useState(-1)
    const [sticker, setSticker] = useState(null)
    const [text, setText] = useState(-1)
    const [rangeValue, setRangeValue] = useState(-1)
    const marginRight = { marginRight: 30 }
    const imageSize = 22
    const [sizes, setSizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [colors, setColors] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [frameStyle, setFrameStyle] = useState({});
    const [subFrameStyle, setSubFrameStyle] = useState({});

    useEffect(() => {
        const fetchSizes = async () => {
            try {
                const response = await fetch('http://localhost:8000/getAllFrames');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSizes(data);

                if (selectedFrame > -1 && globalImages[selectedFrame].size) {
                    setSelectedSize(globalImages[selectedFrame].size);
                }
            } catch (error) {
                console.error('Error fetching sizes:', error);
            }
        };

        fetchSizes();
    }, []);
    useEffect(() => {
        const fetchColors = async () => {
            try {
                const response = await fetch('http://localhost:8000/getAllColors');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setColors(data);

                if (selectedFrame > -1 && globalImages[selectedFrame].color) {
                    setSelectedColor(globalImages[selectedFrame].color);
                }
            } catch (error) {
                console.error('Error fetching colors:', error);
            }
        };

        fetchColors();
        console.log('colors', colors);
    }, []);




    useEffect(() => {
        if (type === 'crop' && selectedFrame > -1) {
            setRangeValue(globalImages[selectedFrame].scaleValue);
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
    // const handleSizeClick = (size) => {
    //     setSelectedSize(size);
    //     onSizeChange(size);
    // };

    // if (type === 'frame') {
    //     return (
    //         <div className="ToolBox Frame">
    //             <div className={`toolContent ${frame === 0 ? 'activeEffect' : ''}`} onClick={() => setFrame(0)}>
    //                 <img src={BlackFrameIcon} width={60} height={60} alt="FrameIcon" />
    //                 <span>Black</span>
    //             </div>
    //             <div className={`toolContent ${frame === 1 ? 'activeEffect' : ''}`} onClick={() => setFrame(1)}>
    //                 <img src={WhiteFrameIcon} width={60} height={60} alt="EffectIcon" />
    //                 <span>White</span>
    //             </div>
    //             <div className={`toolContent ${frame === 2 ? 'activeEffect' : ''}`} onClick={() => setFrame(2)}>
    //                 <img src={FrameLessIcon} width={60} height={60} alt="MatIcon" />
    //                 <span>Wood</span>
    //             </div>
    //             <div onClick={() => setType('')} className="goback_cta">
    //                 Go Back
    //             </div>
    //         </div>
    //     )
    // }

     const handleColorClick = (hexColor) => {
    if (selectedFrame > -1) {
      const updatedImages = [...globalImages];
      updatedImages[selectedFrame].div1Class = `frame-one ${hexColor}`; // Apply the selected color directly
      setImages(updatedImages);
      globalImages = updatedImages;
      updateAndSaveImagesInLocalStorage(globalImages);

      const frameElement = div1Ref.current[selectedFrame];
      if (frameElement) {
        frameElement.style.setProperty('--frame-color', hexColor);
        frameElement.style.setProperty('--shadow-color', hexColor); // Set shadow color to match frame color
      }
    }
  };

      if (type === 'frame') {
        return (
          <div className="ToolBox Frame">
            <div className={`toolContent ${frame === 0 ? 'activeEffect' : ''}`} onClick={() => setFrame(0)}>
              <img src={BlackFrameIcon} width={60} height={60} alt="FrameIcon" />
              <span>Black</span>
              {/* Display color options for the black frame */}
              {colors.map(color => (
                <div
                  key={color._id}
                  className={`colorOption ${globalImages[selectedFrame]?.div1Class?.includes(color.hex) ? 'activeColor' : ''}`}
                  onClick={() => handleColorClick(color.hex, 0)} // Pass 0 for black frame
                  style={{ backgroundColor: color.hex }}
                ></div>
              ))}
            </div>
            <div className={`toolContent ${frame === 1 ? 'activeEffect' : ''}`} onClick={() => setFrame(1)}>
              <img src={WhiteFrameIcon} width={60} height={60} alt="EffectIcon" />
              <span>White</span>
              {/* Display color options for the white frame */}
              {colors.map(color => (
                <div
                  key={color._id}
                  className={`colorOption ${globalImages[selectedFrame]?.div1Class?.includes(color.hex) ? 'activeColor' : ''}`}
                  onClick={() => handleColorClick(color.hex, 1)} // Pass 1 for white frame
                  style={{ backgroundColor: color.hex }}
                ></div>
              ))}
            </div>
            <div className={`toolContent ${frame === 2 ? 'activeEffect' : ''}`} onClick={() => setFrame(2)}>
              <img src={FrameLessIcon} width={60} height={60} alt="MatIcon" />
              <span>Wood</span>
            </div>
            <div onClick={() => setType('')} className="goback_cta">
              Go Back
            </div>
          </div>
        );
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
    else if (type === 'size') {
        return (
            <div className="ToolBox Size">
                {sizes.map(size => (
                    <div
                        key={size._id}
                        className={`toolContent ${selectedSize === size.size ? 'activeEffect' : ''}`}
                        onClick={() => {
                            setSize1(size.size);
                            console.log('size:', size);
                            // handleSizeChange(size.size, selectedFrame); // Pass the index of the selected frame
                        }}
                    >
                        <span>{size.size}</span>
                    </div>
                ))}
                <div onClick={() => {
                    // handleSizeChange(null, selectedFrame); // Pass the index even when going back
                    setType('');
                }} className="goback_cta">
                    Go Back
                </div>
            </div>
        );
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
                    <input
                        type="range"
                        min="1"
                        max="100"
                        className="slider"
                        id="myRange"
                        onChange={e => { setRangeValue(e.target.value) }}
                        value={rangeValue}
                    />
                </div>

                {selectedFrame > -1 && ( // Conditionally render size options
                    <div className="ToolBox Size">
                        {sizes.map(size => (
                            <div
                                key={size._id}
                                className={`toolContent ${selectedSize === size.size ? 'activeEffect' : ''}`}
                                onClick={() => {
                                    setSize1(size.size);
                                    // handleSizeChange(size.size, selectedFrame);
                                }}
                            >
                                <span>{size.size}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div onClick={() => {
                    setText(value)
                    setType('')
                    setCropping(false)
                }} className="goback_cta">
                    Go Back
                </div>
                <div onClick={() => {
                    setCropping(false)
                    setType('size')
                }} className="change-size">
                    change size
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
            <div className="toolContent" onClick={() => setType('size')}>
                <img src={FrameIcon} alt="MatIcon" />
                <span>Size</span>
            </div>
            <div className="toolContent zoom-in-out-box" onClick={() => onPlusClick()} >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#ff5814"
                    viewBox="0 0 512 512"
                >
                    <path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
                </svg>
                <span style={{ color: "#ff5814" }}>Add Frame</span>
            </div>
        </div>
    )
}
export default Frames

export const FrameContainer = React.forwardRef((props, ref) => {
    const { item, index, onDelete, onDeleteSticker, div1Ref, div2Ref, divTextRef, div3Ref,
        onSizePass,
        onPosition,
        onTextPosition,
        selectedFrame,
        onSelectedFrame,
        divMainRef,
        deleteText
        , cross, setCross, setSize1
    } = props
    const warnRef = useRef()
    console.log('item:', item);

    return (
        <div className={`FrameContainer ${selectedFrame == index ? 'SelectedFrame' : ''}`}>
            <div className="ImageContainer" ref={temp => { divMainRef.current[index] = temp }} style={{
                padding: item.isShowBoundry ? 0 : 10,
                // width: item.size ? `${item.size.split('x')[0] * 100}px` : 'auto',
                // height: item.size ? `${item.size.split('x')[1] * 100}px` : 'auto'
                width: item.width ? `${item.width}px` : 'auto',
                height: item.height ? `${item.height}px` : 'auto'
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
                                    globalImages[index].scale = value
                                }}
                            />
                        </div>
                        {
                            <div style={{
                                position: 'absolute',
                            }} >
                                <TextDraggable item={item} index={index} divTextRef={divTextRef} onTextPosition={onTextPosition} deleteText={deleteText} setCross={setCross} cross={cross} />

                            </div>
                        }

                        {item.sticker?.length > 0 &&
                            item.sticker.map(((subItem, sticketIndex) => {

                                return (<ResizeableContainer
                                    key={Math.random().toString()}
                                    onDelete={() => { onDeleteSticker(index, subItem, sticketIndex) }}
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