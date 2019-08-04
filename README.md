## Redux-saga fetch worker.
![npm](https://img.shields.io/npm/v/saga-fetch.svg)
![npm](https://img.shields.io/npm/dt/saga-fetch.svg)
![NPM](https://img.shields.io/npm/l/saga-fetch.svg)

### Install 

```
npm install saga-fetch
```

### Options.

#### required:
- `action:` Action from dispatched type that specified in yours watcher.
- `method:` yours API fetch method, there will be passed an action from watched action type. It's a window.fetch() or axios function.
- `start:` action to be dispatched just before fetching. Will be dispated with `action` you passed before.
- `success:` if request was successful dispatch this action with responsed data.
- `error:` dispatch an error with an actual error

#### optional:
- `fulfill:` action to be dispatched at the end of worker after `success` or `error`. Useful to change `loading` state to `false`. When it's despatched with `saga-fetch` it has the same payload as `action` option.
- `cancel:` this action will be dispatched if worker is cancelled. By default it has type `${action.type}/CANCELED` and payload same with `action` option. Note: It's just an action. To cancel ajax with saga's cancellation your's fetch `method` shuld be [like that](https://gist.github.com/shapkarin/5dfb7dd134fca1e51fdcef1fd24a8adf)

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
  // you also can use REQUEST if you don't need trigger's payload in reducer
  [user.TRIGGER]: state => ({
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