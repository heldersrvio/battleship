import Ship from '../src/Ship.js';

test('Hit function is working', () => {
	const ship = Ship(3);
	ship.hit(0);
	expect(ship.getWhereHit()).toEqual([0]);
	ship.hit(2);
	expect(ship.getWhereHit()).toEqual([0, 2]);
	ship.hit(5);
	expect(ship.getWhereHit()).toEqual([0, 2]);
});

test('isSunk function is working', () => {
	const ship = Ship(4);
	ship.hit(3);
	expect(ship.getWhereHit()).toEqual([3]);
	expect(ship.isSunk()).toEqual(false);
	ship.hit(2);
	ship.hit(0);
	ship.hit(1);
	expect(ship.getWhereHit()).toEqual([3, 2, 0, 1]);
	expect(ship.isSunk()).toEqual(true);
});
