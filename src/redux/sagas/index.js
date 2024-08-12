import { all, takeLatest } from 'redux-saga/effects'
import { redux } from '../../theme/appConstants';
import { CheckPrice,downloadInvoice, GetOrderList,loginWithNumber,verifyLoginNumber, buyGiftCard, contactUs, getGiftCard, login, sendOTP, updateAddress, verifyOTP,updateUser, GetGiftList } from './auth';
function* rootSaga() {
    yield all([
        takeLatest(redux.API_LOGIN_SAGA, login),
        takeLatest(redux.API_GIFT_CARD_SAGA, getGiftCard),
        takeLatest(redux.API_BUY_GIFT_CARD_SAGA, buyGiftCard),
        takeLatest(redux.API_UPDATE_ADDRESS_SAGA, updateAddress),
        takeLatest(redux.API_CHECK_PRICE_SAGA, CheckPrice),
        takeLatest(redux.API_ORDER_LIST_SAGA, GetOrderList),
        takeLatest(redux.API_GIFT_LIST_SAGA, GetGiftList),
        takeLatest(redux.API_CONTACT_US, contactUs),
        takeLatest(redux.API_SEND_OTP, sendOTP),
        takeLatest(redux.API_VERIFY_OTP, verifyOTP),
        takeLatest(redux.API_LOGIN_PHONE, loginWithNumber),
        takeLatest(redux.API_VERIFY_PHONE, verifyLoginNumber),
        takeLatest(redux.API_UPDATE_USER, updateUser),
        takeLatest(redux.DOWNLOAD_INVOICE_SECTION, downloadInvoice),
    ]);
}

export default rootSaga;