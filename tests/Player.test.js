import Player from '../src/Player';
import Gameboard from '../src/Gameboard';
import Ship from '../src/Ship';

test('randomMove function is working properly', () => {
	const gameboard = Gameboard();
	const ship1 = Ship(2);
	gameboard.placeShip(ship1, 30, 31);
	const player1 = Player('computer', true);
	const player2 = Player('player', false);

	expect(player2.randomMove(gameboard)).toBeNull();

	const randomMove1 = player1.randomMove(gameboard);
	gameboard.receiveAttack(randomMove1);
	expect(gameboard.getPosition(randomMove1).status).not.toBe('available');

	gameboard.receiveAttack(30);
	const randomMove2 = player1.randomMove(gameboard);
	expect([20, 40, 31]).toContain(randomMove2);
});
