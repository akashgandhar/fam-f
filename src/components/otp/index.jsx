import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { showOTPAction, verifyOTPAction } from '../../redux/actions/auth';

const OTP = () => {
    const dispatch = useDispatch();
    const showOTP = useSelector(state => state.globalReducer.showOTP)
    const [otpValue, setOTPValue] = useState('');
    const handleInputChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        setOTPValue(value); // Limit to 10 characters
    };
    useEffect(() => {
        if (!showOTP) {
            setOTPValue('');
        }
    }, [showOTP])

    const onVerifyClick = () => {
        if (!otpValue || otpValue.length < 4) {
            toast.error("Please enter a valid OTP.");
            return
        }
        dispatch(verifyOTPAction({
            "otp": otpValue,
        }));
    }

    return showOTP && (
        <div style={{
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
                dispatch(showOTPAction(false))
            }}
        >
            <div className="modal-dialog" onClick={(e) => {
                e.stopPropagation()
            }}>
                <div className="modal-content" ref={(node) => {
                    if (node) {
                        node.style.setProperty("height", "auto", "important");
                    }
                }}>
                    <div className="modal-header" style={{
                        justifyContent: 'center',
                        marginBottom: 16
                    }}>
                        <h6 className="modal-title" style={{ marginLeft: 0 }}><b>Verify OTP</b></h6>
                        <button type="button" className="close" onClick={(e) => {
                            e.stopPropagation()
                            dispatch(showOTPAction(false))
                        }}>&times;</button>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 ">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <label className="checkout-label">Enter OTP</label><br />
                                        <div className='d-flex align-content-stretch'>
                                            <input type="tel" name="otp" placeholder="Enter OTP" className="form-control"
                                                value={otpValue}
                                                onChange={handleInputChange}
                                            />
                                            <div className="verify-btn-two" onClick={onVerifyClick}>Submit</div>
                                        </div>
                                        <br />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OTP