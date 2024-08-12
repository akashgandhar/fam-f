import { call, put } from "redux-saga/effects";
import { redux } from "../../theme/appConstants";
import {
  BuyGiftCardApi,
  CheckPriceApi,
  GetAddressApi,
  GetGiftCardApi,
  GetOrderListApi,
  GetWebsiteDataApi,
  LoginApi,
  UpdateAddressApi,
  contactUsApi,
  sendOTPApi,
  verifyOTPApi,
  LoginWithPhone,
  VerifyLoginPhone,
  UpdateUserApi,
  DownloadInvoiceSection,
  GetGiftListApi
} from "../axios/apiCall";
import toast from "react-hot-toast";
import { logoutGloble } from "../../utils/globleFunc";

export function* loginWithNumber(action) {
  try {
    yield put({
      type: redux.IS_LOADING,
      payload: true,
    });
    console.log("enter");
    const respose = yield call(LoginWithPhone, action.payload);
    console.log("respose", respose);
    yield put({
      type: redux.IS_LOADING,
      payload: false,
    });
    console.log("respose", respose);
    if (respose.success) {
      toast.success(respose.message);
    } else {
      toast.error(respose.message);
    }
  } catch (e) {
    yield put({
      type: redux.IS_LOADING,
      payload: false,
    });
    console.log("error", JSON.stringify(e));
  }
}

export function* verifyLoginNumber(action) {
  try {
    yield put({
      type: redux.IS_LOADING,
      payload: true,
    });
    const respose = yield call(VerifyLoginPhone, action.payload);
    // console.log('respose',respose)
    yield put({
      type: redux.IS_LOADING,
      payload: false,
    });
    if (respose.success) {
      toast.success(respose.message);
      localStorage.setItem("token", respose?.data?.token);
      yield put({
        type: redux.USER_DATA_UPDATE,
        payload: respose.data,
      });
      yield put({
        type: redux.SHOW_LOGIN,
        payload: false,
      });
      getGiftCard();
    } else {
      toast.error(respose.message);
    }
  } catch (e) {
    yield put({
      type: redux.IS_LOADING,
      payload: false,
    });
    console.log("error", JSON.stringify(e));
  }
}
export function* login(action) {
  try {
    yield put({
      type: redux.IS_LOADING,
      payload: true,
    });
    const respose = yield call(LoginApi, action.payload);
    console.log("=====>", respose);
    yield put({
      type: redux.IS_LOADING,
      payload: false,
    });
    if (respose.success) {
      localStorage.setItem("token", respose?.data?.token);

      yield put({
        type: redux.USER_DATA_UPDATE,
        payload: respose.data,
      });
       yield put({
        type: redux.SHOW_LOGIN,
        payload: false,
      });
      toast.success(respose.message);
      getGiftCard();
    } else {
      toast.error(respose.message);
    }
  } catch (e) {
    yield put({
      type: redux.IS_LOADING,
      payload: false,
    });

    console.log("error", JSON.stringify(e));
  }
}

export function* getGiftCard() {
  try {
    const respose3 = yield call(GetWebsiteDataApi);
    if (respose3.success) {
      yield put({
        type: redux.WEBSITE_DATA_UPDATE,
        payload: respose3.data,
      });
    } else {
      toast.error(respose3.message);
    }

    const respose = yield call(GetGiftCardApi);
    if (respose.success) {
      yield put({
        type: redux.GIFT_CARD_DATA_UPDATE,
        payload: respose.data,
      });
    } else {
      toast.error(respose.message);
    }

    const respose2 = yield call(GetAddressApi);
    if (respose2.success) {
      yield put({
        type: redux.ADDRESS_DATA_UPDATE,
        payload: respose2.data,
      });
    } else {
      toast.error(respose2.message);
    }
  } catch (e) {
    console.log("error", JSON.stringify(e));
  }
}

export function* buyGiftCard(action) {
  try {
    const respose = yield call(BuyGiftCardApi, action.payload);
    yield put({
      type: redux.IS_LOADING,
      payload: false,
    });
    if (respose.success) {
      yield put({
        type: redux.INIT_GIFTCARD_PAYMENT_DATA_UPDATE,
        payload: null,
      });
      toast.success(respose.message);
    } else {
      toast.error(respose.message);
    }
  } catch (e) {
    yield put({
      type: redux.IS_LOADING,
      payload: false,
    });
    if (e?.response?.status === 401 && localStorage.getItem("token")) {
      logoutGloble();
    }
    console.log("error", JSON.stringify(e));
  }
}

export function* updateAddress(action) {
  try {
    const respose = yield call(UpdateAddressApi, action.payload);
    if (respose.success) {
      toast.success(respose.message);
      yield put({
        type: redux.INIT_PAYMENT_DATA_UPDATE,
        payload: action.data,
      });
      getGiftCard();
    } else {
      toast.error(respose.message);
    }
  } catch (e) {
    if (e?.response?.status === 401 && localStorage.getItem("token")) {
      logoutGloble();
    }
    console.log("error", JSON.stringify(e));
  }
}

export function* CheckPrice(action) {
  try {
    yield put({
      type: redux.IS_LOADING,
      payload: true,
    });
    const respose = yield call(CheckPriceApi, action.payload);
    yield put({
      type: redux.IS_LOADING,
      payload: false,
    });
    if (respose.success) {
      yield put({
        type: redux.PRICE_DATA_UPDATE,
        payload: respose.data,
      });
    } else {
      toast.error(respose.message);
    }
  } catch (e) {
    yield put({
      type: redux.IS_LOADING,
      payload: false,
    });
    if (e?.response?.status === 401 && localStorage.getItem("token")) {
      logoutGloble();
    }
    console.log("error", JSON.stringify(e));
  }
}

export function* GetOrderList() {
  try {
    yield put({
      type: redux.IS_LOADING,
      payload: true,
    });
    const respose = yield call(GetOrderListApi);
    yield put({
      type: redux.IS_LOADING,
      payload: false,
    });
    if (respose.success) {
      yield put({
        type: redux.ORDER_LIST_DATA_UPDATE,
        payload: respose.data,
      });
    } else {
      toast.error(respose.message);
    }
  } catch (e) {
    yield put({
      type: redux.IS_LOADING,
      payload: false,
    });
    if (e?.response?.status === 401 && localStorage.getItem("token")) {
      logoutGloble();
    }
    console.log("error", e);
  }
}

export function* GetGiftList() {
  try {
    yield put({
      type: redux.IS_LOADING,
      payload: true,
    });
    const respose = yield call(GetGiftListApi);   
    yield put({
      type: redux.IS_LOADING,
      payload: false,
    });
    if (respose.success) {
      yield put({
        type: redux.GIFT_LIST_DATA_UPDATE,
        payload: respose.data,
      });
    } else {
      toast.error(respose.message);
    }
  } catch (e) {
    yield put({
      type: redux.IS_LOADING,
      payload: false,
    });
    if (e?.response?.status === 401 && localStorage.getItem("token")) {
      logoutGloble();
    }
    console.log("error", e);
  }
}


export function* contactUs(action) {
  try {
    yield put({
      type: redux.IS_LOADING,
      payload: true,
    });
    const respose = yield call(contactUsApi, action.payload);
    yield put({
      type: redux.IS_LOADING,
      payload: false,
    });
    if (respose.success) {
      toast.success(respose.message);
      yield put({
        type: redux.SHOW_CONTACT_US,
        payload: false,
      });
    } else {
      toast.error(respose.message);
    }
  } catch (e) {
    yield put({
      type: redux.IS_LOADING,
      payload: false,
    });
    if (e?.response?.status === 401 && localStorage.getItem("token")) {
      logoutGloble();
    }
    console.log("error", JSON.stringify(e));
  }
}

export function* sendOTP(action) {
  try {
    yield put({
      type: redux.IS_LOADING,
      payload: true,
    });
    const respose = yield call(sendOTPApi, action.payload);
    yield put({
      type: redux.IS_LOADING,
      payload: false,
    });
    if (respose.success) {
      toast.success(respose.message);
      yield put({ type: redux.SHOW_OTP, payload: true });
    } else {
      toast.error(respose.message);
    }
  } catch (e) {
    yield put({
      type: redux.IS_LOADING,
      payload: false,
    });
    if (e?.response?.status === 401 && localStorage.getItem("token")) {
      logoutGloble();
    }
    try {
      toast.error(e.response.data.message);
    } catch (error) {
      console.log("error2", error);
    }
    console.log("error", JSON.stringify(e));
  }
}
export function* verifyOTP(action) {
  try {
    yield put({
      type: redux.IS_LOADING,
      payload: true,
    });
    const respose = yield call(verifyOTPApi, action.payload);
    yield put({
      type: redux.IS_LOADING,
      payload: false,
    });
    if (respose.success) {
      toast.success(respose.message);
      yield put({ type: redux.IS_VERIFIED, payload: true });
      yield put({ type: redux.SHOW_OTP, payload: false });
    } else {
      toast.error(respose.message);
    }
  } catch (e) {
    yield put({
      type: redux.IS_LOADING,
      payload: false,
    });
    if (e?.response?.status === 401 && localStorage.getItem("token")) {
      logoutGloble();
    }
    try {
      toast.error(e.response.data.message);
    } catch (error) {
      console.log("error2", error);
    }
    console.log("error", e);
  }
}
export function* updateUser(action) {
  try {
    yield put({
      type: redux.IS_LOADING,
      payload: true,
    });
    const respose = yield call(UpdateUserApi, action.payload);
    if (respose.success) {
      yield put({
        type: redux.IS_LOADING,
        payload: false,
      });
      yield put({
        type: redux.USER_DATA_UPDATE,
        payload: respose.data,
      });
      console.log(respose);
      toast.success("User detials successfully updated !");
    } else {
      yield put({
        type: redux.IS_LOADING,
        payload: false,
      });
      toast.error("Something went wrong !");
    }
  } catch (err) {
    yield put({
      type: redux.IS_LOADING,
      payload: false,
    });
  }
}
export function* downloadInvoice(action) {
  try {
    yield put({
      type: redux.IS_LOADING,
      payload: true,
    });

    const respose = yield call(DownloadInvoiceSection, action.payload);
    if (respose.success) {
      yield put({
        type: redux.IS_LOADING,
        payload: false,
      });
      toast.success(respose?.message);
    } else {
      yield put({
        type: redux.IS_LOADING,
        payload: false,
      });
      toast.error(respose?.response.data.message,);
    }
  } catch (err) {
    yield put({
      type: redux.IS_LOADING,
      payload: false,
    });
  }
}
