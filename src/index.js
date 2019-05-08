import { put, call } from 'redux-saga/effects';

function* fetch({
  action, method, start, succes, error
}) {
  try {
    yield put(start());
    const { data } = yield call(method, action);
    yield put(succes(data));
  } catch (err) {
    yield put(error(err));
  }
}

export default fetch;