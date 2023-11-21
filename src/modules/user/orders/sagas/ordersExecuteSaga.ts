// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, isFinexEnabled, RequestOptions } from '../../../../api';
import { getCsrfToken, getOrderAPI } from '../../../../helpers';
import { alertPush, depthDataSnapshot } from '../../../index';
import { userOpenOrdersAppend } from '../../openOrders';
import { orderExecuteData, orderExecuteError, OrderExecuteFetch } from '../actions';

const executeOptions = (csrfToken?: string): RequestOptions => {
	return {
		apiVersion: getOrderAPI(),
		headers: { 'X-CSRF-Token': csrfToken },
	};
};

export function* ordersExecuteSaga(action: OrderExecuteFetch) {
	try {
		const { market, side, volume, price, ord_type } = action.payload;

		// Generate random order data
		const getRandomOrder = () => {
			const price = (Math.random() * 0.01 + 0.01).toFixed(3); // Random price between 0.01 and 0.02
			const volume = Math.floor(Math.random() * 10) + 1; // Random volume between 1 and 10
			return [price, volume.toString()];
		};

		// Simulate new random orders
		const newAsks = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, getRandomOrder);
		const newBids = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, getRandomOrder);

		const newSequence = Math.floor(Math.random() * 1000000) + 1; // Random sequence number

		yield put(
			depthDataSnapshot({
				marketId: 'ltcbtc',
				asks: newAsks,
				bids: newBids,
				sequence: newSequence,
				loading: false,
				timestamp: Date.now(),
			}),
		);

		const params = isFinexEnabled()
			? {
					market: market,
					side: side,
					amount: volume,
					price: price,
					type: ord_type,
			  }
			: action.payload;
		const order = yield call(API.post(executeOptions(getCsrfToken())), '/market/orders', params);
		yield put(orderExecuteData());

		if (getOrderAPI() === 'finex') {
			if (order.type !== 'market') {
				yield put(userOpenOrdersAppend(order));
			}
		} else {
			if (order.ord_type !== 'market') {
				yield put(userOpenOrdersAppend(order));
			}
		}

		yield put(alertPush({ message: ['success.order.created'], type: 'success' }));
	} catch (error) {
		yield put(orderExecuteError(error));
		yield put(alertPush({ message: error.message, code: error.code, type: 'error' }));
	}
}
