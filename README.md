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

### Example:
```js
import { fork, takeEvery } from 'redux-saga/effects';
import fetch from 'saga-fetch';

import {
    loadSomeInfoStart,
    loadSomeInfoSuccess,
    loadSomeInfoError
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
      error: loadSomeInfoError
  });
}

function* mySaga () {
    yield takeEvery('SOME_ACTION_TYPE', getSomeInfoWorker);
}
```

### It's also cool to use with [redux-saga-routines](https://www.npmjs.com/package/redux-saga-routines):

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
      error: user.failure
  });
}

function* mySaga () {
    yield takeEvery(user.TRIGGER, getUser);
}
```