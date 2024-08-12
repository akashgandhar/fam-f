import {  useState } from 'react';
import { appImages } from '../../theme/appImages';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { loaderAction, showLoginAction } from '../../redux/actions/global';
import authAxios from '../../redux/axios';

const GiftCardContainer = () => {
    const dispatch = useDispatch()
    const GiftCardData = useSelector(state => state.userReducer.giftCardData);
    const profile = useSelector(state => state.userReducer.user);
    const [selectedBox, setSelectedBox] = useState(-1);
    const [value, setValue] = useState('');
   
    const onBuyClick = () => {
        const reg = /^\S+@\S+\.\S+$/
        if (!profile) {
            toast.error("Please login first.");
            dispatch(showLoginAction(true));
            return
        }
        else if (!reg.test(value)) {
            toast.error("Please enter valid email address.");
            return
        }
        else if (selectedBox === -1) {
            toast.error("Please select a Square.");
            return
        }
        // dispatch(paymentGidtCardAction({
        //     "email": value,
        //     "id": GiftCardData[selectedBox]._id
        // }))
        dispatch(loaderAction(true));
        buyFramesToPhonePay({ "email": value, "id": GiftCardData[selectedBox]._id })
        setSelectedBox(-1)
        setValue('')
    }
    async function buyFramesToPhonePay(initPayment) {
        const header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        try {
            const result = await authAxios.post('user/promo/orderId', initPayment,
                {
                    headers: header,
                });
            const { data } = result
            if (data.success) {
                const { message } = data
                let urlInfo = message?.data?.instrumentResponse?.redirectInfo;
                if (urlInfo) {
                    dispatch(loaderAction(false));
                    window.location.href = urlInfo?.url;
                }
            }
            else {
                alert("Payment initiate error.");
            }


        } catch (error) {
            alert("Server error. Are you online under? " + error?.message);
            // dispatch(loaderAction(false));
            return;
        }
    }

    return (
        <div className="bg-abs">
            <section id="gift_cards" className="container py-5 my-lg-5">
                <div className="row">
                    <div className="col-12 text-center pb-4">
                        <h5 className="subtitle wow zoomIn"> Gift Card </h5>
                        <h2 className="my-4 py-lg-3 wow fadeInDown">Family Vibes Gift Card</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="formCard">
                            <div className="paddIng wow fadeInRight">
                                <h4>How does it works?</h4>
                                <ol className="mb-0">
                                    <li>Buy the digital gift card</li>
                                    <li>We send it over email to your friend or family member</li>
                                    <li>They can order from Family Vibes website and apply the gift code at checkout!</li>
                                </ol>
                            </div>
                            <hr className="my-0" />
                            <form className="paddIng">
                                <div className="form-group col-lg-9 px-0 wow fadeInDown">
                                    <label htmlFor="email">Who is the gift for: </label>
                                    <input type="email" className="form-control rounded-0" id="email"
                                        placeholder="Email Address" value={value} onChange={(e) => setValue(e.target.value)} />
                                </div>
                                <div className="form-group mb-1  wow fadeInDown">
                                    <label>Select number of tiles
                                        <span>Note: Gift card tiles are always 8”x8”</span>
                                    </label>
                                    <div className="w-100"></div>
                                    {
                                        GiftCardData.sort((a, b) => {
                                            return a.noOfFrames - b.noOfFrames;
                                        }).map((item, index) => {
                                            return (
                                                <div className="form-Checks" key={Math.random().toString()} onClick={() => setSelectedBox(index)}>
                                                    <input type="radio" name="tiles" id={item?.discount} onChange={() => { }} checked={selectedBox === index} />
                                                    <label htmlFor={item?.discount}>{item?.noOfFrames} Squares <span>₹ {item?.discount}</span></label>
                                                </div>
                                            )
                                        })
                                    }

                                </div>
                                <div className="form-group d-flex align-items-center wow fadeInDown">
                                    <img src="/assets/images/check.svg" alt="Checkmark Icon" />
                                    <label htmlFor="shipincluded" className="mb-0 ml-2">Shipping Included </label>
                                </div>
                                <div className="form-group text-lg-left text-center wow  fadeInDown">
                                    <button type='button' className="btn btn-orange rounded-pill" onClick={onBuyClick}> Buy Now </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <img src="/assets/images/form-card.png" alt="Form Card Image" className="img-fluid formCardImg" />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default GiftCardContainer;
