import {configureStore} from '@reduxjs/toolkit';
import {createWrapper} from 'next-redux-wrapper';
import linkReducer from './features/link/linkSlice';

const makeStore = () =>
  configureStore({
    reducer: {
      link: linkReducer,
    },
  });

export const wrapper = createWrapper(makeStore);
