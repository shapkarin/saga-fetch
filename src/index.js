import { put, call, cancelled } from 'redux-saga/effects';

function* fetch({
  action,
  method,
  start,
  success,
  error,
  fulfill,
  cancel
}) {
  try {
    yield put(start());
    const response = yield call(method, action);
    const data = yield response.data || response.json();
    yield put(success(data));
  } catch (err) {
    yield put(error(err));
  } finally {
    const { type, payload } = action;
    if (yield cancelled()){
      const _cancel = cancel || function(payload){
        return { type: `${type}/CANCELED`, payload };
      };
      yield put(_cancel(payload));
    } else if(yield fulfill !== undefined){
      yield put(fulfill(payload))
    }
  }
}

export default fetch;