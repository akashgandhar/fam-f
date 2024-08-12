import { redux } from "../../theme/appConstants"

export const loaderAction = (data) => {
    return {
        type: redux.IS_LOADING,
        payload: data
    }
}
export const showCheckOutAction = (data) => {
    return {
        type: redux.SHOW_CHECKOUT,
        payload: data
    }
}
export const showLoginAction = (data) => {
    return {
        type: redux.SHOW_LOGIN,
        payload: data
    }
}
export const showFAQAction = (data) => {
    return {
        type: redux.SHOW_FAQ,
        payload: data
    }
}
export const showContactUsAction = (data) => {
    return {
        type: redux.SHOW_CONTACT_US,
        payload: data
    }
}