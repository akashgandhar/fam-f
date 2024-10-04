import axios from 'axios';

export const fetchGiftCards = () => async (dispatch) => {
    try {
        const response = await axios.get('http://89.116.34.234:8000/getAllGiftCards');
        dispatch({
            type: 'FETCH_GIFT_CARDS_SUCCESS',
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: 'FETCH_GIFT_CARDS_FAILURE',
            payload: error.message,
        });
    }
};