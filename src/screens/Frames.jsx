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
import { useParams, Navigate } from "react-router-dom";
import axios from "axios";
import { useFrameContext } from "../context/FrameContext";

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
    const { size, numberOfFrames } = useParams();
    console.log(numberOfFrames)
    const fileInputRef = useRef(null);
    const [size1, setSize1] = useState('1x1');

    useLayoutEffect(() => {
        window.scrollTo(scrollX, scrollY);
    });

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
            gloableImages = oldImages
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
        if (e.target.files.length > 0 && selectedFrame > -1) {
            dispatch(loaderAction(true));
            const selectedFile = e.target.files[0];
            const url = await fileUpload(selectedFile);
            const updatedImages = [...gloableImages];
            updatedImages[selectedFrame] = {
                ...updatedImages[selectedFrame],
                file: selectedFile,
                url: url,
                localUrl: URL.createObjectURL(selectedFile)
            };
            setImages(updatedImages);
            updateAndSaveImagesInLocalStorage(updatedImages);
            gloableImages = updatedImages;
            console.log("updatedImages", updatedImages);
            dispatch(loaderAction(false));
        } else {
            console.error("No frame selected. Please select a frame before adding an image.");
        }
    };

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
        gloableImages = tempData2;
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
                    canvas = await html2canvas(divMainRef.current[item], {
                        useCORS: true,
                    });
                    dataUrl = canvas.toDataURL();
                    canvas2 = await html2canvas(div2Ref.current[item]);
                    dataUrlWF = canvas2.toDataURL();
                } else {
                    dataUrl = await toPng(divMainRef.current[item], {
                        cacheBust: false,
                    });
                    dataUrlWF = await toPng(div2Ref.current[item], {
                        cacheBust: false,
                    });
                }
                const url = await fileUpload(dataUrl, true);
                const urlWF = await fileUpload(dataUrlWF, true);
                const original_image = previousimage[item].url;

                tempData[item].frameUrl = url;
                tempData[item].url = urlWF;
                tempData[item].original_image = original_image;
                tempFinalData.push({
                    quantity: 1,
                    picture: urlWF,
                    frame: url,
                    original_image: original_image,
                });
            } catch (error) {
                console.log("########@@2", error);
            }
        }
        gloableImages = tempData;
        setFramesAll(tempFinalData);
        setImages(gloableImages);
        dispatch(loaderAction(false));
        dispatch(showCheckOutAction(true));
        const tempData2 = [...gloableImages];
        for (let i in gloableImages) {
            tempData2[i].isShowBoundry = true;
        }
        gloableImages = tempData2;
        setImages(gloableImages);
    };
    const [cross, setCross] = useState(false);
    const [value, setValue] = useState("");

    useEffect(() => {
        if (numberOfFrames > 0) {
        const [frameWidth, frameHeight] = calculateFrameDimensions(size1);
      
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
      
            return [frameWidth, frameHeight];
          }
      
          const initialImages = Array.from({ length: numberOfFrames }, (_, index) => {
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
            };
          });
      
          setImages(initialImages);
          gloableImages = initialImages;
          updateAndSaveImagesInLocalStorage(initialImages);
        }
      }, [numberOfFrames, size1]);

    return (
        <div className="UserAdmin">
            <Header
                showCheckout={numberOfFrames > 0}
                convertHtmlToImg={convertHtmlToImg}
            />
            <section className="h-100">
                <div className="frame-main h-100">
                    <div id="mainFrameScrollContainer" className="h-100">
                        {numberOfFrames > 0 && (
                            <BottomSelector
                                onPlusClick={() => {
                                    ref.current.click();
                                }}
                                value={value}
                                setValue={setValue}
                                size1={size1}
                                setSize1={setSize1}
                                updateRange={(rangeValue) => {
                                    if (div3Ref.current && div3Ref.current.length > 0) {
                                      const updatedImages = [...gloableImages];
                                      if (selectedFrame > -1 && imgRef.current[selectedFrame] && gloableImages[selectedFrame].imageLoaded) {
                                        const containerWidth = div3Ref.current[selectedFrame].offsetWidth;
                                        const containerHeight = div3Ref.current[selectedFrame].offsetHeight;
                                        const imageWidth = imgRef.current[selectedFrame].naturalWidth;
                                        const imageHeight = imgRef.current[selectedFrame].naturalHeight;
                                
                                        const scaleToFit = Math.min(containerWidth / imageWidth, containerHeight / imageHeight);
                                        const maxZoomScale = 2;
                                        const minZoomScale = 0.5; // Adjust this to control the minimum zoom-out level
                                
                                        // Calculate new scale based on rangeValue
                                        let newScale = scaleToFit + (rangeValue / 100) * (maxZoomScale - minZoomScale);
                                
                                        // Center the image within the container
                                        const translateX = (containerWidth - imageWidth * newScale) / 2;
                                        const translateY = (containerHeight - imageHeight * newScale) / 2;
                                
                                        const value = `translate(${translateX}px, ${translateY}px) scale(${newScale})`;
                                        div3Ref.current[selectedFrame].style.transform = value;
                                
                                        updatedImages[selectedFrame] = {
                                          ...updatedImages[selectedFrame],
                                          scale: value,
                                          scaleValue: rangeValue,
                                        };
                                      } else { // Apply to all images if no frame is selected
                                            for (let item in div3Ref.current) {
                                                const [, translateX, translateY] = updatedImages[item].scale.match(/translate\((-?\d+)px,\s*(-?\d+)px\)/) || ['translate(0px, 0px)', 0, 0];

                                                const newScale = 1 + rangeValue / 10;
                                                const value = `translate(${translateX}px, ${translateY}px) scale(${newScale})`;

                                                div3Ref.current[item].style.transform = value;
                                                updatedImages[item] = {
                                                    ...updatedImages[item],
                                                    scale: value,
                                                    scaleValue: rangeValue,
                                                };
                                            }
                                        }
                                        setImages(updatedImages);
                                        gloableImages = updatedImages;
                                        updateAndSaveImagesInLocalStorage(gloableImages);
                                    }
                                }}
                                updateMat={(mat) => {
                                    console.log('div3Ref', div3Ref);
                                    if (div3Ref.current && div3Ref.current.length > 0) {
                                        const updatedImages = [...gloableImages];
                                        if (selectedFrame > -1) {
                                            const splitt = updatedImages[selectedFrame].div3Class.split(" ");
                                            div3Ref.current[selectedFrame].className = `${mat} ${splitt[1]}`;

                                            updatedImages[selectedFrame] = {
                                                ...updatedImages[selectedFrame],
                                                div3Class: `${mat} ${splitt[1]}`,
                                            };
                                        } else {
                                            for (let item in div3Ref.current) {
                                                const splitt = updatedImages[item].div3Class.split(" ");
                                                div3Ref.current[item].className = `${mat} ${splitt[1]}`;

                                                updatedImages[item] = {
                                                    ...updatedImages[item],
                                                    div3Class: `${mat} ${splitt[1]}`,
                                                };
                                            }
                                        }
                                        setImages(updatedImages);
                                        gloableImages = updatedImages;
                                        updateAndSaveImagesInLocalStorage(gloableImages);
                                    }
                                }}

                                updateEffect={(effect) => {
                                    console.log("updateEffect called from BottomSelector:", effect);
                                    // console.log('div3Ref filter', div3Ref.current);
                                    if (div3Ref.current && div3Ref.current.length > 0) {
                                        const updatedImages = [...gloableImages];
                                        console.log("updatedImages bs", updatedImages);
                                        if (selectedFrame > -1) {
                                            const splitt = updatedImages[selectedFrame].div3Class.split(" ");
                                            div3Ref.current[selectedFrame].className = `${splitt[0]} ${effect}`;
                                            console.log("Effect state updated from updateeffect func:", effect);

                                            updatedImages[selectedFrame] = {
                                                ...updatedImages[selectedFrame],
                                                div3Class: `${splitt[0]} ${effect}`,
                                            };
                                        } else {
                                            for (let item in div3Ref.current) {
                                                const splitt = updatedImages[item].div3Class.split(" ");
                                                div3Ref.current[item].className = `${splitt[0]} ${effect}`;
                                                console.log("Effect state updated from updateeffect func:", effect);

                                                updatedImages[item] = {
                                                    ...updatedImages[item],
                                                    div3Class: `${splitt[0]} ${effect}`,
                                                };
                                            }
                                        }
                                        setImages(updatedImages);
                                        gloableImages = updatedImages;
                                        updateAndSaveImagesInLocalStorage(gloableImages);
                                    }
                                }}
                                updateDiv={(frameClass, subFrame, text) => {
                                    const updatedImages = [...gloableImages];
                                    if (selectedFrame > -1) {
                                        div1Ref.current[selectedFrame].className = frameClass;
                                        div2Ref.current[selectedFrame].className = subFrame;

                                        updatedImages[selectedFrame] = {
                                            ...updatedImages[selectedFrame],
                                            div1Class: frameClass,
                                            div2Class: subFrame,
                                        };
                                    } else {
                                        if (div1Ref.current && div1Ref.current.length > 0) {
                                            for (let item in div1Ref.current) {
                                                div1Ref.current[item].className = frameClass;
                                                div2Ref.current[item].className = subFrame;

                                                updatedImages[item] = {
                                                    ...updatedImages[item],
                                                    div1Class: frameClass,
                                                    div2Class: subFrame,
                                                };
                                            }
                                        }
                                    }
                                    setImages(updatedImages);
                                    gloableImages = updatedImages;
                                    updateAndSaveImagesInLocalStorage(gloableImages);
                                }}
                                updateText={(text) => {
                                    console.log(selectedFrame);
                                    const updatedImages = [...gloableImages];
                                    if (selectedFrame > -1) {
                                        divTextRef.current[selectedFrame].innerText = text;
                                        updatedImages[selectedFrame] = {
                                            ...updatedImages[selectedFrame],
                                            text: text,
                                        };
                                    } else {
                                        if (div1Ref.current && div1Ref.current.length > 0) {
                                            for (let item in div1Ref.current) {
                                                divTextRef.current[item].innerText = text;

                                                updatedImages[item] = {
                                                    ...updatedImages[item],
                                                    text: text,
                                                };
                                            }
                                        }
                                    }
                                    if (text === "") {
                                        setCross(false);
                                    } else {
                                        setCross(true);
                                    }
                                    setImages(updatedImages);
                                    gloableImages = updatedImages;
                                    updateAndSaveImagesInLocalStorage(gloableImages);
                                }}
                                cross={cross}
                                setCross={setCross}
                                selectedFrame={selectedFrame}
                            />
                        )}
                        {numberOfFrames < 0 ? (
                            createButton()
                        ) : (
                            console.log("Mapping images:", images),
                            images.map((item, index) => {
                                return (
                                    <FrameContainer
                                        item={item}
                                        index={index}
                                        key={Math.random().toString()}
                                        selectedFrame={selectedFrame}
                                        onSelectedFrame={(indexS) => {
                                            setImages(gloableImages);
                                            setSelectedFrame(indexS);
                                            updateAndSaveImagesInLocalStorage(gloableImages);
                                        }}
                                        deleteText={() => {
                                            debugger;
                                            const tempData = gloableImages.map((item, subIndex) => {
                                                const tempData = { ...item };
                                                if (subIndex === index) {
                                                    tempData["text"] = "";
                                                }
                                                return tempData;
                                            });
                                            setImages(tempData);
                                            setValue("");
                                            gloableImages = tempData;
                                            updateAndSaveImagesInLocalStorage(gloableImages);
                                        }}
                                        onDelete={async (index) => {
                                            const tempData = gloableImages.filter((item, subIndex) => {
                                                return subIndex !== index;
                                            });
                                            setImages(tempData);
                                            await handleUnlinkFile(gloableImages?.[index]?.url);
                                            gloableImages?.[index]?.frameUrl &&
                                                (await handleUnlinkFile(gloableImages?.[index]?.frameUrl));
                                            gloableImages?.[index]?.original_image &&
                                                (await handleUnlinkFile(gloableImages?.[index]?.original_image));
                                            gloableImages = tempData;
                                            updateAndSaveImagesInLocalStorage(gloableImages);
                                        }}
                                        onDeleteSticker={(index, subItem, sticketIndex) => {
                                            debugger;
                                            const tempData = gloableImages.map((item, subIndex) => {
                                                const tempData = { ...item };
                                                if (subIndex === index) {
                                                    console.log(tempData.sticker[sticketIndex]);
                                                    const removedSticker = tempData.sticker[sticketIndex];

                                                    const tempStickers = tempData.sticker.filter(
                                                        (stickerItem, index) => {
                                                            return index !== sticketIndex;
                                                        }
                                                    );
                                                    tempData.sticker = tempStickers;
                                                }
                                                return tempData;
                                            });
                                            setImages(tempData);
                                            gloableImages = tempData;
                                            updateAndSaveImagesInLocalStorage(gloableImages);
                                        }}
                                        onSizePass={(index, data, sticketIndex) => {
                                            const tempData = gloableImages.map((item, subIndex) => {
                                                const tempData = { ...item };
                                                if (subIndex === index) {
                                                    tempData.sticker[sticketIndex].size1 = data;
                                                }
                                                return tempData;
                                            });
                                            gloableImages = tempData;
                                            updateAndSaveImagesInLocalStorage(gloableImages);
                                        }}
                                        onPosition={(index, data, sticketIndex) => {
                                            const tempData = gloableImages.map((item, subIndex) => {
                                                const tempData = { ...item };
                                                if (subIndex === index) {
                                                    tempData.sticker[sticketIndex].position = data;
                                                }
                                                return tempData;
                                            });
                                            gloableImages = tempData;
                                            updateAndSaveImagesInLocalStorage(gloableImages);
                                        }}
                                        onTextPosition={(index, data) => {
                                            const tempData = gloableImages[index];
                                            tempData.textPosition = data;
                                            gloableImages[index] = tempData;
                                            updateAndSaveImagesInLocalStorage(gloableImages);
                                        }}
                                        cross={cross}
                                        ref={fileInputRef}
                                        setCross={setCross}
                                        div1Ref={div1Ref}
                                        div2Ref={div2Ref}
                                        divTextRef={divTextRef}
                                        div3Ref={div3Ref}
                                        divMainRef={divMainRef}
                                    />
                                );
                            }))}
                    </div>
                </div>
                <input
                    ref={fileInputRef}
                    accept="image/*"
                    capture={false}
                    onChange={handleFileChange}
                    type="file"
                    id="actual-btn"
                    multiple
                    hidden
                />
            </section>
        </div>
    );
};
var frameClassGloable;
var subFrameGloable;
var rangeValueGloable = "1";
var effectGloable, frameSizeGloable;
export const BottomSelector = ({
    onPlusClick,
    updateImageData,
    updateEffect,
    updateDiv,
    selectedFrame,
    updateText,
    updateMat,
    value,
    setValue,
    updateRange,
    size1,
    setSize1,
    onSizeButtonClick
}) => {
    const { width } = useWindowDimensions();
    const [type, setType] = useState("");
    const [frame, setFrame] = useState(-1);
    const [effect, setEffect] = useState(-1);
    const [mat, setMat] = useState(-1);
    const [sticker, setSticker] = useState(null);
    const [text, setText] = useState(-1);
    const [rangeValue, setRangeValue] = useState(-1);
    const marginRight = { marginRight: 30 };
    const imageSize = 22;

    const [frameSizes, setFrameSizes] = useState([]);

    useEffect(() => {
        // Fetch frame sizes from the backend
        const fetchFrameSizes = async () => {
            try {
                const response = await axios.get('http://localhost:8000/getAllFrames');
                setFrameSizes(response.data.map(frame => frame.size));
            } catch (error) {
                console.error('Error fetching frame sizes:', error);
                // Handle the error appropriately (e.g., display an error message)
            }
        };

        fetchFrameSizes();
    }, []);

    useEffect(() => {
        if (type === "crop" && selectedFrame > -1) {
            console.log(selectedFrame)
            console.log('globalImages', gloableImages)
            setRangeValue(gloableImages[selectedFrame].scaleValue);
        }
    }, [type, selectedFrame]);

    useEffect(() => {
        if (selectedFrame == -1) {
            rangeValueGloable = rangeValue;
        }
    }, [selectedFrame, rangeValue]);

    useEffect(() => {
        if (sticker) {
            updateImageData(sticker);
        }
    }, [sticker]);

    useEffect(() => {
        effectGloable = effect;
        updateEffect(effectGloable);
        console.log("Effect changed in BottomSelector:", effect);
    }, [effect]);

    useEffect(() => {
        if (frame != -1) {
            frameClassGloable = frame === 0 ? "frame-one" : frame === 1 ? "frame-two" : "frame-three";
            subFrameGloable = frame == 1 ? "sub-frame-inner sub-frame" : frame === 2 ? "sub-frame-inner sub-frame-wood" : "sub-frame-inner";
            updateDiv(frameClassGloable, subFrameGloable);
        }
    }, [frame]);

    useEffect(() => {
        if (text != -1) {
            updateText(text);
        }
    }, [text]);

    useEffect(() => {
        if (rangeValue != -1) {
            updateRange(rangeValue);
        }
    }, [rangeValue]);

    useEffect(() => {
        if (effect != -1) {
            effectGloable = effect;
            updateEffect(effectGloable);
        }
    }, [effect]);

    useEffect(() => {
        if (mat != -1) {
            frameSizeGloable = mat === 0 ? "frame-image-large" : mat === 1 ? "frame-image-medium" : "frame-image-small";
            updateMat(frameSizeGloable);
        }
    }, [mat]);

    const stickerListRef = useRef(null);

    const handleMouseWheel = (e) => {
        const delta = e.deltaY || e.detail || e.wheelDelta;

        if (stickerListRef.current) {
            stickerListRef.current.scrollLeft += delta;
        }
    };

    const handleChangeSize = (size) => {
        setType("size");
        setSize1(size);
        console.log(size1);
    };

    if (type === "frame") {
        return (
            <div className="ToolBox Frame">
                <div
                    className={`toolContent ${frame === 0 ? "activeEffect" : ""}`}
                    onClick={() => setFrame(0)}
                >
                    <img src={BlackFrameIcon} width={60} height={60} alt="FrameIcon" />
                    <span>Black</span>
                </div>
                <div
                    className={`toolContent ${frame === 1 ? "activeEffect" : ""}`}
                    onClick={() => setFrame(1)}
                >
                    <img src={WhiteFrameIcon} width={60} height={60} alt="EffectIcon" />
                    <span>White</span>
                </div>
                <div
                    className={`toolContent ${frame === 2 ? "activeEffect" : ""}`}
                    onClick={() => setFrame(2)}
                >
                    <img src={FrameLessIcon} width={60} height={60} alt="MatIcon" />
                    <span>Wood</span>
                </div>
                <div onClick={() => setType("")} className="goback_cta">
                    Go Back
                </div>
            </div>
        );
    }

    if (type === "size") {
        return (
            <div className="ToolBox Frame">
                {frameSizes.map((sizeOption, index) => (
                    <div
                        key={sizeOption}
                        className={`toolContent ${size1 === sizeOption ? "activeEffect" : ""}`}
                        onClick={() => { setSize1(sizeOption); handleChangeSize(sizeOption); }}
                    >
                        <img src={index === 0 ? BlackFrameIcon : (index === 1 ? WhiteFrameIcon : FrameLessIcon)} width={60} height={60} alt="FrameIcon" />
                        <span>{sizeOption}</span>
                    </div>
                ))}
                <div onClick={() => setType("")} className="goback_cta">
                    Go Back
                </div>
            </div>
        );
    }

    else if (type === "effect") {
        return (
            <div className="ToolBox Effect">
                <div
                    className={`toolContent ${effect === "" ? "activeEffect" : ""}`}
                    onClick={() => setEffect("")}
                >
                    <img src={SamplePicIcon} width={60} height={60} alt="FrameIcon" />
                    <span style={{
                        color: effect === '' ? '#f09c01' : 'black'
                    }}>Normal</span>
                </div>
                <div
                    className={`toolContent ${effect === "filter-willow" ? "activeEffect" : ""}`}
                    onClick={() => {

                        setEffect("filter-willow");
                        updateEffect("filter-willow");
                        console.log(gloableImages); // Log the gloableImages state
                        console.log("Effect state updated:", effect); // Log the effect state
                        console.log("EffectGloable state updated:", effectGloable); // Log the effectGloable state
                        console.log(gloableImages); // Log the gloableImages state

                    }}
                >
                    <img
                        src={SamplePicIcon}
                        width={60}
                        height={60}
                        alt="EffectIcon"
                        className="filter-willow"
                    />
                    <span style={{
                        color: effect === 'filter-willow' ? '#f09c01' : 'black'
                    }}>Willow</span>
                </div>
                <div
                    className={`toolContent ${effect === "filter-inkwell" ? "activeEffect" : ""}`}
                    onClick={() => { setEffect("filter-inkwell"); console.log(gloableImages); console.log(effect) }}
                >
                    <img
                        src={SamplePicIcon}
                        width={60}
                        height={60}
                        alt="EffectIcon"
                        className="filter-inkwell"
                    />
                    <span style={{
                        color: effect === 'filter-inkwell' ? '#f09c01' : 'black'
                    }}>Inkwell</span>
                </div>
                <div
                    className={`toolContent ${effect === "filter-aden" ? "activeEffect" : ""}`}
                    onClick={() => { setEffect("filter-aden"); console.log(gloableImages); console.log(effect) }}
                >
                    <img
                        src={SamplePicIcon}
                        width={60}
                        height={60}
                        alt="MatIcon"
                        className="filter-aden"
                    />
                    <span style={{
                        color: effect === 'filter-aden' ? '#f09c01' : 'black'
                    }}>Aden</span>
                </div>
                <div
                    className={`toolContent ${effect === "filter-dogpatch" ? "activeEffect" : ""}`}
                    onClick={() => { setEffect("filter-dogpatch"); console.log(gloableImages); console.log(effect) }}
                >
                    <img
                        src={SamplePicIcon}
                        width={60}
                        height={60}
                        alt="MatIcon"
                        className="filter-dogpatch"
                    />
                    <span style={{
                        color: effect === 'filter-dogpatch' ? '#f09c01' : 'black'
                    }}>Dogpatch</span>
                </div>
                <div
                    className={`toolContent ${effect === "filter-earlybird" ? "activeEffect" : ""}`}
                    onClick={() => { setEffect("filter-earlybird"); console.log(gloableImages); console.log(effect) }}
                >
                    <img
                        src={SamplePicIcon}
                        width={60}
                        height={60}
                        alt="MatIcon"
                        className="filter-earlybird"
                    />
                    <span style={{
                        color: effect === 'filter-earlybird' ? '#f09c01' : 'black'
                    }}>Earlybird</span>
                </div>
                <div onClick={() => setType("")} className="goback_cta">
                    Go Back
                </div>
            </div>
        );
    } else if (type === "mat") {
        return (
            <div className="ToolBox Mat">
                <div
                    className={`toolContent ${mat === 0 ? "activeEffect" : ""}`}
                    onClick={() => setMat(0)}
                >
                    <img src={SamplePicIcon} width={60} height={60} alt="FrameIcon" />
                </div>
                <div
                    className={`toolContent ${mat === 1 ? "activeEffect" : ""}`}
                    onClick={() => setMat(1)}
                >
                    <img
                        src={SamplePicIcon}
                        width={60}
                        height={60}
                        alt="EffectIcon"
                        className="p-2"
                    />
                </div>
                <div
                    className={`toolContent ${mat === 2 ? "activeEffect" : ""}`}
                    onClick={() => setMat(2)}
                >
                    <img
                        src={SamplePicIcon}
                        width={60}
                        height={60}
                        alt="MatIcon"
                        className="p-3"
                    />
                </div>
                <div onClick={() => setType("")} className="goback_cta">
                    Go Back
                </div>
            </div>
        );
    } else if (type === "sticker") {
        return (
            <div className="ToolBox Sticker justify-content-start">
                <div
                    className="stickerList"
                    onWheel={handleMouseWheel}
                    ref={stickerListRef}
                >
                    <Stickers setSticker={setSticker} />
                </div>
                <div
                    onClick={() => {
                        setText(value);
                        setType("");
                    }}
                    className="goback_cta"
                >
                    Go Back
                </div>
            </div>
        );
    } else if (type === "text") {
        return (
            <div className="ToolBox Text">
                <div className="toolContent">
                    <input
                        type="text"
                        className="form-control"
                        onChange={(e) => {
                            setValue(e.target.value);
                        }}
                        value={value}
                        placeholder="Write your message here..."
                    />
                </div>
                <div className="toolContent">
                    <button
                        onClick={() => {
                            setText(value);
                            setType("");
                        }}
                        className="btn btn-orange"
                    >
                        Update
                    </button>
                </div>
                <div onClick={() => { setType('') }} className="goback_cta">
                    Go Back
                </div>
            </div>
        );
    } else if (type === "crop") {
        return (
            <div className="ToolBox Crop">
                <div className="toolContent">
                    <input
                        type="range"
                        min="-5"
                        max="100"
                        className="slider"
                        id="myRange"
                        onChange={(e) => {
                            setRangeValue(e.target.value);
                        }}
                        value={rangeValue}
                    ></input>
                </div>
                <div
                    onClick={() => {
                        setText(value);
                        setType("");
                        setCropping(false);
                    }}
                    className="goback_cta"
                >
                    Go Back
                </div>
            </div>
        );
    }
    return (
        <div className="ToolBox">
            <div className="toolContent" onClick={() => setType("frame")}>
                <img src={FrameIcon} alt="FrameIcon" />
                <span>Frames</span>
            </div>
            <div className="toolContent" onClick={() => setType("size")}>
                <img src={FrameIcon} alt="FrameIcon" />
                <span>Size</span>
            </div>
            <div className="toolContent" onClick={() => {
                setType("effect");
            }}>
                <img src={EffectIcon} alt="EffectIcon" />
                <span>Effects</span>
            </div>
            <div className="toolContent" onClick={() => {
                setType("sticker");
            }}>
                <img src={StickercIcon} alt="EffectIcon" />
                <span>Stickers</span>
            </div>
            <div className="toolContent" onClick={() => setType("mat")}>
                <img src={MatIcon} alt="MatIcon" />
                <span>Mat</span>
            </div>
            <div
                className="toolContent"
                onClick={() => {
                    setType("crop");
                    setCropping(true);
                }}
            >
                <img src={CropIcon} alt="CropIcon" />
                <span>Crop</span>
            </div>
            <div className="toolContent" onClick={() => setType("text")}>
                <img src={TextIcon} alt="MatIcon" />
                <span>Add Text</span>
            </div>
            {/* <div className="toolContent zoom-in-out-box" onClick={() => onPlusClick()}>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="#ff5814"
        viewBox="0 0 512 512"
    >
        <path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
    </svg>
    <span style={{ color: "#ff5814" }}>Add Frame</span>
</div> */}
        </div>
    );
};

export const FrameContainer = React.forwardRef((props, ref) => {
    const {
        item,
        index,
        onDelete,
        onDeleteSticker,
        div1Ref,
        div2Ref,
        divTextRef,
        div3Ref,
        onSizePass,
        onPosition,
        onTextPosition,
        selectedFrame,
        onSelectedFrame,
        divMainRef,
        deleteText,
        cross,
        setCross,
        imgRef
    } = props;
    const warnRef = useRef();

    const { size, numberOfFrames } = useParams();
    const frameDimensions = {
        width: `${item.width}px`,
        height: `${item.height}px`,
        justifyContent: "center",
        alignItems: "center",
    };

    const handleAddImageClick = () => {
        ref.current.click();
    };

    return (
        <div
            className={`FrameContainer ${selectedFrame == index ? "SelectedFrame" : ""}`}
        >
            <div
                className="ImageContainer"
                ref={(temp) => {
                    divMainRef.current[index] = temp;
                }}
                style={{
                    padding: item.isShowBoundry ? 0 : 10,
                    ...frameDimensions,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div
                    ref={(temp) => {
                        div1Ref.current[index] = temp;
                    }}
                    className={item.div1Class}
                >
                    <div
                        className={item.div2Class}
                        ref={(temp) => {
                            div2Ref.current[index] = temp;
                        }}
                    >
                        <div
                            className={item.div3Class}
                            style={{
                                overflow: "hidden",
                                position: "relative",
                            }}
                            ref={(reff) => {
                                div3Ref.current[index] = reff;
                            }}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {item.localUrl ? (
                                    <DragableImage
                                        item={item}
                                        ref={(el) => (imgRef.current[index] = el?.current?.imgRef?.current)}
                                        ref2={ref}
                                        warnRef={warnRef}
                                        index={index}
                                        onTransform={(value) => {
                                            gloableImages[index].scale = value;
                                        }}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="addImagePlaceholder"
                                        onClick={handleAddImageClick}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Add Image
                                    </div>
                                )}
                            </div>
                        </div>
                        {(
                            <div style={{ position: "absolute" }}>
                                <TextDraggable
                                    item={item}
                                    index={index}
                                    divTextRef={divTextRef}
                                    onTextPosition={onTextPosition}
                                    deleteText={deleteText}
                                    setCross={setCross}
                                    cross={cross}
                                />
                            </div>
                        )}

                        {item.sticker.length > 0 &&
                            item.sticker.map((subItem, sticketIndex) => {
                                return (
                                    <ResizeableContainer
                                        key={Math.random().toString()}
                                        onDelete={() => {
                                            onDeleteSticker(index, subItem, sticketIndex);
                                        }}
                                        onSizePass={(size) => {
                                            onSizePass(index, size, sticketIndex);
                                        }}
                                        onPosition={(position) => {
                                            onPosition(index, position, sticketIndex);
                                        }}
                                        sizePass={subItem.size}
                                        position={subItem.position}
                                        div2Ref={div2Ref}
                                        index={index}
                                        isShowBoundry={item.isShowBoundry}

                                    >
                                        <img
                                            src={subItem.img}
                                            alt="sticker"
                                            draggable="false"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                            }}
                                        />
                                    </ResizeableContainer>
                                );
                            })}
                    </div>
                </div>
            </div>
            <div className="frameMessage">
                <span className="frameImageError" ref={warnRef}>{""}</span>
                <div>
                    <span
                        onClick={() => {
                            if (selectedFrame == index) {
                                onSelectedFrame(-1);
                            } else onSelectedFrame(index);
                        }}
                        className={
                            selectedFrame == index ? "badge badge-success" : "badge badge-secondary"
                        }
                    >
                        {selectedFrame == index ? "Selected" : "Select"}
                    </span>
                    <span onClick={() => onDelete(index)} className="badge badge-danger">
                        {"Delete"}
                    </span>
                </div>
            </div>
        </div>
    );
});

export default Frames;