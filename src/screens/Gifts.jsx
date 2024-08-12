import Header from "../components/header";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGiftListAction } from "../redux/actions/auth";

const Gifts = () => {
    const dispatch = useDispatch();
    const giftListData = useSelector(state => state.userReducer.giftListData);
    console.log(giftListData)
    useEffect(() => {
        window.scrollTo(0, 0)
        console.log('useeffect')
        dispatch(getGiftListAction())
    }, [])
    return (
        <>
            <Header />
            <div id="mainFrameScrollContainer">
                <h2 className="mb-4">All Gifts</h2>
                <div className="container-fluid">
                    <div className="row">
                        {giftListData && giftListData?.length > 0 && giftListData.map((item) => {
                            return <div className="col-sm-6 col-lg-4 col-xl-3" key={item?._id}>
                                <div className="giftCard">
                                    <div className="img">
                                        <div>{item?.email}</div>
                                    </div>
                                    <div className="content position-relative">
                                        <div className="position-relative d-flex justify-content-between px-3 pb-2" style={{ zIndex: 1 }} >
                                            <div><span>Value</span>&#8377;{item?.offer?.discount}</div>
                                            <div><span>Code</span> {item?.code}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })}
                        {/* <div className="col-sm-6 col-lg-4 col-xl-3">
                            <div className="giftCard">
                                <div className="img">
                                    <div>abc@gmail.com</div>
                                </div>
                                <div className="content position-relative">
                                    <div className="position-relative d-flex justify-content-between px-3 pb-2" style={{ zIndex: 1 }} >
                                        <div><span>Value</span>&#8377;2100</div>
                                        <div><span>Code</span> ASD45687ASD</div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Gifts;
