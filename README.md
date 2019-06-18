## Redux-saga fetch worker.

### Install 

```
npm install saga-fetch
```

Options:
- `action:` Action from dispatched type that specified in yours watcher
- `method:` yours API fetch method, there will be passed an action from watched action type. It's a window.fetch() or axios function.
- `start:` action to be dispatched just before fetching
- `success:` if request was successful dispatch this action with responsed data
- `error:` dispatch an error with an actual error
- `fulfill`: action to be dispatched at the end of worker after `success` or `error`. By default it has type `${action.type}/FULFILL`. Useful to change `loading` state to `false`.

### Example:
```js
import { fork, takeEvery } from 'redux-saga/effects';
import fetch from 'saga-fetch';

import {
    loadSomeInfoStart,
    loadSomeInfoSuccess,
    loadSomeInfoError,
    loadSomeFulfill,
} from './actions';

const fetchSomeInfo = action => {
  console.log(action);
  return window.fetch('/some/url')
  // or return axios.get('/some/url')
}

function* getSomeInfoWorker(action){
  yield fork(fetch, {
      action,
      method: fetchSomeInfo,
      start: loadSomeInfoStart,
      success: loadSomeInfoSuccess,
      error: loadSomeInfoError,
      fulfill: loadSomeFulfill
  });
}

function* mySaga () {
    yield takeEvery('SOME_ACTION_TYPE', getSomeInfoWorker);
}
```

### It's also nice to use with [redux-saga-routines](https://www.npmjs.com/package/redux-saga-routines) and [redux-actions](http://npmjs.com/package/redux-actions):

```js
// routines.js
import { createRoutine } from 'redux-saga-routines';

export default createRoutine('user');
```

```js
// api.js
import axios from 'axios';

export const fetchUser = ({ payload: { id } }) => axios.get(`/users/${id}`)
```

```js
// saga.js
import { fork, takeEvery } from 'redux-saga/effects';
import fetch from 'saga-fetch';

import { fetchUser } from './api';
import user from './routines';

function* getUser(action){
  yield fork(fetch, {
      action,
      method: fetchUser,
      start: user.request,
      success: user.success,
      error: user.failure,
      fulfill: user.fulfill
  });
}

function* mySaga () {
    yield takeEvery(user.TRIGGER, getUser);
}
```

```js
// reducers.js
import { handleActions } from 'redux-actions';

import user from './routines';

const initialState = {
  loading: false,
  error: {
    message: '',
    code: 0
  },
  info: {},
};

export default handleActions({
  [user.REQUEST]: state => ({
    ...state,
    loading: true
  }),

  [user.SUCCESS]: (state, { payload: info }) => ({
    ...state,
    info
  }),

  [user.FAILURE]: (state, { payload: error }) => ({
    ...state,
    error
  }),

  [user.FULFILL]: state => ({
    ...state,
    loading: false
  })
},
initialState);

```