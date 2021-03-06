## Redux-saga fetch worker.
![npm](https://img.shields.io/npm/v/saga-fetch.svg)
![npm](https://img.shields.io/npm/dm/saga-fetch.svg)
![NPM](https://img.shields.io/npm/l/saga-fetch.svg)

### If you want to [say thank you](https://github.com/shapkarin/extend-saga-routines/blob/master/thanks.md).


### Install with `npm`:

```
npm install saga-fetch
```

### With `yarn`:
```
yarn add saga-fetch
```

### Options.

#### required:
- `action:` Action from dispatched type that specified in yours watcher.
- `method:` Yours API fetch method, has an `action` you specified before. It must return a `window.fetch()` or `axios.get()` promise.
- `start:` Ajax was started. Also will be dispatched with the `payload` from the `action`.
- `success:` If request was successful `saga-fetch` will dispatch this action with responsed data as an argument.
- `error:` Dispatch an error with an actual error.

#### optional:
- `fulfill:` If you pass an action it will be dispatched  anyway at the end of ajax process. Useful to change `loading` state to `false`. When it's despatched it has the same payload as an `action` option.
- `cancel:` This action will be dispatched if worker is cancelled. By default it has type `${action.type}/CANCELLED` and payload same with `action` option. Note: It's not an ajax cancellation. To cancel yours ajax within saga's cancellation you can use axios and implement yours method [like that](https://gist.github.com/shapkarin/5dfb7dd134fca1e51fdcef1fd24a8adf).

### Example:
```js
import { fork, takeEvery } from 'redux-saga/effects';
import fetchWorker from 'saga-fetch';

import {
    searchPagesStart,
    searchPagesSuccess,
    searchPagesError,
    searchPagesFulfill,
} from './actions';

const searchPages = ({ payload: { title } }) => fetch(`/search/pages?title=${title}`)
/*
   or with axios
   const searchPages = ({ payload: { title } }) => axios.get(`/search/pages?title=${title}`)
*/

function* searchPagesWorker(action) {
  yield fork(fetchWorker, {
      action,
      method: searchPages,
      start: searchPagesStart,
      success: searchPagesSuccess,
      error: searchPagesError,
      fulfill: searchPagesFulfill
  });
}

function* searchPagesWatcher() {
    yield takeEvery('SEARCH_PAGE', searchPagesWorker);
}
```

### Example with axios, takeLatest, [redux-saga-routines](https://www.npmjs.com/package/redux-saga-routines) and [redux-actions](http://npmjs.com/package/redux-actions):

```js
// routines.js
import { createRoutine } from 'redux-saga-routines';

export default createRoutine('search/pages');
```

```js
// api.js
import axios, { CancelToken } from 'axios';
import { CANCEL } from 'redux-saga';

export const searchPages = ({ payload: { title } }) => {
  const url = `/search/pages?title=${title}`;
  const source = CancelToken.source();
  const request = axios.get(url, { cancelToken: source.token });
  request[CANCEL] = () => source.cancel();
  return request;
};
```

```js
// saga.js
import { fork, takeLatest, delay } from 'redux-saga/effects';
import fetch from 'saga-fetch';

import { searchPages } from './api';
import search from './routines';

function* searchPagesWorker(action) {
  yield delay(142);
  yield fork(fetch, {
      action,
      method: searchPages,
      start: search.request,
      success: search.success,
      error: search.failure,
      fulfill: search.fulfill
  });
}

export default function* searchPagesWatcher() {
  yield takeLatest(search.TRIGGER, searchPagesWorker);
}
```

```js
// reducers.js
import { handleActions } from 'redux-actions';

import search from './routines';

const initialState = {
  loading: false,
  error: {
    message: '',
    code: 0
  },
  results: [],
};

export default handleActions({
  // you also can use TRIGGER as well
  [search.REQUEST]: state => ({
    ...state,
    loading: true
  }),

  [search.SUCCESS]: (state, { payload: results }) => ({
    ...state,
    results
  }),

  [search.FAILURE]: (state, { payload: error }) => ({
    ...state,
    error
  }),

  [search.FULFILL]: state => ({
    ...state,
    loading: false
  })
},
initialState);
```

#### Note to the last example:
if want need to create a routine with `CANCELLED` state you may use [extend-saga-routines](https://www.npmjs.com/package/extend-saga-routines)
