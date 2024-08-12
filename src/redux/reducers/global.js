import { redux } from "../../theme/appConstants";

const initialState = {
    isLoading: false,
    showCheckOut: false,
    showLogin: false,
    showFAQ: false,
    showContactUs: false,
    showOTP: false,
};

export const globalReducer = (state = initialState, action) => {
    switch (action.type) {
        case redux.IS_LOADING:
            return {
                ...state,
                isLoading: action.payload
            };
        case redux.SHOW_CHECKOUT:
            return {
                ...state,
                showCheckOut: action.payload
            };
        case redux.SHOW_LOGIN:
            return {
                ...state,
                showLogin: action.payload
            };
        case redux.SHOW_FAQ:
            return {
                ...state,
                showFAQ: action.payload
            };
        case redux.SHOW_CONTACT_US:
            return {
                ...state,
                showContactUs: action.payload
            };
        case redux.SHOW_OTP:
            return {
                ...state,
                showOTP: action.payload
            };
        default:
            return state;
    }
}