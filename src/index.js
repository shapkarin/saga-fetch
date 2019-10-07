import { put, call, retry as retryCall, cancelled } from 'redux-saga/effects';

function* fetch({
  action,
  method,
  start,
  success,
  error,
  fulfill,
  cancel,
  retry
}) {
  if(action === undefined){
    throw new Error('`action` is required');
  }
  if(method === undefined){
    throw new Error('`method` is required');
  }
  if(start === undefined){
    throw new Error('`start` is required');
  }
  if(success === undefined){
    throw new Error('`success` is required');
  }
  if(error === undefined){
    throw new Error('`error` is required');
  }
  const { type, payload } = action;
  try {
    yield put(start(payload));
    let response;
    if(yield retry === undefined){
      response = yield call(method, action);
    } else {
      const { times, delay } = retry;
      response = yield retryCall(times, delay, method, action);
    }
    const data = yield response.data || response.json();
    yield put(success(data));
  } catch (err) {
    yield put(error(err));
  } finally {
    if(yield fulfill !== undefined){
      yield put(fulfill(payload));
    }
    if (yield cancelled()){
      const _cancel = cancel || function(payload){
        return { type: `${type}/CANCELLED`, payload };
      };
      yield put(_cancel(payload));
    }
  }
}

export default fetch;