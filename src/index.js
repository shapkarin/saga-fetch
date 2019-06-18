import { put, call, cancelled } from 'redux-saga/effects';

function* fetch({
  action, method, start, success, error, fulfill
}) {
  try {
    yield put(start());
    const response = yield call(method, action);
    let data;
    // if not it's window.fetch()
    if(yield response.data === undefined){
      data = yield response.json();
    // if it's axios
    } else {
      data = yield response.data;
    }
    yield put(success(data));
  } catch (err) {
    yield put(error(err));
  } finally {
    if (yield cancelled()){
      yield put({ type: `${action.type}/CANCELED`});
    } else {
      const _fulfill = fulfill || function(){
        return { type: `${action.type}/FULFILL` };
      };
      yield put(_fulfill())
    }
  }
}

export default fetch;