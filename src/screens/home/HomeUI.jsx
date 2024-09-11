
import GiftCardContainer from './GiftCardContainer';
import ReviewSliderContainer from './ReviewSliderContainer';
import VideoContainer from './VideoContainer';
import Footer from '../Footer';
import { useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import YoutubeThumbnail from '../../assets/images/capture.png';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { getImage } from '../../components/fileUploader/getImage';
import { imgUrl } from '../../theme/appConstants';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import { shuffle } from 'lodash';
import { useFrameContext } from '../../context/FrameContext';
import { ProductContext } from '../../context/ProductContext';



const HomeUI = () => {
    let homeData = useSelector(state => state.userReducer.homeData);
    const iframeRef = useRef(null);
    const [offerPop, setofferPop] = useState(false);
    const popupData = homeData?.popup;
    const [frameNumbers, setFrameNumbers] = useState([]);
    const navigate = useNavigate();
    const [framesPreset, setFramesPreset] = useFrameContext();
    const location = useLocation();
    const { selectedProduct, setSelectedProduct } = useContext(ProductContext);

    useEffect(() => {
        // Fetch frame numbers from the backend
        const fetchFrameNumbers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/getAllFrameNumbers');
                setFrameNumbers(response.data);
            } catch (error) {
                console.error('Error fetching frame numbers:', error);
                // Handle the error appropriately (e.g., display an error message)
            }
        };

        fetchFrameNumbers();
    }, []);

    const handleAddToCart = useCallback ( (numberOfFrames) => {
        console.log('numberOfFrames in HomeUI:', numberOfFrames);
        setFramesPreset(numberOfFrames); 
        console.log('framesPreset in HomeUI:', framesPreset); 
        navigate('/frames', { state: { framesPreset: numberOfFrames } }); // Pass framesPreset in state
    });
    
    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 5,
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
        },
    };



    const offerPopHandle = () => {
        setofferPop(false);
    }

    const getThumbnail = (link) => {
        if (link?.startsWith('https://www.youtube.com/embed/') || link?.startsWith('https://youtube.com/embed/')) {
            const videoId = link.split('embed/')[1];
            return `http://img.youtube.com/vi/${videoId}/0.jpg`;
        }
        return YoutubeThumbnail
    }

    


    useEffect(() => {
        setTimeout(() => {
            console.log('homeData?.homepage?.popup', homeData?.homepage?.popup)

            setofferPop(homeData?.homepage?.popup)
        }, 2000)
    }, [])
    useEffect(() => {
        const sizeTheVideo = () => {
            const aspectRatio = 1.78;
            const video = iframeRef.current;
            let videoHeight;
            if (window.screen.width > 1366) {
                videoHeight = 900;
            } else {
                videoHeight = 1500;
            }
            const newWidth = videoHeight * aspectRatio;
            const halfNewWidth = newWidth / 2;
            video.style.width = `${newWidth}px`;
            video.style.left = '50%';
            video.style.marginLeft = `-${halfNewWidth}px`;
        }
        sizeTheVideo();
        sizeTheVideo();
        window.addEventListener("scroll", sizeTheVideo);
        return () => {
            window.removeEventListener("scroll", sizeTheVideo);
        };
    }, []);

    const clickToCopy = (text) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
    const [images, setImages] = useState([])
    const [secondContentImages, setSecondContentImages] = useState([])
    const [sixthContentImages, setsixthContentImages] = useState([])
    const [thirdContentImages, setthirdContentImages] = useState([])
    const [forthContentImages, setforthContentImages] = useState("")
    const [fifthContentImage, setfifthContent] = useState("")
    const [popupImage1, setpopupImage1] = useState("")
    const [popupImage2, setpopupImage2] = useState("")

    useEffect(() => {
        getImages();
    }, [homeData?.homepage?.firstContent?.links]);

    const getImages = async () => {

        const getSectionImages = async (links, setImageFunction) => {
            const sectionImages = await Promise.all(
                links?.map(async (e) => await getImage(e, "home"))
            );
            setImageFunction(sectionImages);
        };

        await getSectionImages(
            homeData?.homepage?.firstContent?.links,
            setImages
        );

        await getSectionImages(
            homeData?.homepage?.secondContent?.links,
            setSecondContentImages
        );

        await getSectionImages(
            homeData?.homepage?.sixthContent?.links,
            setsixthContentImages
        );

        const thirdContent = await getImage(
            homeData?.homepage?.thirdContent?.Image,
            "home"
        );
        setthirdContentImages(thirdContent);

        const forthContent = await getImage(
            homeData?.homepage?.forthContent?.Image,
            "home"
        );
        setforthContentImages(forthContent);

        const fifthContent = await getImage(
            homeData?.homepage?.fifthContent?.Image,
            "home"
        );
        setfifthContent(fifthContent);


        const image1 = await getImage(
            popupData?.image1,
            "offer"
        );
        setpopupImage1(image1);
        const image2 = await getImage(
            popupData?.image2,
            "offer"
        );
        setpopupImage2(image2);

    };
    //handle buy now
    const handleBuyNowClick = async (product) => {
        //navigate to /checkout
        setSelectedProduct(product)
        navigate('/checkout');
    };


    return (
        <>
            {/* Banner */}
            <div className="container-fluid px-0 ">
                <div className="bg-banner bg-fixed-grad">
                    <img src="/assets/images/bg-dots-abs.svg" alt="Dots Background Image" className="bg-dots-abs" />
                    <div className="bg-video container-fluid">
                        <div className="row justify-content-end custom-height rounded px-5 pt-5">
                            <div className="col-lg-5 p-0 text-right">
                                <div id="videoWithJs" className="videoWrapper">
                                    <iframe ref={iframeRef} src="https://www.youtube.com/embed/oQ50d9NbU2U?version=3&amp;playlist=oQ50d9NbU2U&amp;loop=1&amp;controls=0&amp;autoplay=1&amp;mute=1&amp;rel=0" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                                </div>
                                {/* <video src={homeData?.homepage?.firstContent?.video} muted autoPlay loop className="img-fluid"></video> */}
                            </div>
                        </div>
                    </div>

                    <div className="container-lg banner py-lg-5">
                        <div className="row  pb-lg-4 pb-xl-0 ">
                            <div className="col-lg-6">
                                <table>
                                    <tbody>
                                        <tr>
                                            {
                                                images?.map((e, i) => {
                                                    return <>
                                                        {
                                                            i < 3 && <td>
                                                                <div className="squareTile" style={{ backgroundImage: `url(${(e)})` }} ></div>
                                                            </td>

                                                        }
                                                    </>

                                                })
                                            }
                                        </tr>
                                        <tr>

                                            <td colSpan="2" rowSpan="2" className="pb-0">
                                                <div className="squareTile" style={{ backgroundImage: `url(${(images?.[3])})` }} ></div>
                                            </td>
                                            <td>
                                                <div className="squareTile" style={{ backgroundImage: `url(${(images?.[4])})` }} ></div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="pb-0">
                                                <div className="squareTile" style={{ backgroundImage: `url(${(images?.[5])})` }} ></div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className=" pr-lg-5  pt-lg-5 text-center text-lg-center"   >
                        <h1 className="wow fadeInDown pt-lg-5 ">{homeData?.homepage?.firstContent?.title}</h1>
                        <p className="my-4 w-lg-100 pr-lg-5 wow fadeInDown">
                            {homeData?.homepage?.firstContent?.description}
                        </p>
                    </div>
                    <div className='bg-banner bg-fixed-grad d-flex justify-content-center'>
                        <NavLink to={'/frames'} className="btn btn-orange rounded-pill wow fadeInDown my-5  " role='button' id="gt"> Customise </NavLink>
                    </div>
                </div>

            </div>
            {/* Decor */}
            <section id="decor" className="container py-lg-5 py-3">
                <div className="row">
                    <div className="col-lg-8 py-5 text-lg-left text-center" style={{ zIndex: 1 }}>
                        <h5 className="subtitle wow zoomIn"> Let's go </h5>
                        <h2 className="mt-4 pt-lg-3 pb-2 wow fadeInDown pre-wrap">{homeData?.homepage?.secondContent?.title}</h2>
                        <p className='mb-4'>{homeData?.homepage?.secondContent?.description}</p>
                        <NavLink to={'/frames'} className="btn btn-orange rounded-pill wow fadeInDown"> Get Started </NavLink>
                    </div>
                </div>

                <div className="col  wow fadeInUp">
                        <div className="d-flex align-items-center justify-content-end my-4">
                            <NavLink to="/products" className="btn btn-orange rounded-pill">
                                View All Products
                            </NavLink>
                        </div>
                    </div>

                <Carousel responsive={responsive} infinite={true} autoPlay={true} autoPlaySpeed={3000}>
                    {frameNumbers.slice(0, 7).map((item) => (
                        <div key={item._id} className="col mb-4 mb-lg-0 wow fadeInUp">
                            <div className="position-relative card-container">
                                <div className="dec1 d-flex align-items-center justify-content-center">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.type === "frame" ? "Frame Image" : "Product Image"}
                                        className="img-fluid"
                                    />
                                </div>
                                <div className="card-content">
                                    <h4>
                                        {item.type === "frame"
                                            ? `${item.numberOfFrames} Frames`
                                            : item.name}
                                    </h4>
                                    <p className="text-muted mt-2">
                                        {item.description.split(" ").slice(0, 20).join(" ")}
                                        {item.description.split(" ").length > 20 && "..."}
                                    </p>
                                    <div className="d-flex align-items-start mt-3">
                                        <button
                                            onClick={() =>
                                                item.type === "frame"
                                                    ? handleAddToCart(item.numberOfFrames)
                                                    : handleBuyNowClick(item)
                                            }
                                            className="btn btn-orange rounded-pill"
                                        >
                                            {item.type === "frame" ? "Add to Cart" : "Buy Now"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                </Carousel>
            </section>

            {/* How it Works */}
            <section id="process" className="bg-theme pt-lg-3 container-fluid position-relative">
                <img src="/assets/images/bg-dots-abs.svg" alt="Dots Background Image" className="bg-dots-abs" />
                <div className="row" >
                    <div className="col-12 text-center">
                        <h5 className="subtitle wow zoomIn"> Process </h5>
                        <h2 className="pt-lg-3 wow fadeInDown">How it Works</h2>
                    </div>
                    <div className="col-12">
                        <div className="step_box">
                            <svg width="1884" height="404" viewBox="0 0 1884 404" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path className="animated-path"
                                    d="M1860.06 375.121C1867.92 383.782 1875.39 392.686 1882 402C1875.42 392.662 1867.98 383.742 1860.15 375.064C1815.46 326.059 1752.49 281.784 1675.35 273.332C1637.23 269.062 1598.07 274.807 1563.04 287.279C1558.33 288.786 1554.05 290.768 1549.58 292.638C1531.95 300.26 1514.84 308.591 1498.12 317.446C1492.45 320.331 1487.31 323.707 1481.68 326.583C1448.43 344.205 1412.1 358.547 1373.55 366.805C1360.7 369.513 1347.58 371.422 1334.37 372.397C1319.09 374.226 1303.5 374.831 1288.01 374.71C1249.46 374.291 1210.28 368.788 1175.63 354.728C1168.74 351.964 1162.02 348.781 1155.65 345.284C1126.55 329.726 1098.63 312.757 1072.31 294.249C1047.5 277.852 1022.64 261.448 996.157 246.799C992.937 245.091 989.448 243.343 986.088 241.868C981.819 240.071 977.829 237.807 973.65 235.857C965.211 231.893 956.483 228.332 947.564 225.149C918.229 214.546 886.853 207.576 855.178 203.346C851.029 202.863 844.87 202.145 840.701 201.662C835.071 201.05 828.812 200.921 823.113 200.8C815.624 200.623 795.898 200.155 788.179 199.97C785.029 199.881 779.74 199.825 776.601 199.591C735.817 196.384 690.204 189.391 656.199 170.174C625.974 155.397 599.938 135.495 576.081 114.61C571.792 110.775 562.853 102.516 558.774 98.4795L557.714 97.4643L556.734 96.4169L554.715 94.2655C526.069 64.816 484.606 26.3824 441.892 11.2668C400.429 -2.2373 349.876 -2.0117 312.102 18.8085C299.474 25.1738 286.916 35.3906 276.748 44.9949C266.409 54.7282 257.171 65.3881 248.592 76.1446C231.155 97.4401 213.637 118.953 194.09 138.976C189.171 145.124 183.042 150.804 176.823 156.154C150.467 178.328 116.472 194.33 79.8779 202.726C78.7781 203 77.6483 203.201 76.5284 203.443L69.8195 204.837L63.0505 206.005L59.661 206.585C40.354 209.445 20.667 210.606 1.00005 210.058"
                                    stroke="url(#paint0_linear_339_447)" strokeWidth={4} />
                                <defs>
                                    <linearGradient id="paint0_linear_339_447" x1="1.2899" y1="402" x2="1882" y2="401.453"
                                        gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#F8B9C4" />
                                        <stop offset="1" stopColor="#F8B9C4" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="container">
                                <div className="row align-items-center">
                                    <div className="col-md-2 process_img">

                                        <div className="position-relative">
                                            <div className="dec1">
                                                <img src={thirdContentImages} alt="Process image"
                                                    className="img-fluid wow fadeInRight" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-5 col-md process_content wow fadeInDown"
                                        data-wow-delay=".4s">
                                        <h6 className="process_subhead "> {homeData?.homepage?.thirdContent?.title} </h6>
                                        <h3 className="process_head"> {homeData?.homepage?.thirdContent?.heading} </h3>
                                        <p>{homeData?.homepage?.thirdContent?.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="step_box mb-5 op">
                            <svg width="1884" height="404" viewBox="0 0 1884 404" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path className="animated-path delay-2"
                                    d="M23.9366 375.121C16.0778 383.782 8.60898 392.686 2 402C8.57899 392.662 16.0178 383.742 23.8466 375.064C68.5397 326.059 131.51 281.784 208.648 273.332C246.772 269.062 285.926 274.807 320.961 287.279C325.67 288.786 329.949 290.768 334.419 292.638C352.046 300.26 369.163 308.591 385.881 317.446C391.55 320.331 396.689 323.707 402.318 326.583C435.573 344.205 471.898 358.547 510.452 366.805C523.3 369.513 536.418 371.422 549.626 372.397C564.913 374.226 580.501 374.831 595.988 374.71C634.542 374.291 673.716 368.788 708.371 354.728C715.26 351.964 721.979 348.781 728.348 345.284C757.454 329.726 785.369 312.757 811.685 294.249C836.501 277.852 861.357 261.448 887.843 246.799C891.063 245.091 894.552 243.343 897.912 241.868C902.181 240.071 906.171 237.807 910.35 235.857C918.789 231.893 927.517 228.332 936.436 225.149C965.771 214.546 997.147 207.576 1028.82 203.346C1032.97 202.863 1039.13 202.145 1043.3 201.662C1048.93 201.05 1055.19 200.921 1060.89 200.8C1068.38 200.623 1088.1 200.155 1095.82 199.97C1098.97 199.881 1104.26 199.825 1107.4 199.591C1148.18 196.384 1193.8 189.391 1227.8 170.174C1258.03 155.397 1284.06 135.495 1307.92 114.61C1312.21 110.775 1321.15 102.516 1325.23 98.4795L1326.29 97.4643L1327.27 96.4169L1329.29 94.2655C1357.93 64.816 1399.39 26.3824 1442.11 11.2668C1483.57 -2.2373 1534.12 -2.0117 1571.9 18.8085C1584.53 25.1738 1597.08 35.3906 1607.25 44.9949C1617.59 54.7282 1626.83 65.3881 1635.41 76.1446C1652.85 97.4401 1670.36 118.953 1689.91 138.976C1694.83 145.124 1700.96 150.804 1707.18 156.154C1733.53 178.328 1767.53 194.33 1804.12 202.726C1805.22 203 1806.35 203.201 1807.47 203.443L1814.18 204.837L1820.95 206.005L1824.34 206.585C1843.65 209.445 1863.33 210.606 1883 210.058"
                                    stroke="url(#grad-reverse)" strokeWidth="4" />
                                <defs>
                                    <linearGradient id="grad-reverse" x1="1882.71" y1="402" x2="2.00015" y2="401.453"
                                        gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#F8B9C4" />
                                        <stop offset="1" stopColor="#F8B9C4" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>


                            <div className="container">
                                <div className="row align-items-center  justify-content-end">
                                    <div className="col-md-2 process_img offset-lg-1 order-md-last">
                                        <div className="position-relative">
                                            <div className="dec1">
                                                <img src={forthContentImages} alt="Process image"
                                                    className="img-fluid wow fadeInLeft" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-5 col-md process_content wow fadeInDown" data-wow-delay=".4s">
                                        <h6 className="process_subhead mb-lg-4 mb-2"> {homeData?.homepage?.forthContent?.title} </h6>
                                        <h3 className="process_head mb-3"> {homeData?.homepage?.forthContent?.heading}</h3>
                                        <p>{homeData?.homepage?.forthContent?.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="step_box">
                            <svg width="1884" height="404" viewBox="0 0 1884 404" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path className="animated-path delay-3"
                                    d="M1860.06 375.121C1867.92 383.782 1875.39 392.686 1882 402C1875.42 392.662 1867.98 383.742 1860.15 375.064C1815.46 326.059 1752.49 281.784 1675.35 273.332C1637.23 269.062 1598.07 274.807 1563.04 287.279C1558.33 288.786 1554.05 290.768 1549.58 292.638C1531.95 300.26 1514.84 308.591 1498.12 317.446C1492.45 320.331 1487.31 323.707 1481.68 326.583C1448.43 344.205 1412.1 358.547 1373.55 366.805C1360.7 369.513 1347.58 371.422 1334.37 372.397C1319.09 374.226 1303.5 374.831 1288.01 374.71C1249.46 374.291 1210.28 368.788 1175.63 354.728C1168.74 351.964 1162.02 348.781 1155.65 345.284C1126.55 329.726 1098.63 312.757 1072.31 294.249C1047.5 277.852 1022.64 261.448 996.157 246.799C992.937 245.091 989.448 243.343 986.088 241.868C981.819 240.071 977.829 237.807 973.65 235.857C965.211 231.893 956.483 228.332 947.564 225.149C918.229 214.546 886.853 207.576 855.178 203.346C851.029 202.863 844.87 202.145 840.701 201.662C835.071 201.05 828.812 200.921 823.113 200.8C815.624 200.623 795.898 200.155 788.179 199.97C785.029 199.881 779.74 199.825 776.601 199.591C735.817 196.384 690.204 189.391 656.199 170.174C625.974 155.397 599.938 135.495 576.081 114.61C571.792 110.775 562.853 102.516 558.774 98.4795L557.714 97.4643L556.734 96.4169L554.715 94.2655C526.069 64.816 484.606 26.3824 441.892 11.2668C400.429 -2.2373 349.876 -2.0117 312.102 18.8085C299.474 25.1738 286.916 35.3906 276.748 44.9949C266.409 54.7282 257.171 65.3881 248.592 76.1446C231.155 97.4401 213.637 118.953 194.09 138.976C189.171 145.124 183.042 150.804 176.823 156.154C150.467 178.328 116.472 194.33 79.8779 202.726C78.7781 203 77.6483 203.201 76.5284 203.443L69.8195 204.837L63.0505 206.005L59.661 206.585C40.354 209.445 20.667 210.606 1.00005 210.058"
                                    stroke="url(#paint0_linear_339)" strokeWidth="4" />
                                <defs>
                                    <linearGradient id="paint0_linear_339" x1="1.2899" y1="402" x2="1882" y2="401.453"
                                        gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#F8B9C4" />
                                        <stop offset="1" stopColor="#F8B9C4" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="container">
                                <div className="row align-items-center mb-4">
                                    <div className="col-md-2">
                                        <div className="position-relative">
                                            <div className="dec1">
                                                <img src={fifthContentImage} alt="Process image"
                                                    className="img-fluid wow fadeInRight" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-5 col-md process_content ps-lg-5 pe-lg-2 wow fadeInDown"
                                        data-wow-delay=".4s">
                                        <h6 className="process_subhead mb-lg-4 mb-2"> {homeData?.homepage?.fifthContent?.title} </h6>
                                        <h3 className="process_head mb-3"> {homeData?.homepage?.fifthContent?.heading} </h3>
                                        <p>{homeData?.homepage?.fifthContent?.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <GiftCardContainer />
            {/* Frame Detials */}
            <section id="frameDetails" className='bg-footer py-5'>
                <div className="container py-lg-5">
                    <div className="row align-items-center">
                        <div className="col-lg-6 text-center collage">
                            {/* <img src={homeData?.homepage?.secondContent?.links[1]} alt="Decort Image" className="img-fluid" /> */}
                            <div className="row align-items-center">
                                <div className="col-6 px-0 collageCol1">
                                    <img src={sixthContentImages?.[0]} alt="Decort Image" className="img-fluid border-dark" />
                                    <p>8" x 8"</p>
                                    <div className="my-3 seal">
                                        <img src={'/../../assets/images/seal.png'} alt="Decort Image" className="img-fluid border-none" />
                                    </div>
                                </div>
                                <div className="col-6 px-0 collageCol2">
                                    <img src={sixthContentImages?.[1]} alt="Decort Image" className="img-fluid brown-border" />
                                    <p>8" x 8"</p>
                                    <img src={sixthContentImages?.[2]} alt="Decort Image" className="img-fluid border-light" />
                                    <p>8" x 8"</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 text-center text-lg-left">
                            <h2 className='mb-4'>{homeData?.homepage?.sixthContent?.title}</h2>
                            <p className='my-3'>
                                {homeData?.homepage?.sixthContent?.description}
                            </p>
                            <NavLink to='/frames' className={'btn btn-orange rounded-pill mt-3'}>Get Started</NavLink>
                            <div className='row gurantee my-5'>
                                <div className="col-6 col-md-3 my-3 text-center">
                                    <div className="my-3">
                                        <img src={'/../../assets/images/secure.png'} alt="seal Image" />
                                    </div>
                                    <h6>Secured<br></br> Shopping</h6>
                                </div>
                                <div className="col-6 col-md-3 my-3 text-center">
                                    <div className="my-3">
                                        <img src={'/../../assets/images/payment.png'} alt="seal Image" />
                                    </div>
                                    <h6>Secured<br></br> Payment</h6>
                                </div>
                                <div className="col-6 col-md-3 my-3 text-center">
                                    <div className="my-3">
                                        <img src={'/../../assets/images/value.png'} alt="seal Image" />
                                    </div>
                                    <h6>Value <br></br>For Money</h6>
                                </div>
                                <div className="col-6 col-md-3 my-3 text-center">
                                    <div className="my-3">
                                        <img src={'/../../assets/images/shipping.png'} alt="seal Image" />
                                    </div>
                                    <h6>Secured <br></br>Shipping</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ReviewSliderContainer />
            <div className="bg-footer">
                <VideoContainer homeData={homeData} />
                <Footer />
            </div>
            {
                // popupData && Object.keys(popupData).length > 0 &&
                // <div className={offerPop ? 'offerPop' : 'd-none'}>
                //     <div className="container h-100">
                //         <div className="row h-100 justify-content-center align-items-center">
                //             <div className="col-sm-10 col-lg-6 offerPopUp">
                //                 <div className="mt-3 text-right">
                //                     <span className='closebtn' style={{ cursor: 'pointer' }} onClick={offerPopHandle}>
                //                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ height: 30 }}>
                //                             <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                //                         </svg>
                //                     </span>
                //                 </div>
                //                 <div className="row h-100 align-items-center justify-content-center pb-5 pt-4  mx-0">
                //                     <div className="col-12 text-center">
                //                         <img src={`${imgUrl}/offer/${popupData?.image1}`} alt="Decort Image" className="border-light mr-2" />
                //                         <img src={`${imgUrl}/offer/${popupData?.image2}`} alt="Decort Image" className="brown-border" />
                //                         {/* <img src={popupImage2} alt="Decort Image" className="brown-border" /> */}
                //                     </div>
                //                     <div className="col-12 text-center">
                //                         <div className="my-4">
                //                             <h4 className='text-white m-0'>{popupData?.line1}</h4>
                //                             <h2 className='text-white m-0'>{popupData?.line2}</h2>
                //                             <h3 className='text-white'>{popupData?.line3}</h3>
                //                         </div>
                //                         <div id="copyCode" onClick={() => clickToCopy(popupData?.coupon)}> {popupData?.coupon} <span>COPY</span> </div>
                //                     </div>
                //                 </div>
                //             </div>
                //         </div>
                //     </div>
                // </div>
            }


        </>
    );
}

export default HomeUI;