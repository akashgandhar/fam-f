import axios from 'axios';

export const fetchGiftCards = () => async (dispatch) => {
    try {
        const response = await axios.get('http://localhost:8000/getAllGiftCards');
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