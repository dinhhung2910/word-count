import {configureStore} from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import linkReducer from '../features/link/linkSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    link: linkReducer,
  },
});
