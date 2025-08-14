import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './RootReducers'

const store = configureStore({
    reducer: rootReducer,
});

export default store;