import { useGoogleLogin } from "@react-oauth/google"
import { appImages } from "../../theme/appImages"
import { useEffect, useState } from "react";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { loaderAction } from "../../redux/actions/global";
import { loginAction, loginWithNumber, VerifyWithNumber } from "../../redux/actions/auth";
import toast from 'react-hot-toast';
// import FacebookLogin from "react-facebook-login";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

const Login = ({ onCancleClick }) => {
    const dispatch = useDispatch()
    const [user, setUser] = useState(null);
    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    })
    const [phoneNumber, setPhoneNumber] = useState('')
    const [otp, setOTP] = useState('')
    const [showOTPField, setShowOTPField] = useState(false)

    const handlePhoneNumberChange = (event) => {
        const value = event.target.value;
        const sanitizedValue = value.replace(/[^0-9]/g, '');
        setPhoneNumber(sanitizedValue);
    }

    const handleSendOTPClick = () => {
        if (phoneNumber.length == 10) {
            dispatch(loaderAction(true))
            const data = {
                "number": phoneNumber
            }
            dispatch(loginWithNumber(data))
            setShowOTPField(true)
        }else{
            toast.error("Please enter valid Phone");
        }
    }
    const verfiyOTP = () => {
        dispatch(loaderAction(true))
        const data = {
            "number": phoneNumber,
            "otp": otp
        }
        dispatch(VerifyWithNumber(data))
    }
    const submitForm = (e) => {
        e.preventDefault();
    }
    useEffect(
        () => {
            if (user) {
                dispatch(loaderAction(true))
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        onCancleClick()

                        const data = {
                            loginType: "google",
                            deviceType: "ios",
                            deviceToken: "token1",
                            data: res.data
                        }

                        dispatch(loginAction(data))

                    })
                    .catch((err) => console.log(err));
            }
        },
        [user]
    );

    const responseFacebook = (response) => {
        const {  email, name, picture, id } = response
        if(!email) {
            alert('This Facebook account does not have an associated email address, making it impossible to proceed!!')
            return
        }
        const res = {
            id,email,name, picture: picture['data']['url']
        }
        const data = {
            loginType: "facebook",
            deviceType: "ios",
            deviceToken: "token1",
            data: res
        }
        dispatch(loginAction(data))   
    }
    const handleLoginFailure = (error) => {
        // console.log("#######2", error)
    }

    return (
        <div className="modal d-block">

            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header pb-0 border-0 justify-content-center">
                        <h5 className="modal-title" id="loginModalLabel"> Log In to your account!
                        </h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onCancleClick}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body px-4 pt-3">
                        <div className="socila_login text-center">
                            <h6 className="mb-0">Login with Google</h6>
                            <div className="d-flex align-content-center justify-content-center">
                                <FacebookLogin
                                    appId={'1056510535347066'}
                                    autoLoad={false}
                                    fields="name, email, picture"
                                    callback={responseFacebook}
                                    render={renderProps => (
                                        <div className="icon facebook" onClick={renderProps.onClick}> <img src="assets/images/facebook-svgrepo-com.svg"
                                            alt="Facebook Icon" height="22" width="22" /> </div>
                                    )}
                                />

                                <div className="icon google" onClick={() => login()}> <img src="assets/images/google-svgrepo-com.svg" alt="Google Icon"
                                    height="22" width="22" /> </div>
                            </div>
                        </div>
                        <p className="text-center pt-2 pb-0 mb-0">Or</p>
                        <form action="#" className="my-4" onSubmit={submitForm}>
                            {!showOTPField ? (
                                <div className="form-group mb-4">
                                    <input type="text" className="form-control" id="phone" placeholder="Login With Phone Number"
                                        maxLength="10" value={phoneNumber} onChange={handlePhoneNumberChange} />
                                </div>
                            ) : (
                                <div className="form-group mb-4">
                                    <input type="text" className="form-control" id="otp" placeholder="Enter OTP" value={otp} onChange={(e) => setOTP(e.target.value)} />
                                </div>
                            )}

                            <div className="form-group text-center">
                                {!showOTPField ? (
                                    <button type="button" className="btn btn-orange rounded-5 sendotopbtn" onClick={() => handleSendOTPClick()}> Send OTP </button>
                                ) : (
                                    <button type="button" className="btn btn-orange rounded-5 confirmbtn" onClick={() => verfiyOTP()}>Confirm</button>
                                )}
                            </div>
                            <div className="form-group text-center d-none">
                                <strong>Not a member?</strong> <a href="#">Sign Up</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    )
}
export default Login
