import { redux } from "../../theme/appConstants";

const initialState = {
    user: null,
    homeData: null,
    giftCardData: [],
    addressData: null,
    priceData: null,
    initPayment: null,
    initGiftCardPayment: null,
    orderListData: [],
    giftListData : [],
    isVerified: false,
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case redux.USER_DATA_UPDATE:
            return {
                ...state,
                user: action.payload,
            };
        case redux.GIFT_CARD_DATA_UPDATE:
            return {
                ...state,
                giftCardData: action.payload,
            };
        case redux.WEBSITE_DATA_UPDATE:
            return {
                ...state,
                homeData: action.payload,
            };
        case redux.ADDRESS_DATA_UPDATE:
            return {
                ...state,
                addressData: action.payload,
            };
        case redux.PRICE_DATA_UPDATE:
            return {
                ...state,
                priceData: action.payload,
            };
        case redux.INIT_PAYMENT_DATA_UPDATE:
            return {
                ...state,
                initPayment: action.payload,
            };
        case redux.INIT_GIFTCARD_PAYMENT_DATA_UPDATE:
            return {
                ...state,
                initGiftCardPayment: action.payload,
            };
        case redux.ORDER_LIST_DATA_UPDATE:
            return {
                ...state,
                orderListData: action.payload,
            };
        case redux.GIFT_LIST_DATA_UPDATE: {
            return {
                ...state,
                giftListData: action.payload,
            };
        }
        case redux.IS_VERIFIED:
            return {
                ...state,
                isVerified: action.payload,
            };
        case redux.LOGOUT:
            return {
                ...state,
                user: null,
                homeData: null,
                giftCardData: [],
                giftListData: [],
                addressData: null,
                priceData: null,
                isVerified: false,
                orderListData:[ ]
            };
        default:
            return state;
    }
}