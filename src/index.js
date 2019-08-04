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
  if(action === undefined){
    throw new Error('`action` is reqired');
  }
  if(method === undefined){
    throw new Error('`method` is reqired');
  }
  if(start === undefined){
    throw new Error('`start` is reqired');
  }
  if(success === undefined){
    throw new Error('`success` is reqired');
  }
  if(error === undefined){
    throw new Error('`error` is reqired');
  }
  const { type, payload } = action;
  try {
    yield put(start(payload));
    const response = yield call(method, action);
    const data = yield response.data || response.json();
    yield put(success(data));
  } catch (err) {
    yield put(error(err));
  } finally {
    if (yield cancelled()){
      const _cancel = cancel || function(payload){
        return { type: `${type}/CANCELED`, payload };
      };
      yield put(_cancel(payload));
    } else if(yield fulfill !== undefined){
      yield put(fulfill(payload));
    }
  }
}

export default fetch;