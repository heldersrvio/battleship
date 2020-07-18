import Ship from '../src/Ship';
import Gameboard from '../src/Gameboard';

test('placeShip function is working', () => {
	const gameboard = Gameboard();
	const ship1 = Ship(2);

	gameboard.placeShip(ship1, 12, 13);
	expect(gameboard.getPosition(12)).toEqual({
		ship: ship1,
		index: 0,
		status: 'available',
	});
	expect(gameboard.getPosition(13)).toEqual({
		ship: ship1,
		index: 1,
		status: 'available',
	});
	expect(gameboard.getPosition(2)).toEqual({
		ship: null,
		index: null,
		status: 'available',
	});

	const ship2 = Ship(4);
	gameboard.placeShip(ship2, 12, 42);
	expect(gameboard.getPosition(22)).toEqual({
		ship: null,
		index: null,
		status: 'available',
	});

	gameboard.placeShip(ship2, 22, 42);
	expect(gameboard.getPosition(22)).toEqual({
		ship: null,
		index: null,
		status: 'available',
	});

	gameboard.placeShip(ship2, 32, 62);
	expect(gameboard.getPosition(32)).toEqual({
		ship: ship2,
		index: 0,
		status: 'available',
	});
	expect(gameboard.getPosition(42)).toEqual({
		ship: ship2,
		index: 1,
		status: 'available',
	});
	expect(gameboard.getPosition(52)).toEqual({
		ship: ship2,
		index: 2,
		status: 'available',
	});
	expect(gameboard.getPosition(62)).toEqual({
		ship: ship2,
		index: 3,
		status: 'available',
	});
});

test('receiveAttack function is working', () => {
	const gameboard = Gameboard();
	expect(gameboard.getPosition(30)).toEqual({
		ship: null,
		index: null,
		status: 'available',
	});
	expect(gameboard.receiveAttack(30)).toEqual('missed');
	expect(gameboard.getPosition(30)).toEqual({
		ship: null,
		index: null,
		status: 'missed',
	});

	const ship1 = Ship(3);
	gameboard.placeShip(ship1, 2, 4);
	expect(gameboard.receiveAttack(2)).toEqual('hit');
	expect(gameboard.getPosition(2)).toEqual({
		ship: ship1,
		index: 0,
		status: 'hit',
	});
	expect(gameboard.receiveAttack(2)).toEqual(null);
	expect(gameboard.receiveAttack(3)).toEqual('hit');
	expect(gameboard.receiveAttack(4)).toEqual('hit');
	expect(gameboard.getPosition(5)).toEqual({
		ship: null,
		index: null,
		status: 'unavailable',
	});
});

test('allShipsSunk function is working', () => {
	const gameboard = Gameboard();
	const ship1 = Ship(3);
	const ship2 = Ship(1);
	gameboard.placeShip(ship1, 0, 2);
	gameboard.placeShip(ship2, 4, 4);
	expect(gameboard.allShipsSunk()).toBe(false);

	gameboard.receiveAttack(10);
	gameboard.receiveAttack(0);
	gameboard.receiveAttack(4);
	expect(gameboard.allShipsSunk()).toBe(false);

	gameboard.receiveAttack(1);
	gameboard.receiveAttack(2);
	expect(gameboard.allShipsSunk()).toBe(true);
});
