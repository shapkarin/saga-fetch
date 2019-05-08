Options:
- `action:` Action from dispatched type that specified in yours watcher
- `method:` yours API fetch method, there will be passed an action from watched action type
- `start:` action to be dispatched just before fetching
- `success:` if request was successful dispatch this action with responsed data
- `error:` dispatch an error with an actual error

Example:
```js
import { fork, takeEvery } from 'redux-saga/effects';
import fetch from 'saga-fetch';

import {
    loadSomeInfoStart,
    loadSomeInfoSuccess,
    loadSomeInfoError
} from './actions';
// import { fetchSomeInfo } from 'utils/myAwsomeAPI';

export const fetchSomeInfo = action => {
  console.log(action);
  return axios.get('/some/url')
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
    yield takeEvery('INPUT_CHANGED', getSomeInfo);
}
```