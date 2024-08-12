import { redux } from "../../theme/appConstants";

export const loginWithNumber = (data) => {
  return {
    type: redux.API_LOGIN_PHONE,
    payload: data,
  };
};

export const VerifyWithNumber = (data) => {
  return {
    type: redux.API_VERIFY_PHONE,
    payload: data,
  };
};
export const loginAction = (data) => {
  return {
    type: redux.API_LOGIN_SAGA,
    payload: data,
  };
};

export const getGidtCardAction = () => {
  return {
    type: redux.API_GIFT_CARD_SAGA,
  };
};

export const paymentGidtCardAction = (data) => {
  return {
    type: redux.INIT_GIFTCARD_PAYMENT_DATA_UPDATE,
    payload: data,
  };
};

export const buyGidtCardAction = (data) => {
  return {
    type: redux.API_BUY_GIFT_CARD_SAGA,
    payload: data,
  };
};

export const updateAddressAction = (data, paymentData) => {
  return {
    type: redux.API_UPDATE_ADDRESS_SAGA,
    payload: data,
    data: paymentData,
  };
};
export const checkPriceAction = (data) => {
  return {
    type: redux.API_CHECK_PRICE_SAGA,
    payload: data,
  };
};

export const initPaymentAction = (data) => {
  return {
    type: redux.INIT_PAYMENT_DATA_UPDATE,
    payload: data,
  };
};

export const contactUsAction = (data) => {
  return {
    type: redux.API_CONTACT_US,
    payload: data,
  };
};

export const showOTPAction = (data) => {
  return {
    type: redux.SHOW_OTP,
    payload: data,
  };
};
export const isVerifiedAction = (data) => {
  return {
    type: redux.IS_VERIFIED,
    payload: data,
  };
};

export const sendOTPAction = (data) => {
  return {
    type: redux.API_SEND_OTP,
    payload: data,
  };
};

export const verifyOTPAction = (data) => {
  return {
    type: redux.API_VERIFY_OTP,
    payload: data,
  };
};

export const getOrderListAction = () => {
  return {
    type: redux.API_ORDER_LIST_SAGA,
  };
};

export const getGiftListAction = () => {
  return {
    type: redux.API_GIFT_LIST_SAGA,
  };
};

export const logoutAction = () => {
  return {
    type: redux.LOGOUT,
  };
};
export const UpdateUser = (data) => {
  return {
    type: redux.API_UPDATE_USER,
    payload: data,
  };
};
export const downloadInvoiceSection = (data) => {
  return {
    type: redux.DOWNLOAD_INVOICE_SECTION,
    payload: data,
  };
};
