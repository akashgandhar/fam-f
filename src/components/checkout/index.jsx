import HomeIcon from '../../assets/images/home-icon.png';
import GiftIcon from '../../assets/images/gift-icn.png';
import { useDispatch, useSelector } from 'react-redux';
import { showCheckOutAction } from '../../redux/actions/global';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { checkPriceAction, sendOTPAction, updateAddressAction } from '../../redux/actions/auth';
import { getFramesAll } from '../../utils/globleFunc';
import OTP from '../otp';
import authAxios from '../../redux/axios';

const Checkout = () => {
    const dispatch = useDispatch();
    const showCheckOut = useSelector(state => state.globalReducer.showCheckOut)
    const addressData = useSelector(state => state.userReducer.addressData);
    const profile = useSelector(state => state.userReducer.user);
    const priceData = useSelector(state => state.userReducer.priceData);
    const isVerified = useSelector(state => state.userReducer.isVerified);
    const [emailValue, setEmailValue] = useState(addressData?.email);
    const [phoneValue, setPhoneValue] = useState(addressData?.phone);
    const [nameValue, setNameValue] = useState(addressData?.name);
    const [lastNameValue, setLastNameValue] = useState(addressData?.lastName);
    const [paymentType, setPaymentType] = useState('');
    const [cityValue, setCityValue] = useState(addressData?.city);
    const [stateValue, setStateValue] = useState(addressData?.state);
    const [pincodeValue, setPincodeValue] = useState(addressData?.pincode);
    const [addressValue, setAddressValue] = useState(addressData?.street);
    const [promoCodeValue, setPromoCodeValue] = useState('');
    const [disable, setDisable] = useState(false)
    console.log('priceData', priceData);
    // console.log('isVerified', addressData);

    // --- Coupoon and Promocode
    const [couponValue, setCouponValue] = useState('');
    useEffect(() => {
        if (showCheckOut) {
            dispatch(checkPriceAction(
                {
                    "promo": promoCodeValue,
                    "products": getFramesAll(),
                    "coupon": couponValue
                }
            ))
        }
        else {
            setPromoCodeValue('');
        }
    }, [showCheckOut, promoCodeValue, couponValue])
    useEffect(() => {
        if (profile?.number !== ""&& profile?.number !== undefined) {

            setPhoneValue(profile?.number)
            setDisable(true)
        }
    }, [profile])
    // ------ Show hhide3 HBuitton fucnitonality
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
        setPromoCodeValue('');
        setCouponValue('')
    };
    const handleInputPhone = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        setPhoneValue(value.substring(0, 10)); // Limit to 10 characters
    };
    const onSubmit = async () => {

        // const reg = /^\S+@\S+\.\S+$/

        // if (!reg.test(emailValue)) {
        //     toast.error("Please enter valid email address.");
        //     return
        // }
        // else if (!phoneValue || phoneValue.length < 10) {
        //     toast.error("Please enter valid phone number.");
        //     return
        // }
        // else if (phoneValue.startsWith("9") === false && phoneValue.startsWith("8") === false && phoneValue.startsWith("7") === false && phoneValue.startsWith("6") === false) {
        //     toast.error("Please enter valid phone number which starts with 9,8,7,6.");
        //     return
        // }
        // else if ((addressData?.phone != phoneValue) && !isVerified && phoneValue !== profile.number) {
        //     toast.error("Please verify your number.");
        //     return
        // }
        // else if (!nameValue || nameValue.length < 2) {
        //     toast.error("Please enter valid first name.");
        //     return
        // }
        // else if (!lastNameValue || lastNameValue.length < 2) {
        //     toast.error("Please enter valid last name.");
        //     return
        // }
        // else if (!stateValue || stateValue.length < 2) {
        //     toast.error("Please enter valid state.");
        //     return
        // }
        // else if (!cityValue || cityValue.length < 2) {
        //     toast.error("Please enter valid city.");
        //     return
        // }
        // else if (!pincodeValue || pincodeValue.length < 6) {
        //     toast.error("Please enter valid pincode.");
        //     return
        // }
        // else if (!addressValue || addressValue.length < 4) {
        //     toast.error("Please enter valid address.");
        //     return
        // }
        // else if (!paymentType) {
        //     toast.error("Please enter payment type.");
        //     return
        // }

        const address = {
            "email": emailValue,
            "name": nameValue,
            "lastName": lastNameValue,
            "street": addressValue,
            "country": "india",
            "phone": phoneValue,
            "city": cityValue,
            "pincode": pincodeValue,
            "state": stateValue
        }
        const paymentData = {
            "promo": promoCodeValue,
            "coupon": couponValue,
            "products": getFramesAll(),
            "address": address,
            "paymentType": paymentType
        }
        const header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }

        try {
            const result = await authAxios.post('https://backend.familyvibes.in/order/book', paymentData,
                {
                    headers: header,
                });
            let { data } = result
            if (data.success) {
              
                    
                localStorage.removeItem('family_vibes_images_data');
                if (data?.data?.isFree) {
                   
                    window.location.href = `https://familyvibes.in/thank-you?type=order&order_id=${data?.data?.id}`
                }
                data = data?.data?.data
                let urlInfo = data?.instrumentResponse?.redirectInfo;
                if (urlInfo) {
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

        // const paymentData = {
        //     "promo": promoCodeValue,
        //     "products": getFramesAll(),
        //     "email": emailValue,
        //     "name": nameValue,
        //     "street": addressValue,
        //     "country": "india",
        //     "phone": phoneValue
        // }

        // dispatch(updateAddressAction({
        //     "email": emailValue,
        //     "name": nameValue,
        //     "lastName": lastNameValue,
        //     "street": addressValue,
        //     "country": "india",
        //     "phone": phoneValue,
        //     "city": cityValue,
        //     "pincode": pincodeValue,
        //     "state": stateValue,
        // }, paymentData));

        dispatch(showCheckOutAction(false));
    }

    const onSendOTPClick = () => {

        if (phoneValue === profile?.number) {
            setDisable(true)
            return
        }
        if (!phoneValue || phoneValue.length < 10) {
            toast.error("Please enter valid phone number.");
            return
        }
        else if (phoneValue.startsWith("9") === false && phoneValue.startsWith("8") === false && phoneValue.startsWith("7") === false && phoneValue.startsWith("6") === false) {
            toast.error("Please enter valid phone number which starts with 9,8,7,6.");
            return
        }
        dispatch(sendOTPAction({
            "phone": phoneValue,
        }));
    }

    const getTileCost = (framePrice = 0) => {
        console.log('framePrice', framePrice);
        return framePrice * getFramesAll()?.length
    }
    return showCheckOut && (
        <div style={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            top: 0,
            zIndex: 999,
            backgroundColor: '#00000055',
            paddingBottom: '100px',
            overflowY: 'scroll'
        }}
        >
            <div className="modal-dialog modal-lg checkoutModal" onClick={(e) => {
                e.stopPropagation()
            }}>
                <div className="modal-content" ref={(node) => {
                    if (node) {
                        node.style.setProperty("height", "auto", "important");
                    }
                }}>
                    <div className="modal-header p-2 px-3 ">
                        <h6 className="modal-title">Checkout</h6>
                        <button type="button" className="close" onClick={(e) => {
                            e.stopPropagation()
                            dispatch(showCheckOutAction(false))
                        }}>&times;</button>
                    </div>
                    <div className="modal-body py-1">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row my-2">
                                        <div className="col-lg-12 d-flex align-items-end p-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ height: '24px', color: '#2D3652' }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                            </svg>
                                            <h5 className='mb-0 ml-2'>Add Address</h5>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12 p-0">
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor='checkoutfirstname'>First name</label>
                                                    <input id='checkoutfirstname' type="text" name="name" placeholder="First name" className="form-control" value={nameValue} onChange={e => setNameValue(e.target.value)} />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor='checkoutlastname'>Last name</label>
                                                    <input id='checkoutlastname' type="text" name="name" placeholder="Last name" className="form-control" value={lastNameValue} onChange={e => setLastNameValue(e.target.value)} />
                                                </div>
                                                <div className="form-group col-12">
                                                    <label htmlFor='checkoutemail'>Email</label>
                                                    <input id='checkoutemail' type="email" name="email" placeholder="Email" className="form-control" value={emailValue} onChange={e => setEmailValue(e.target.value)} />
                                                </div>
                                                <div className="form-group col-12">
                                                    <label htmlFor='chekoutphone'>{'Phone Number'}</label>
                                                    <div id='chekoutphone' className='d-flex'>
                                                        <input type="text" name="countryCode" className="form-control" value={'+91'} style={{ width: 60, marginRight: 8 }} />
                                                        <input type="tel" name="phone" placeholder="Phone Number" className={`form-control ${isVerified ? 'border-success' : ''}`} value={phoneValue} onChange={handleInputPhone} disabled={disable} />
                                                        {isVerified ?
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ height: 36, color: '#28a745' }} className='ml-1'>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                                            </svg>
                                                            :
                                                            <div className="verify-btn-two" onClick={() => {
                                                                disable ? setDisable(false) : onSendOTPClick()
                                                            }}> {disable ? "Edit" : "Verify"}</div>}
                                                    </div>
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor='checkoutcountry'>Country or region</label>
                                                    <select id='checkoutcountry' className="form-control">
                                                        <option value="india">India</option>
                                                    </select>
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor='checkoutstate'>State</label>
                                                    <input id='checkoutstate' type="text" name="name" placeholder="State" className="form-control" value={stateValue} onChange={e => setStateValue(e.target.value)} />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor='checkoutcity'>City</label>
                                                    <input id='checkoutcity' type="text" name="name" placeholder="City" className="form-control" value={cityValue} onChange={e => setCityValue(e.target.value)} />
                                                </div>
                                                <div className="form-group col-md-8">
                                                    <label htmlFor='checkoutAddress'>Address</label>
                                                    <input id='checkoutAddress' type="text" name="address" placeholder="Street address" className="form-control" value={addressValue} onChange={e => setAddressValue(e.target.value)} />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor='checoutpincode'>Pincode</label>
                                                    <input id='checoutpincode' type="text" name="name" placeholder="Pincode" className="form-control" value={pincodeValue} onChange={e => setPincodeValue(e.target.value)} />
                                                </div>
                                                <div className="form-group col-12">
                                                    <label htmlFor='checkoutemail'>Payment Type</label>
                                                    <select className='form-control' onChange={(e) => setPaymentType(e.target.value)}>
                                                        <option value="">Select Payment method</option>
                                                        <option value="online">Pay Online</option>
                                                        {/* <option value="offline">Cash On Delivery</option> */}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12 p-0">
                                    <hr className='my-2' />
                                    <div className="form-group formCard">
                                        <div className="d-flex align-items-center mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ height: 30, color: '#FF5814' }} className='mr-2'>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                            </svg>

                                            <div className="form-Checks">
                                                <input type="radio" name="tiles" id="square8" checked={!isChecked} onChange={handleCheckboxChange} />
                                                <label htmlFor="square8">Coupon Code</label>
                                            </div>
                                            <div className="form-Checks">
                                                <input type="radio" name="tiles" id="square4" checked={isChecked} onChange={handleCheckboxChange} />
                                                <label htmlFor="square4">Gift Card</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className='col-md-7 d-flex align-items-center'>
                                                {isChecked && (
                                                    <input type="text" placeholder="Enter Promo Code" value={promoCodeValue} onChange={e => setPromoCodeValue(e.target.value.toUpperCase())} className={`${priceData?.promo?.discount > 0 ? 'form-control border-success' : 'form-control'} ${promoCodeValue != '' && priceData?.promo == null ? 'border-danger' : ''}`} />
                                                )}
                                                {!isChecked && (
                                                    <input type="text" placeholder="Enter Coupon Code" value={couponValue} onChange={e => setCouponValue(e.target.value.toUpperCase())} className={`${priceData?.coupon > 0 ? 'form-control border-success' : 'form-control'} ${couponValue != '' && priceData?.coupon <= 0 ? 'border-danger' : ''}`} />
                                                )}
                                                {((couponValue != '' || promoCodeValue != '')) ?
                                                    <>
                                                        {(priceData?.coupon > 0 || priceData?.promo?.discount > 0) ?
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ height: 36, color: '#28a745' }} className='ml-1'>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                                            </svg>
                                                            : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ height: 36, color: '#dc3545' }} className='ml-1'>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        }
                                                    </>
                                                    : ''}
                                            </div>
                                            {priceData?.couponErr ?
                                                <div className="col-12">
                                                    <span className="text-danger"> {priceData?.couponErr} </span>
                                                </div>
                                                : ''}
                                        </div>
                                    </div>
                                    <table className='table table-borderless table-compact border priceList'>
                                        <tbody>
                                            <tr>
                                                <td> Tile Cost </td>
                                                <td> {`₹${getTileCost(priceData?.framePrice)}`} </td>
                                            </tr>
                                            <tr>
                                                <td> Shipping </td>
                                                <td> {priceData?.isShippingFree ? 'Free' : `₹${priceData?.shippingCharges}`} </td>
                                            </tr>
                                            <tr>
                                                <td> Sub Total </td>
                                                <td> {`₹` + priceData?.cost} </td>
                                            </tr>
                                            <tr className={priceData?.coupon > 0 || priceData?.promo?.discount > 0 ? 'text-success' : ''}>
                                                <td> Discount Applied </td>
                                                <td> {priceData?.promo ? `-₹${priceData?.promo?.discount}` : (priceData?.coupon ? `-₹${priceData?.coupon} [${priceData?.couponN}]` : '₹0')} </td>
                                            </tr>

                                        </tbody>
                                        <tfoot className='bg-light'>
                                            <tr>
                                                <th>Total ( {priceData?.gst}% GST is included) </th>
                                                <th>{`₹${priceData?.totalCost}`}</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                    <div className="row">
                                        <div className="col-lg-12 mb-4 text-right">
                                            <a className="btn btn-orange btn-md" onClick={onSubmit}>Place Order</a>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <OTP />
        </div>
    )
}

export default Checkout