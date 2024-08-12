import Header from "../components/header";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderListAction, downloadInvoiceSection } from "../redux/actions/auth";
import Slider from "react-slick/lib/slider";
import { getImage } from "../components/fileUploader/getImage";

const Order = () => {

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    const dispatch = useDispatch();
    const orderListData = useSelector(state => state.userReducer.orderListData);
    const [viewData, setViewData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [guideVideo, setGuideVideo] = useState(false)
    useEffect(() => {
        window.scrollTo(0, 0)
        dispatch(getOrderListAction())
        const guideFlag = localStorage.getItem("guideFlag")
        if (guideFlag !== "completed") {
            setGuideVideo(true)
        }
    }, [])

    return (
        <>
            <Header />
            {
                guideVideo && <div className="modal_overlay">
                    <div className="modal_content">
                        <div className="iframe">

                            <iframe width="560" height="315" src="https://youtube.com/embed/gJBMrF67d00?si=yNXh3nbeUiR_Xs5e" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>   </div>
                        <div className="text-right">
                            <button className="btn btn-md btn-orange" onClick={() => {
                                setGuideVideo(false);
                                localStorage.setItem("guideFlag", "completed")
                            }} >Skip</button>

                        </div>
                    </div>

                </div>
            }
            <div id="mainFrameScrollContainer">
                <h2 className="mb-4">All Orders</h2>
                <div className="container-fluid">
                    <div className="row">
                        {orderListData.map((item) => {
                            return <div className="col-lg-4 col-md-6" style={{ cursor: 'pointer' }}

                            >
                                <div className="orderBox">
                                    <div className="row mx-0">
                                        <div className="col-12 pt-2">
                                            <h5 style={{ fontWeight: 'bold' }}>Order #{item?.receiptId} <span className="badge badge-warning badge-sm float-right text-white">{item?.status}</span> </h5>
                                        </div>
                                    </div>
                                    <div className="row mx-0 text-center border-top">
                                        <div className="col-6 border-bottom border-right py-2">
                                            <h6 className="text-black-50">Number of Tiles</h6>
                                            <h6 className="text-black mb-0">{item?.cart?.length}</h6>
                                        </div>
                                        <div className="col-6 border-bottom py-2">
                                            <h6 className="text-black-50">Total Cost</h6>
                                            <h6 className="text-black mb-0">{`₹${item?.totalPrice}`}</h6>
                                        </div>
                                        <div className="col-6 border-right py-2">
                                            <h6 className="text-black-50">Invoice</h6>
                                            <span className="badge badge-info badge-sm text-white cursor-pointer" onClick={() => { dispatch(downloadInvoiceSection({ order_id: item?._id })) }}  >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} style={{ height: 18 }} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                </svg>
                                            </span>
                                        </div>
                                        <div className="col-6 py-2">
                                            <h6 className="text-black-50">Frames</h6>
                                            <span className="badge badge-secondary badge-sm text-white cursor-pointer" onClick={(e) => {
                                                e.stopPropagation()
                                                setIsModalVisible(true)
                                                item?.cart?.forEach(async (item) => {
                                                    // let url = getImage
                                                    let url = await getImage(item?.frame, "products")
                                                    setViewData((prev) => [...prev, url])
                                                })
                                            }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} style={{ height: 18 }} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-theme-orange text-white text-center p-2 text-capitalize font-bold"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            window.open(`https://shiprocket.co/tracking/${item?.shiprocket?.awbCode}`, '_blank', 'rel=noopener noreferrer')
                                        }}
                                    >
                                        Track your order
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                    {/* <div className="row sample">
                        <div className="col-lg-4 col-md-6">
                            <div className="orderBox">
                                <div className="row mx-0">
                                    <div className="col-12 pt-2">
                                        <h5 style={{ fontWeight: 'bold' }}>
                                            Order #65SAD4F654 <span className="badge badge-warning badge-sm float-right text-white"> Pending </span>
                                        </h5>
                                    </div>
                                </div>

                                <div className="row mx-0 text-center border-top">
                                    <div className="col-6 border-bottom border-right py-2">
                                        <h6 className="text-black-50">Number of Tiles</h6>
                                        <h6 className="text-black mb-0">2</h6>
                                    </div>
                                    <div className="col-6 py-2 border-bottom">
                                        <h6 className="text-black-50">Total Cost</h6>
                                        <h6 className="text-black mb-0">{`₹${'1050'}`}</h6>
                                    </div>
                                    <div className="col-6 border-right py-2">
                                        <h6 className="text-black-50">Invoice</h6>
                                        <span className="badge badge-info badge-sm text-white cursor-pointer" onClick={() => { dispatch(downloadInvoiceSection({ order_id: '6501dc1d2f06ce0d3a522caf' })) }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} style={{ height: 18 }} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                            </svg>
                                        </span>
                                    </div>
                                    <div className="col-6 py-2">
                                        <h6 className="text-black-50">Frames</h6>
                                        <span className="badge badge-secondary badge-sm text-white cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} style={{ height: 18 }} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-theme-orange text-white text-center p-2 text-capitalize font-bold">
                                    Track your order
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
                {isModalVisible && <div style={{
                    position: 'fixed',
                    width: '100vw',
                    height: '100vh',
                    top: 0,
                    zIndex: 9999,
                    backgroundColor: '#00000055',
                    overflowY: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsModalVisible(false)
                        setViewData([])
                    }}>
                    <div style={{
                        width: 400,
                        height: 400,
                        backgroundColor: 'white'
                    }} onClick={(e) => {
                        e.stopPropagation()
                    }}>
                        <Slider {...settings}>
                            {viewData.map((v, i) => {
                                return (
                                    <img width={400} height={400} src={v} />
                                )
                            })
                            }

                        </Slider>
                    </div>
                </div>}
            </div>
        </>
    );
}

export default Order;
