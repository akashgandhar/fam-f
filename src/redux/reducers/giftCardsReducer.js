const initialState = {
    giftCards: [],
    error: null,
    isLoading: false, // Add isLoading to track loading state
};

const giftCardsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_GIFT_CARDS_REQUEST': // Action dispatched when fetch starts
            return {
                ...state,
                isLoading: true,
                error: null, 
            };
        case 'FETCH_GIFT_CARDS_SUCCESS':
            return {
                ...state,
                giftCards: action.payload,
                isLoading: false,
                error: null,
            };
        case 'FETCH_GIFT_CARDS_FAILURE':
            return {
                ...state,
                error: action.payload,
                isLoading: false,
                giftCards: [], // Clear giftCards on error
            };
        default:
            return state;
    }
};

export default giftCardsReducer;