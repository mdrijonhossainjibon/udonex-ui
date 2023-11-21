import { incrementalOrderBook } from 'api';
import { MarketTrading, NewOrder, NewOrderBook, TradingChart, TradingOrderHistory, TradingTradeHistory } from 'containers';
import { setDocumentTitle } from 'helpers';
import {
	currenciesData,
	depthData,
	depthFetch,
	klineData,
	marketsFetch,
	marketsTickersData,
	orderBookData,
	selectCurrentMarket,
	selectMarkets,
	selectUserLoggedIn,
	setCurrentMarket,
	userData,
	walletsData,
} from 'modules';
import { rangerConnectFetch } from 'modules/public/ranger';
import { selectRanger } from 'modules/public/ranger/selectors';
import * as React from 'react';
import isEqual from 'react-fast-compare';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderToolbar } from './HeaderToolbar';
import { useIntl } from 'react-intl';

// tslint:disable-next-line: no-empty-interface
interface TradingScreenProps {}

const TradingComponent: React.FC<TradingScreenProps> = ({}) => {
	const dispatch = useDispatch();
	const currentMarket = useSelector(selectCurrentMarket);
	const markets = useSelector(selectMarkets);
	const rangerState = useSelector(selectRanger);
	const userLoggedIn = useSelector(selectUserLoggedIn);
	const intl = useIntl();

	React.useEffect(() => {
		dispatch(
			setCurrentMarket({
				id: 'ltcbtc',
				name: 'LTC/BTC',
				base_unit: 'LTC',
				quote_unit: 'BTC',
				min_price: '0.000001',
				max_price: '1',
				min_amount: '0.001',
				amount_precision: 4,
				price_precision: 8,
				state: 'active',
				filters: [],
			}),
		);

		dispatch(
			klineData([
				{
					date: Date.now(), // Set a default date (current timestamp)
					open: 100, // Set a default open price
					high: 120, // Set a default high price
					low: 80, // Set a default low price
					close: 110, // Set a default close price
					volume: 1000, // Set a default volume
				},
				{
					date: Date.now(), // Set a default date (current timestamp)
					open: 100, // Set a default open price
					high: 120, // Set a default high price
					low: 80, // Set a default low price
					close: 110, // Set a default close price
					volume: 1000, // Set a default volume
				},
				{
					date: Date.now(), // Set a default date (current timestamp)
					open: 100, // Set a default open price
					high: 120, // Set a default high price
					low: 80, // Set a default low price
					close: 110, // Set a default close price
					volume: 1000, // Set a default volume
				},
				// Add more default data as needed
			]),
		);

		dispatch(
			orderBookData({
				asks: [
					{
						id: 1,
						side: 'sell',
						ord_type: 'limit',
						price: '0.014',
						avg_price: '0.014',
						state: 'wait',
						market: 'ltcbtc',
						created_at: '2023-01-01T12:00:00Z',
						volume: '10',
						remaining_volume: '5',
						executed_volume: '5',
						trades_count: 2,
					},
					// Add more ask orders as needed
				],
				bids: [
					{
						id: 2,
						side: 'buy',
						ord_type: 'limit',
						price: '0.013',
						avg_price: '0.013',
						state: 'done',
						market: 'ltcbtc',
						created_at: '2023-01-02T14:30:00Z',
						volume: '8',
						remaining_volume: '0',
						executed_volume: '8',
						trades_count: 1,
					},
					// Add more bid orders as needed
				],
				loading: false,
			}),
		);
		dispatch(
			depthData({
				asks: [
					['0.014', '10'],
					['0.015', '8'],
					// Add more ask orders as needed
				],
				bids: [
					['0.013', '5'],
					['0.012', '7'],
					// Add more bid orders as needed
				],
				loading: false,
				timestamp: 1638551234567,
			}),
		);

		dispatch(
			marketsTickersData({
				ltcbtc: {
					amount: '123.45',
					avg_price: '0.012',
					high: '0.015',
					last: '0.014',
					low: '0.01',
					open: 0.013,
					price_change_percent: '10%',
					volume: '500.67',
				},
			}),
		);

		dispatch(
			walletsData([
				{
					total: '100',
					balance: '50',
					currency: 'LTC',
					name: 'Litecoin Wallet',
					type: 'coin',
					fee: 0.01,
					address: 'LTC_ADDRESS_HERE',
					locked: '20',
					explorerTransaction: 'https://blockchair.com/litecoin/transaction/{{txId}}',
					explorerAddress: 'https://blockchair.com/litecoin/address/{{address}}',
					fixed: 8,
					iconUrl: 'https://example.com/ltc-icon.png',
				},
			]),
		);

		dispatch(
			userData({
				user: {
					email: 'example@email.com',
					level: 2,
					otp: true,
					role: 'user',
					state: 'active',
					uid: 'user123',
					profiles: [
						{
							first_name: 'John',
							last_name: 'Doe',
							dob: '1990-01-01',
							address: '123 Main St',
							postcode: '12345',
							city: 'Cityville',
							country: 'USA',
							state: 'CA',
							created_at: '2023-01-01T12:00:00Z',
							updated_at: '2023-01-02T15:30:00Z',
							metadata: 'Additional metadata if any',
						},
					],
					csrf_token: 'random_csrf_token',
					data: 'additional_user_data',
					referal_uid: null,
					labels: [],
					phone: [
						{
							country: 'USA',
							number: '123-456-7890',
							validated_at: '2023-01-03T10:45:00Z',
						},
					],
					created_at: '2023-01-01T08:00:00Z',
					updated_at: '2023-01-04T14:20:00Z',
				},
			}),
		);

		dispatch(
			currenciesData([
				{
					price: 150.25,
					id: 'ltc',
					name: 'Litecoin',
					symbol: 'LTC',
					explorer_transaction: 'https://blockchair.com/litecoin/transaction/{transaction_id}',
					explorer_address: 'https://blockchair.com/litecoin/address/{address}',
					type: 'crypto',
					deposit_fee: '0.001 LTC',
					min_confirmations: 3,
					min_deposit_amount: '0.01 LTC',
					withdraw_fee: '0.005 LTC',
					min_withdraw_amount: '0.1 LTC',
					withdraw_limit_24h: '100 LTC',
					withdraw_limit_72h: '200 LTC',
					deposit_enabled: true,
					withdrawal_enabled: true,
					base_factor: 1e8,
					precision: 8,
					icon_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2.png', // Replace with actual CoinMarketCap icon URL
					blockchain_key: 'litecoin',
				},
				{
					price: 50000,
					id: 'btc',
					name: 'Bitcoin',
					symbol: 'BTC',
					explorer_transaction: 'https://blockchair.com/bitcoin/transaction/{transaction_id}',
					explorer_address: 'https://blockchair.com/bitcoin/address/{address}',
					type: 'crypto',
					deposit_fee: '0.0005 BTC',
					min_confirmations: 6,
					min_deposit_amount: '0.001 BTC',
					withdraw_fee: '0.001 BTC',
					min_withdraw_amount: '0.01 BTC',
					withdraw_limit_24h: '10 BTC',
					withdraw_limit_72h: '20 BTC',
					deposit_enabled: true,
					withdrawal_enabled: true,
					base_factor: 1e8,
					precision: 8,
					icon_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png', // Replace with actual CoinMarketCap icon URL
					blockchain_key: 'bitcoin',
				},
				// Add entries for ETH and SOL with their respective CoinMarketCap icon URLs
			]),
		);
	}, [dispatch]);

	React.useEffect(() => {
		const { connected, withAuth } = rangerState;
		setDocumentTitle(intl.formatMessage({ id: 'page.trading.documentTitle' }));
		if (markets.length < 1) {
			dispatch(marketsFetch());
		}

		if (currentMarket && !incrementalOrderBook()) {
			dispatch(depthFetch(currentMarket));
		}

		if (!connected) {
			dispatch(rangerConnectFetch({ withAuth: userLoggedIn }));
		}

		if (userLoggedIn && !withAuth) {
			dispatch(rangerConnectFetch({ withAuth: userLoggedIn }));
		}
	}, []);

	return (
		<div className="td-pg-trading">
			<div
				className="td-pg-trading--bg td-pg-trading__item td-pg-trading--bg td-pg-trading__header-toolbar"
				style={{
					borderRadius: '5px',
				}}
			>
				<HeaderToolbar />
			</div>
			<div className="td-pg-trading--bg td-pg-trading__item td-pg-trading--bg td-pg-trading__market-trading">
				<MarketTrading />
			</div>
			<div className="td-pg-trading--bg td-pg-trading__item td-pg-trading--bg td-pg-trading__order-book">
				<NewOrderBook />
			</div>
			<div className="td-pg-trading--bg td-pg-trading__item td-pg-trading--bg td-pg-trading__trading-chart">
				<TradingChart hideHeaderContent />
			</div>
			<div className="td-pg-trading--bg td-pg-trading__item td-pg-trading--bg td-pg-trading__order">
				<NewOrder />
			</div>
			<div className="td-pg-trading--bg td-pg-trading__item td-pg-trading--bg td-pg-trading__recent-trade">
				<TradingTradeHistory />
			</div>
			<div className="td-pg-trading--bg td-pg-trading__item td-pg-trading--bg td-pg-trading__order-history">
				<TradingOrderHistory />
			</div>
		</div>
	);
};

export const TradingScreen = React.memo(TradingComponent, isEqual);
