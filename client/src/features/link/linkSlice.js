import {createSlice} from '@reduxjs/toolkit';
import axios from 'axios';


export const linkSlice = createSlice({
  name: 'link',
  initialState: {
    done: false,
    processing: false,
    requestId: '',
    homepage: '',
    total: 0,
    crawled: 0,
    remain: 0,
    links: [],
  },
  reducers: {
    clear: (state) => {
      state.processing = false;
      state.requestId = '';
      state.homepage = '';
      state.total = 0;
      state.crawled = 0;
      state.remain = 0;
      state.links = [];
      state.done = false;
    },
    setRequestId: (state, action) => {
      state.requestId = action.payload;
      state.processing = true;
      state.done = false;
      state.total = 0;
      state.remain = 0;
      state.crawled = 0;
      state.links = [];
    },
    update: (state, action) => {
      state.crawled = action.payload.crawled;
      state.links = [{
        link: action.payload.link,
        countWord: action.payload.countWord,
      }].concat(state.links);
      state.remain = action.payload.remain;
      state.total = action.payload.total;
    },
    done: (state, action) => {
      state.processing = false;
      state.remain = 0;
      state.done = true;
      if (action.payload.crawled) {
        state.crawled = action.payload.crawled;
      }
      if (action.payload.total) {
        state.total = action.payload.total;
      }
      if (action.payload.links) {
        state.links = action.payload.links;
      }
    },
  },
});

export const {clear, setRequestId, update, done} = linkSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const createRequest = (request) => async (dispatch) => {
  const config = {
    headers: {'Content-Type': 'application/json'},
  };
  const body = request;

  try {
    const res = await axios.post('/api/wordcount/',
      JSON.stringify(body),
      config);
    dispatch(setRequestId(res.data.requestId));
  } catch (error) {
    console.log(error);
    alert(JSON.stringify(error));
  }
};

export const abortRequest = (requestId) => async (dispatch) => {
  const config = {
    headers: {'Content-Type': 'application/json'},
  };
  const body = {
    requestId,
  };

  try {
    await axios.post('/api/wordcount/abort',
      JSON.stringify(body),
      config);
  } catch (error) {
    console.log(error);
  }
};

export const updateRequestState = (status) => async (dispatch) => {
  dispatch(update(status));
};

export const doneRequest = (requestId) => async (dispatch) => {
  const config = {
    headers: {'Content-Type': 'application/json'},
  };

  try {
    const res = await axios.get('/api/wordcount/' + requestId,
      config);
    const data = res.data;

    try {
      const x = {
        total: data.totalLink,
        crawled: data.totalLink,
        links: data.links.map((en) =>
          ({link: en.url, countWord: en.wordCount}),
        ),
      };
      if (x.links) {
        dispatch(done(x));
      }
    } catch (e) {
      console.error(data);
    }
  } catch (error) {
    console.log(error);
  }
  dispatch(done(status));
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectRequestId = (state) => state.link.requestId;
export const selectRequest = (state) => state.link;
export const selectProcessing = (state) => state.link.processing;

export default linkSlice.reducer;
