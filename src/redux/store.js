import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage';

import rootReducer from './reducers'
import rootSaga from './sagas'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()


const persistConfig = {
    key: 'root',
    storage: storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)


// mount it on the Store
export const store = createStore(
    persistedReducer,
    applyMiddleware(sagaMiddleware)
)

export let persistor = persistStore(store)

// then run the saga
sagaMiddleware.run(rootSaga)

// render the application