import { Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Home from "./screens/home";
import Terms from "./screens/Terms";
import FAQ from "./components/faq";
import MyAccount from "./screens/MyAccount";
import Language from "./components/language";
import ChatBot from "./components/chatBot";
import PromoCode from "./components/promoCode";
import Login from "./components/login";
import PrivacyPolicy from "./screens/Privacy";
import Frames from "./screens/Frames";
import Checkout from "./components/checkout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getGidtCardAction, initPaymentAction, isVerifiedAction, paymentGidtCardAction, showOTPAction } from "./redux/actions/auth";
import { loaderAction, showCheckOutAction, showLoginAction } from "./redux/actions/global";
import Payment from "./components/payment";
import Order from "./screens/Order";
import Loader from "./components/loader";
import { setGloableDispatch } from "./utils/globleFunc";
import Notfound from "./screens/Notfound";
import Thankyou from "./screens/Thankyou";
import Contactus from "./screens/Contactus";
import RefundPolicy from "./screens/Refund";
import ReturnPolicy from "./screens/Return";
import ShippingPolicy from "./screens/Shipping";
import Gifts from "./screens/Gifts";
// import ChooseFileOptions from "./components/chooseFileOptions";

function App() {
  const dispatch = useDispatch();
  const showLogin = useSelector(state => state.globalReducer.showLogin);
  useEffect(() => {
    setGloableDispatch(dispatch);
    dispatch(initPaymentAction(null));
    dispatch(loaderAction(false));
    dispatch(showCheckOutAction(false));
    dispatch(isVerifiedAction(false));
    dispatch(showOTPAction(false))
    dispatch(showLoginAction(false));
    dispatch(paymentGidtCardAction(null))
    dispatch(getGidtCardAction());
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/frames" element={<Frames />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/return" element={<ReturnPolicy />} />
          <Route path="/shipping" element={<ShippingPolicy />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/gifts" element={<Gifts />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/thank-you" element={<Thankyou />} />
        <Route path="/contact-us" element={<Contactus />} />
        <Route path="/*" element={<Notfound />} />
      </Routes>
      <FAQ />
      <Language />
      <ChatBot />
      <PromoCode />
      <Checkout />
      {/* <ChooseFileOptions /> */}
      <Payment />
      <Loader />
      <Toaster />
      {showLogin && <Login onCancleClick={() => dispatch(showLoginAction(false))} />}
    </>
  );
}

export default App;

/* TODO
facebook login  .....client documentation pending
shipping api ....KYC pending from client side
OTP verify ..... SMS pending from client side
image crop movement bug
*/
