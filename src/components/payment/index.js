import { useEffect, useState } from 'react';
import Logo from '../../assets/images/iconn.png';
import authAxios from '../../redux/axios';
import { useDispatch, useSelector } from 'react-redux';
import { buyGidtCardAction, initPaymentAction, paymentGidtCardAction } from '../../redux/actions/auth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { loaderAction } from '../../redux/actions/global';
import { stripePromise } from '../../utils/globleFunc';
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
const Payment = () => {
    const header = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const initPayment = useSelector(state => state.userReducer.initPayment)
    const initGiftCardPayment = useSelector(state => state.userReducer.initGiftCardPayment)
    const [data, setData] = useState(null)

    useEffect(() => {
        if (initPayment) {
            buyFrames(initPayment)
        }
    }, [initPayment])

    useEffect(() => {
        if (initGiftCardPayment) {
            buyGiftCard(initGiftCardPayment)
        }
    }, [initGiftCardPayment])

    async function buyFrames(initPayment) {
        try {
            const result = await authAxios.post('user/order/book', initPayment,
                {
                    headers: header,
                });
            if (!result.data.success) {
                alert("Payment initiate error.");
                dispatch(loaderAction(false));
                return;
            }
            if (!result.data.data?.isFree) {
                setData(result.data.data)
            }
            else {
                try {
                    const result2 = await authAxios.post('user/order/status', {
                        "orderId": result.data.data?.id,
                        "status": true,
                        "data": null
                    },
                        {
                            headers: header,
                        });
                    if (result2.data.success) {
                        dispatch(loaderAction(false));
                        toast.success('Order placed successfully.')
                        dispatch(initPaymentAction(null));
                        navigate('/orders')
                    }
                    else {
                        dispatch(loaderAction(false));
                        toast.error(result2.data.message)
                    }

                } catch (error) {
                    dispatch(loaderAction(false));
                    // console.log('##########2', error, error.message);
                }
            }

        } catch (error) {
            alert("Server error. Are you online? " + error?.message);
            dispatch(loaderAction(false));
            return;
        }
    }

    async function buyGiftCard(initGiftCardPayment) {
        try {
            const result = await authAxios.post('user/promo/orderId', initGiftCardPayment,
                {
                    headers: header,
                });
            if (!result) {
                dispatch(loaderAction(false));
                alert("Server error. Are you online?");
                return;
            }

            setData(result.data.data)

        } catch (error) {
            dispatch(loaderAction(false));
            alert("Server error. Are you online? " + error?.message);
            return;
        }
    }

    async function onSubmit(stripe, elements) {
        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        const result = await stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements,
            confirmParams: {
                return_url: window.location.href,
            },
            redirect: "if_required",
        });

        if (result.error) {
            // Show error to your customer (for example, payment details incomplete)
            toast.error(result.error.message)
            // console.log(result);
        } else {
            try {
                if (initPayment) {
                    dispatch(loaderAction(true));
                    const result2 = await authAxios.post('user/order/status', {
                        "orderId": data.id,
                        "status": true,
                        "data": result.paymentIntent
                    },
                        {
                            headers: header,
                        });
                    if (result2.data.success) {
                        dispatch(loaderAction(false));
                        toast.success('Order placed successfully.')
                        dispatch(initPaymentAction(null));
                        setData(null);
                        navigate('/orders')
                    }
                    else {
                        dispatch(loaderAction(false));
                        toast.error(result2.data.message)
                    }
                }
                else {
                    dispatch(loaderAction(true));
                    dispatch(buyGidtCardAction({
                        ...initGiftCardPayment,
                        "data": data
                    }))
                    setData(null);
                }

            } catch (error) {
                dispatch(loaderAction(false));
                // console.log('##########2', error, error.message);
            }

        }

    }
    return data && (
        <div style={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            top: 0,
            zIndex: 9999,
            backgroundColor: '#00000055',
            overflowY: 'auto'
        }}
            onClick={(e) => {
                e.stopPropagation()
            }}>
            <div className="modal-dialog" onClick={(e) => {
                e.stopPropagation()
            }}>
                <div className="modal-content" style={{
                    height: 'auto',
                    padding: 8
                }}>
                    <div className="modal-header" style={{
                        justifyContent: 'center'
                    }}>
                        <h6 className="modal-title" style={{ marginLeft: 0 }}><b>Payment</b></h6>
                        <button type="button" className="close" onClick={(e) => {
                            e.stopPropagation()
                            setData(null);
                            dispatch(initPaymentAction(null));
                            dispatch(paymentGidtCardAction(null));
                            dispatch(loaderAction(false));
                        }}>&times;</button>
                    </div>

                    <div style={{
                        gap: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: 'auto',
                        paddingBottom: 16,
                        paddingTop: 16
                    }}><Elements stripe={stripePromise} options={{
                        clientSecret: data.client_secret,
                    }}>
                            <CardContainer onSubmit={onSubmit} />
                        </Elements>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CardContainer = ({ onSubmit }) => {
    const stripe = useStripe();
    const elements = useElements();
    return (
        <>
            <PaymentElement />
            <div className="row">
                <div className="col-lg-12">
                    <a className="checkout-btn-two" style={{
                        cursor: 'pointer'
                    }} onClick={() => onSubmit(stripe, elements)}>Place Order</a>
                </div>
            </div>
        </>)
}

export default Payment;
