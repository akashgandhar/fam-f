import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { loaderAction, showLoginAction } from '../../redux/actions/global';
import authAxios from '../../redux/axios';
import { fetchGiftCards } from '../../redux/actions/giftCards';
import axios from 'axios';
import { baseUrl } from '../../theme/appConstants';


const GiftCardContainer = () => {
    const dispatch = useDispatch();
    const profile = useSelector(state => state.userReducer.user);
    const [selectedBox, setSelectedBox] = useState(-1);
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [giftCards, setGiftCards] = useState([]);

    useEffect(() => {
        const fetchGiftCards = async () => {
            console.log(baseUrl)
            try {
                const response = await axios.get('http://localhost:8000/getAllGiftCards');
                setGiftCards(response.data);
            } catch (error) {
                toast.error("Failed to fetch gift cards.");
                console.error("Fetch gift cards error:", error.message);
            }
        };

        fetchGiftCards();
    }, []);

    const onBuyClick = () => {
        const emailRegex = /^\S+@\S+\.\S+$/;
        const mobileRegex = /^\d{10}$/;

        if (!profile) {
            toast.error("Please login first.");
            dispatch(showLoginAction(true));
        } else if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address.");
        } else if (!mobileRegex.test(mobileNumber)) {
            toast.error("Please enter a valid 10-digit mobile number.");
        } else if (selectedBox === -1 || !giftCards || giftCards.length === 0) {
            toast.error("Please select a Square.");
        } else {
            dispatch(loaderAction(true));
            buyFramesToPhonePay({ "email": email, "mobileNumber": mobileNumber, "id": giftCards[selectedBox]._id });
            setSelectedBox(-1);
            setEmail('');
            setMobileNumber('');
        }
    };

    async function buyFramesToPhonePay(initPayment) {
        const header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        try {
            const result = await authAxios.post('user/promo/orderId', initPayment, { headers: header });
            const { data } = result;
            if (data.success) {
                const { message } = data;
                let urlInfo = message?.data?.instrumentResponse?.redirectInfo;
                if (urlInfo) {
                    dispatch(loaderAction(false));
                    window.location.href = urlInfo?.url;
                }
            } else {
                alert("Payment initiate error.");
                dispatch(loaderAction(false));
            }
        } catch (error) {
            alert("Server error. Are you online? " + error?.message);
            console.log(error)
            dispatch(loaderAction(false));
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
                                    <label htmlFor="email">Who is the gift for (Email): </label>
                                    <input type="email" className="form-control rounded-0" id="email"
                                        placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="form-group col-lg-9 px-0 wow fadeInDown">
                                    <label htmlFor="mobileNumber">Recipient's Mobile Number: </label>
                                    <input type="tel" className="form-control rounded-0" id="mobileNumber"
                                        placeholder="Mobile Number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                                </div>
                                <div className="form-group mb-1  wow fadeInDown">
                                    <label>Select number of tiles
                                        <span>Note: Gift card tiles are always 8”x8”</span>
                                    </label>
                                    <div className="w-100"></div>
                                    {giftCards?.length > 0 && giftCards?.sort((a, b) => a.noOfFrames - b.noOfFrames).map((giftCards, index) => (
                                        <div className="form-Checks" key={giftCards._id} onClick={() => setSelectedBox(index)}>
                                            <input type="radio" name="tiles" id={giftCards._id} onChange={() => { }} checked={selectedBox === index} />
                                            <label htmlFor={giftCards._id}>{giftCards.numberOfFrames} Squares <span>₹ {giftCards.price}</span></label>
                                        </div>
                                    ))}
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