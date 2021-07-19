import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from './middleware/promiseMiddleware.js';
import { combineReducers } from 'redux';
import * as reducers from './reducer/index.js';
// store构造器
export function storeCreator() {
  return createStore(combineReducers({ ... reducers }), applyMiddleware(promiseMiddleware));
}
