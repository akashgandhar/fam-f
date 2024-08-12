
import { googleLogout } from '@react-oauth/google';
import { logoutAction } from '../redux/actions/auth';
import { loadStripe } from '@stripe/stripe-js';

var isCroping = false;
var framesAll = [];
var gloableDispatch = null;

// export const stripePromise = loadStripe('pk_test_51NeZBbSBGM8SXnbgwtVuRAdqKFo0V5RaRTMWfTiGgffhNozMEBDWl3Hww13Rt5NvPff3OaWHKYDOn1BI9Qofb9kb00Tdy37yDI');
export const stripePromise = loadStripe('pk_live_51NeZBbSBGM8SXnbgpguxw1QS2oyeDKrzMTXEztyhWvQRbIPRCuNBPkyDj0Hkp0mpVJuxuusyXaIak9ifIiW17yho00EtTmWyTf');

export const setGloableDispatch = (data) => {
    gloableDispatch = data
}

export const getGloableDispatch = () => gloableDispatch;

export const setCropping = (data) => {
    isCroping = data
}

export const getCropping = () => isCroping;

export const setFramesAll = (data) => {
    framesAll = data
}

export const getFramesAll = () => framesAll;

export const logoutGloble = () => {
    localStorage.clear();
    googleLogout();
    gloableDispatch(logoutAction());
    window.location.reload();
}