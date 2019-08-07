## Redux-saga fetch worker.
![npm](https://img.shields.io/npm/v/saga-fetch.svg)
![npm](https://img.shields.io/npm/dt/saga-fetch.svg)
![NPM](https://img.shields.io/npm/l/saga-fetch.svg)

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
- `method:` Yours API fetch method, there will be passed an action from watched action type. It's a window.fetch() or axios function.
- `start:` Action to be dispatched just before fetching. Will be dispated with `action` you passed before.
- `success:` If request was successful dispatch this action with responsed data.
- `error:` Dispatch an error with an actual error.

#### optional:
- `fulfill:` If you pass an action it will ne anyway dispatched at the end of worker after `success` or `error`. Useful to change `loading` state to `false`. When it's despatched it has the same payload as an `action` option.
- `cancel:` This action will be dispatched if worker is cancelled. By default it has type `${action.type}/CANCELED` and payload same with `action` option. Note: It's not an ajax cancellation. To cancel yours ajax within saga's cancellation you can use axios and implement yours method [like that](https://gist.github.com/shapkarin/5dfb7dd134fca1e51fdcef1fd24a8adf).

### Example:
```js
import { fork, takeEvery } from 'redux-saga/effects';
import fetchWorker from 'saga-fetch';

import {
    SearchPagesStart,
    SearchPagesSuccess,
    SearchPagesError,
    SearchPagesFulfill,
} from './actions';

const searchPages = ({ payload: { title } }) => fetch(`/search/pages?title=${title}`)
/*
   or with axios
   const searchPages = ({ payload: { title } }) => axios.get(`/search/pages?title=${title}`)
*/

function* SearchPagesWorker(action){
  yield fork(fetchWorker, {
      action,
      method: searchPages
      start: SearchPagesStart,
      success: SearchPagesSuccess,
      error: SearchPagesError,
      fulfill: SearchPagesFulfill
  });
}

function* SearchPagesWatcher () {
    yield takeEvery('SEARCH_PAGE', SearchPagesWorker);
}
```

### Example with axios [redux-saga-routines](https://www.npmjs.com/package/redux-saga-routines) and [redux-actions](http://npmjs.com/package/redux-actions) and `takeLatest`:

```js
// routines.js
import { createRoutine } from 'redux-saga-routines';

export default createRoutine('search/pages');
```

```js
// api.js
import axios, { CancelToken } from 'axios';
import { CANCEL } from 'redux-saga';

export const searchPages = ({ payload: { title } }) => axios.get(`/search/pages?title=${title}`);
```

```js
// saga.js
import { fork, takeLatest, delay } from 'redux-saga/effects';
import fetch from 'saga-fetch';

import { searchPages } from './api';
import search from './routines';

function* SearchPagesWorker(action){
  yield delay(142);
  yield fork(fetch, {
      action,
      method: fetchUser,
      start: search.request,
      success: search.success,
      error: search.failure,
      fulfill: search.fulfill
  });
}

export default function* SearchPagesWatcher() {
  yield takeLatest(search.TRIGGER, SearchPagesWorker);
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