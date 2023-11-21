import { call, put } from 'redux-saga/effects';
import { API, isFinexEnabled, RequestOptions } from '../../../../api';
import { buildQueryString, getTimestampPeriod } from '../../../../helpers';
import { alertPush } from '../../alert';
import { klineData, KlineFetch } from '../actions';

const klineRequestOptions: RequestOptions = {
	apiVersion: isFinexEnabled() ? 'finex' : 'peatio',
};

export function* handleKlineFetchSaga(action: KlineFetch) {
	try {
		const { market, resolution, from, to } = action.payload;

		const payload = {
			period: resolution,
			time_from: getTimestampPeriod(from, resolution),
			time_to: getTimestampPeriod(to, resolution),
		};

		let endPoint = `/public/markets/${market}/k-line`;

		if (payload) {
			endPoint = `${endPoint}?${buildQueryString(payload)}`;
		}

		const data = yield call(API.get(klineRequestOptions), endPoint);

		const convertedData = data.map(elem => {
			const [date, open, high, low, close, volume] = elem.map(e => {
				switch (typeof e) {
					case 'number':
						return e;
					case 'string':
						return Number.parseFloat(e);
					default:
						throw new Error(`unexpected type ${typeof e}`);
				}
			});

			return {
				date: date * 1e3,
				open,
				high,
				low,
				close,
				volume,
			};
		});
		yield put(klineData(convertedData));
	} catch (error) {
		// Handle the error and set default data for klineData
		console.error('Error in handleKlineFetchSaga:', error);

		// Set default data
		// Set default data
		const defaultData = [
			{
				date: Date.now(), // Set a default date (current timestamp)
				open: 100, // Set a default open price
				high: 120, // Set a default high price
				low: 80, // Set a default low price
				close: 110, // Set a default close price
				volume: 1000, // Set a default volume
			},
			// Add more default data as needed
		];

		yield put(klineData(defaultData));

		// Dispatch an alert with the error message
		yield put(alertPush({ message: error.message, code: error.code, type: 'error' }));
	}
}
