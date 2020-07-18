import Ship from './Ship';
import Gameboard from './Gameboard';
import Player from './Player';
import DOM from './DOM';

const GameLoop = (againstComputer, player1Name, player2Name) => {
	const gameboard1 = Gameboard();
	const gameboard2 = Gameboard();

	const player1 = Player(player1Name, false);
	const player2 = Player(player2Name, againstComputer);

	const ship1 = Ship(4, 5, 35);
	const ship2 = Ship(3, 17, 37);
	const ship3 = Ship(1, 9, 9);
	const ship4 = Ship(1, 29, 29);
	const ship5 = Ship(1, 49, 49);
	const ship6 = Ship(2, 54, 64);
	const ship7 = Ship(2, 56, 66);
	const ship8 = Ship(2, 68, 69);
	const ship9 = Ship(1, 85, 85);
	const ship10 = Ship(3, 97, 99);

	const ship11 = Ship(4, 5, 35);
	const ship12 = Ship(3, 17, 37);
	const ship13 = Ship(1, 9, 9);
	const ship14 = Ship(1, 29, 29);
	const ship15 = Ship(1, 49, 49);
	const ship16 = Ship(2, 54, 64);
	const ship17 = Ship(2, 56, 66);
	const ship18 = Ship(2, 68, 69);
	const ship19 = Ship(1, 85, 85);
	const ship20 = Ship(3, 97, 99);

	gameboard1.placeShip(ship1, 5, 35);
	gameboard1.placeShip(ship2, 17, 37);
	gameboard1.placeShip(ship3, 9, 9);
	gameboard1.placeShip(ship4, 29, 29);
	gameboard1.placeShip(ship5, 49, 49);
	gameboard1.placeShip(ship6, 54, 64);
	gameboard1.placeShip(ship7, 56, 66);
	gameboard1.placeShip(ship8, 68, 69);
	gameboard1.placeShip(ship9, 85, 85);
	gameboard1.placeShip(ship10, 97, 99);

	gameboard2.placeShip(ship11, 5, 35);
	gameboard2.placeShip(ship12, 17, 37);
	gameboard2.placeShip(ship13, 9, 9);
	gameboard2.placeShip(ship14, 29, 29);
	gameboard2.placeShip(ship15, 49, 49);
	gameboard2.placeShip(ship16, 54, 64);
	gameboard2.placeShip(ship17, 56, 66);
	gameboard2.placeShip(ship18, 68, 69);
	gameboard2.placeShip(ship19, 85, 85);
	gameboard2.placeShip(ship20, 97, 99);

	DOM.renderTitle();

	DOM.renderBoard('gameboard-two', gameboard2, gameboard1, true, true, () =>
		gameboard1.receiveAttack(player2.randomMove(gameboard1))
	);

	DOM.renderBoard(
		'gameboard-one',
		gameboard1,
		gameboard2,
		false,
		false,
		() => {}
	);
};

export default GameLoop;
