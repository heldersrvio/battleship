import Gameboard from './Gameboard';
import Player from './Player';
import Ship from './Ship';

const DOM = ((doc) => {
	const body = doc.querySelector('body');

	const clearBoard = (id) => {
		const container = doc.getElementById('gameboards-container');
		if (doc.getElementById(id) !== null) {
			container.removeChild(doc.getElementById(id));
		}
	};

	const renderTitle = () => {
		const title = doc.createElement('div');
		title.id = 'title';
		const h1 = doc.createElement('h1');
		h1.textContent = 'Battleship';
		title.appendChild(h1);
		body.appendChild(title);
	};

	const renderOptionScreen = () => {
		clearGameOverMessage();
		clearPlayAgainButton();
		clearBoard('gameboard-one');
		clearBoard('gameboard-two');
		const options = doc.createElement('div');
		options.id = 'options';
		const option1 = doc.createElement('button');
		option1.classList.add('option-button');
		option1.textContent = 'Play against the computer';
		option1.addEventListener('click', () => {
			clearOptionScreen();
			renderShipPositioningScreen(true, null, null);
		});
		const option2 = doc.createElement('button');
		option2.classList.add('option-button');
		option2.textContent = 'Play against someone else';
		option2.addEventListener('click', () => {
			clearOptionScreen();
			renderNameInput();
		});
		options.appendChild(option1);
		options.appendChild(option2);
		body.appendChild(options);
	};

	const clearOptionScreen = () => {
		body.removeChild(doc.getElementById('options'));
	};

	const getVicitinityCells = (cellIndex) => {
		let vicitinityCells = [];
		[
			cellIndex - 11,
			cellIndex - 10,
			cellIndex - 9,
			cellIndex - 1,
			cellIndex + 1,
			cellIndex + 9,
			cellIndex + 10,
			cellIndex + 11,
		].forEach((index) => {
			if (index >= 0 && index < 100) {
				if (cellIndex % 10 !== 9 && cellIndex % 10 !== 0) {
					vicitinityCells.push(index);
				} else if (cellIndex % 10 === 9) {
					if (index % 10 !== 0) {
						vicitinityCells.push(index);
					}
				} else {
					if (index % 10 !== 9) {
						vicitinityCells.push(index);
					}
				}
			}
		});
		return vicitinityCells;
	};

	const getShipVicinityCells = (shipCells) => {
		let shipVicinityCells = [];
		shipCells.forEach((shipCell) => {
			for (let i = 2; i < 5; i++) {
				[
					shipCell - 10 * i,
					shipCell - 10 * i - 1,
					shipCell - 10 * i + 1,
				].forEach((cell) => {
					const cellNode = doc.getElementById(`square-${cell}`);
					if (
						cellNode !== null &&
						cellNode.firstChild !== null &&
						cellNode.firstChild.classList.contains('vertical') &&
						(cellNode.firstChild.classList.contains(`draggable-ship-${i}`) ||
							cellNode.firstChild.classList.contains(
								`draggable-ship-${i + 1}`
							) ||
							cellNode.firstChild.classList.contains(`draggable-ship-${i + 2}`))
					) {
						shipVicinityCells.push(cell);
					}
				});
				[shipCell - 10 - i, shipCell + 10 - i].forEach((cell) => {
					const cellNode = doc.getElementById(`square-${cell}`);
					if (
						cellNode !== null &&
						cellNode.firstChild !== null &&
						cellNode.firstChild.classList.contains('horizontal') &&
						(cellNode.firstChild.classList.contains(`draggable-ship-${i}`) ||
							cellNode.firstChild.classList.contains(`draggable-ship-${i + 1}`))
					) {
						shipVicinityCells.push(cell);
					}
				});
			}
			shipVicinityCells = shipVicinityCells.concat(
				getVicitinityCells(shipCell)
			);
		});
		return shipVicinityCells;
	};

	const renderPlayAgainButton = () => {
		const playAgainButton = doc.createElement('button');
		playAgainButton.id = 'play-again-button';
		playAgainButton.textContent = 'Play again';
		playAgainButton.addEventListener('click', () => {
			renderOptionScreen();
		});
		body.appendChild(playAgainButton);
	};

	const clearPlayAgainButton = () => {
		const playAgainButton = doc.querySelector('#play-again-button');
		if (playAgainButton !== null) {
			body.removeChild(playAgainButton);
		}
	};

	const fillGameboardWithRandomShips = (gameboard) => {
		const shipArray = [
			Ship(1),
			Ship(1),
			Ship(1),
			Ship(1),
			Ship(2),
			Ship(2),
			Ship(2),
			Ship(3),
			Ship(3),
			Ship(4),
		];
		shipArray.forEach((ship, index) => {
			let position = Math.floor(100 * Math.random());
			switch (ship.length) {
				case 1:
					while (gameboard.placeShip(ship, position, position) === false) {
						position = Math.floor(100 * Math.random());
					}
					break;
				case 2:
					if (index === 4) {
						while (
							position + 1 > 99 ||
							gameboard.placeShip(ship, position, position + 1) === false
						) {
							position = Math.floor(100 * Math.random());
						}
					} else {
						while (
							position + 10 > 99 ||
							gameboard.placeShip(ship, position, position + 10) === false
						) {
							position = Math.floor(100 * Math.random());
						}
					}
					break;
				case 3:
					if (index === 7) {
						while (
							position + 2 > 99 ||
							gameboard.placeShip(ship, position, position + 2) === false
						) {
							position = Math.floor(100 * Math.random());
						}
					} else {
						while (
							position + 20 > 99 ||
							gameboard.placeShip(ship, position, position + 20) === false
						) {
							position = Math.floor(100 * Math.random());
						}
					}
					break;
				case 4:
					while (
						position + 30 > 99 ||
						gameboard.placeShip(ship, position, position + 30) === false
					) {
						position = Math.floor(100 * Math.random());
					}
					break;
				default:
					break;
			}
		});
	};

	const renderShipPlacement = () => {
		const dragOverEvent = (event) => {
			event.preventDefault();
		};
		const dropEvent = (event) => {
			const id = event.dataTransfer.getData('text');
			const ship = doc.getElementById(id);
			const parentSquareIndex = Number(event.target.id.slice(7));
			let shipCells = [parentSquareIndex];
			const originalParentIndex = Number(ship.parentNode.id.slice(7));
			let originalShipCells = [originalParentIndex];
			if (ship.classList.contains('vertical')) {
				shipCells.push(parentSquareIndex + 10);
				originalShipCells.push(originalParentIndex + 10);
				if (ship.classList.contains('draggable-ship-3')) {
					shipCells.push(parentSquareIndex + 20);
					originalShipCells.push(originalParentIndex + 20);
				}
				if (ship.classList.contains('draggable-ship-4')) {
					shipCells.push(parentSquareIndex + 20, parentSquareIndex + 30);
					originalShipCells.push(
						originalParentIndex + 20,
						originalParentIndex + 30
					);
				}
			} else if (ship.classList.contains('horizontal')) {
				shipCells.push(parentSquareIndex + 1);
				originalShipCells.push(originalParentIndex + 1);
				if (ship.classList.contains('draggable-ship-3')) {
					shipCells.push(parentSquareIndex + 2);
					originalShipCells.push(originalParentIndex + 2);
				}
			}
			const vicinityCells = getShipVicinityCells(shipCells)
				.filter((vicinityCell) => {
					return !originalShipCells.includes(vicinityCell);
				})
				.map((vicinityCell) => {
					return doc.getElementById(`square-${vicinityCell}`);
				});
			if (
				event.target.firstChild === null &&
				!vicinityCells.some((cell) => cell.firstChild !== null)
			) {
				if (ship.classList.contains('draggable-ship-4')) {
					if (parentSquareIndex <= 69) {
						event.preventDefault();
						event.target.appendChild(ship);
					}
				} else if (ship.classList.contains('draggable-ship-3')) {
					if (parentSquareIndex <= 79) {
						if (ship.classList.contains('horizontal')) {
							if (parentSquareIndex % 10 <= 7) {
								event.preventDefault();
								event.target.appendChild(ship);
							}
						} else {
							event.preventDefault();
							event.target.appendChild(ship);
						}
					}
				} else if (ship.classList.contains('draggable-ship-2')) {
					if (parentSquareIndex <= 89) {
						if (ship.classList.contains('horizontal')) {
							if (parentSquareIndex % 10 <= 8) {
								event.preventDefault();
								event.target.appendChild(ship);
							}
						} else {
							event.preventDefault();
							event.target.appendChild(ship);
						}
					}
				} else {
					event.preventDefault();
					event.target.appendChild(ship);
				}
			}
		};
		const dragStartEvent = (event) => {
			event.dataTransfer.setData('text', event.target.id);
		};
		const gameboardsContainer = doc.createElement('div');
		gameboardsContainer.id = 'gameboards-container';
		const boardContainer = doc.createElement('div');
		boardContainer.classList.add('gameboard');
		boardContainer.id = 'placement-board';

		for (let i = 0; i < 100; i++) {
			const ship = doc.createElement('div');
			ship.id = `ship-${i}`;
			ship.addEventListener('dragstart', dragStartEvent);
			const square = doc.createElement('div');
			square.id = `square-${i}`;
			square.classList.add('cell');
			square.classList.add('available');
			square.addEventListener('dragover', dragOverEvent);
			square.addEventListener('drop', dropEvent);
			switch (i) {
				case 5:
					ship.classList.add('draggable-ship-4');
					ship.classList.add('vertical');
					ship.draggable = true;
					square.appendChild(ship);
					break;
				case 17:
					ship.classList.add('draggable-ship-3');
					ship.classList.add('vertical');
					ship.draggable = true;
					square.appendChild(ship);
					break;
				case 97:
					ship.classList.add('draggable-ship-3');
					ship.classList.add('horizontal');
					ship.draggable = true;
					square.appendChild(ship);
					break;
				case 9:
				case 29:
				case 49:
				case 85:
					ship.classList.add('draggable-ship-1');
					ship.draggable = true;
					square.appendChild(ship);
					break;
				case 54:
				case 56:
					ship.classList.add('draggable-ship-2');
					ship.classList.add('vertical');
					ship.draggable = true;
					square.appendChild(ship);
					break;
				case 68:
					ship.classList.add('draggable-ship-2');
					ship.classList.add('horizontal');
					ship.draggable = true;
					square.appendChild(ship);
					break;
				default:
					break;
			}
			boardContainer.appendChild(square);
		}
		gameboardsContainer.appendChild(boardContainer);

		body.appendChild(gameboardsContainer);
		const doneButton = doc.createElement('button');
		doneButton.id = 'done-button';
		doneButton.textContent = 'Placement Complete';
		doneButton.addEventListener('click', (event) => {
			const gameboard1 = Gameboard();
			const gameboard2 = Gameboard();

			const player1 = Player('Player 1', false);
			const player2 = Player('Player 2', true);
			const cells = [...doc.querySelectorAll('.cell')].filter(
				(cell) => cell.firstChild !== null
			);
			cells.forEach((cell) => {
				const index = Number(cell.id.slice(7));
				const shipNode = cell.firstChild;
				if (shipNode.classList.contains('draggable-ship-1')) {
					const ship = Ship(1);
					gameboard1.placeShip(ship, index, index);
				} else if (shipNode.classList.contains('draggable-ship-2')) {
					const ship = Ship(2);
					if (shipNode.classList.contains('horizontal')) {
						gameboard1.placeShip(ship, index, index + 1);
					} else {
						gameboard1.placeShip(ship, index, index + 10);
					}
				} else if (shipNode.classList.contains('draggable-ship-3')) {
					const ship = Ship(3);
					if (shipNode.classList.contains('horizontal')) {
						gameboard1.placeShip(ship, index, index + 1, index + 2);
					} else {
						gameboard1.placeShip(ship, index, index + 10, index + 20);
					}
				} else {
					const ship = Ship(4);
					gameboard1.placeShip(ship, index, index + 10, index + 20, index + 30);
				}
			});

			fillGameboardWithRandomShips(gameboard2);

			renderBoard(
				'gameboard-one',
				gameboard1,
				gameboard2,
				false,
				false,
				() => {
					return null;
				},
				player1.name,
				player2.name
			);

			renderBoard(
				'gameboard-two',
				gameboard2,
				gameboard1,
				true,
				true,
				() => gameboard1.receiveAttack(player2.randomMove(gameboard1)),
				player2.name,
				player1.name
			);
		});
		body.appendChild(doneButton);
	};

	const renderShipPositioningScreen = (
		againstComputer,
		player1name,
		player2name
	) => {
		if (againstComputer) {
			renderShipPlacement();
		} else {
			clearNameInput();
			const gameboard1 = Gameboard();
			const gameboard2 = Gameboard();

			const player1 = Player(player1name, false);
			const player2 = Player(player2name, false);

			fillGameboardWithRandomShips(gameboard1);
			fillGameboardWithRandomShips(gameboard2);
			renderBoard(
				'gameboard-two',
				gameboard2,
				gameboard1,
				false,
				true,
				null,
				player2name,
				player1name
			);
			renderTurnMessage(player1name);
		}
	};

	const renderGameOverMessage = (won, name) => {
		const message = doc.createElement('div');
		const span = doc.createElement('span');
		if (name !== null) {
			message.id = 'won-message';
			span.textContent = `${name} won!`;
		} else if (won) {
			message.id = 'won-message';
			span.textContent = 'You won!';
		} else {
			message.id = 'lost-message';
			span.textContent = 'You lost';
		}
		message.appendChild(span);
		body.appendChild(message);
		renderPlayAgainButton();
	};

	const clearGameOverMessage = () => {
		const message =
			doc.getElementById('won-message') || doc.getElementById('lost-message');
		if (message !== null) {
			body.removeChild(message);
		}
	};

	const renderNameInput = () => {
		const form = doc.createElement('form');
		form.id = 'name-inputs-form';
		const nameInputs = doc.createElement('div');
		nameInputs.id = 'name-inputs';
		const label1 = doc.createElement('label');
		label1.for = 'name1';
		label1.textContent = 'Player 1: ';
		nameInputs.appendChild(label1);
		const name1 = doc.createElement('input');
		name1.type = 'text';
		name1.id = 'name1';
		name1.required = true;
		nameInputs.appendChild(name1);
		const label2 = doc.createElement('label');
		label2.for = 'name2';
		label2.textContent = 'Player 2: ';
		nameInputs.appendChild(label2);
		const name2 = doc.createElement('input');
		name2.type = 'text';
		name2.id = 'name2';
		name2.required = true;
		nameInputs.appendChild(name2);
		form.appendChild(nameInputs);

		const submit = doc.createElement('input');
		submit.type = 'submit';
		submit.id = 'submit-button';
		submit.addEventListener('click', (e) => {
			e.preventDefault();
			const name1 = doc.getElementById('name1');
			const name2 = doc.getElementById('name2');
			if (name1.checkValidity() && name2.checkValidity()) {
				renderShipPositioningScreen(false, name1.value, name2.value);
			}
		});
		form.appendChild(submit);

		body.appendChild(form);
	};

	const clearNameInput = () => {
		body.removeChild(doc.querySelector('form'));
	};

	const renderTurnMessage = (name) => {
		const turnMessage = doc.createElement('div');
		turnMessage.id = 'turn-message';
		const span = doc.createElement('span');
		span.textContent = `${name}'s turn`;
		turnMessage.appendChild(span);
		body.appendChild(turnMessage);
	};

	const clearTurnMessage = () => {
		body.removeChild(doc.getElementById('turn-message'));
	};

	const renderPassDeviceScreen = () => {
		const passDevice = doc.createElement('div');
		passDevice.id = 'pass-device-message';
		const span = doc.createElement('span');
		span.textContent = 'Pass the device...';
		passDevice.appendChild(span);
		body.appendChild(passDevice);
	};

	const clearPassDeviceScreen = () => {
		body.removeChild(doc.getElementById('pass-device-message'));
	};

	const renderBoard = (
		id,
		opponentGameboard,
		selfGameboard,
		computerIsOpponent,
		turn,
		computersTurn,
		selfName,
		opponentName
	) => {
		clearBoard('placement-board');
		if (doc.querySelector('#done-button') !== null) {
			body.removeChild(doc.querySelector('#done-button'));
		}
		const gameboardsContainer =
			doc.getElementById('gameboards-container') || doc.createElement('div');
		gameboardsContainer.id = 'gameboards-container';
		const boardContainer = doc.createElement('div');
		boardContainer.classList.add('gameboard');
		boardContainer.id = id;

		const positionArray = Array(100)
			.fill(0)
			.map((value, index) => opponentGameboard.getPosition(index));
		positionArray.forEach((position, index) => {
			const square = doc.createElement('div');
			square.id = `square-${index}`;
			square.classList.add('cell');
			square.classList.add(position.status);
			if (position.ship !== null) {
				square.classList.add('ship');
			}
			if (
				computerIsOpponent &&
				turn &&
				!opponentGameboard.allShipsSunk() &&
				!selfGameboard.allShipsSunk()
			) {
				square.addEventListener('click', (event) => {
					let receivedAttack = opponentGameboard.receiveAttack(index);
					if (receivedAttack === 'hit') {
						clearBoard('gameboard-one');
						renderBoard(
							'gameboard-one',
							selfGameboard,
							opponentGameboard,
							!computerIsOpponent,
							!turn,
							() => {},
							opponentName,
							selfName
						);
						clearBoard(id);
						renderBoard(
							id,
							opponentGameboard,
							selfGameboard,
							computerIsOpponent,
							turn,
							computersTurn,
							selfName,
							opponentName
						);
						if (opponentGameboard.allShipsSunk()) {
							renderGameOverMessage(true, null);
						} else if (selfGameboard.allShipsSunk()) {
							renderGameOverMessage(false, null);
						}
					} else if (receivedAttack !== null) {
						while (computersTurn() === 'hit') {
							clearBoard('gameboard-one');
							renderBoard(
								'gameboard-one',
								selfGameboard,
								opponentGameboard,
								!computerIsOpponent,
								!turn,
								() => {},
								opponentName,
								selfName
							);
						}
						clearBoard('gameboard-one');
						renderBoard(
							'gameboard-one',
							selfGameboard,
							opponentGameboard,
							!computerIsOpponent,
							!turn,
							() => {},
							opponentName,
							selfName
						);
						clearBoard(id);
						renderBoard(
							id,
							opponentGameboard,
							selfGameboard,
							computerIsOpponent,
							turn,
							computersTurn,
							selfName,
							opponentName
						);
						if (opponentGameboard.allShipsSunk()) {
							renderGameOverMessage(true, null);
						} else if (selfGameboard.allShipsSunk()) {
							renderGameOverMessage(false, null);
						}
					}
				});
			} else if (
				computersTurn === null &&
				!opponentGameboard.allShipsSunk() &&
				!selfGameboard.allShipsSunk()
			) {
				square.addEventListener('click', (event) => {
					let receivedAttack = opponentGameboard.receiveAttack(index);
					if (receivedAttack === 'hit') {
						clearTurnMessage();
						clearBoard(id);
						renderBoard(
							id,
							opponentGameboard,
							selfGameboard,
							computerIsOpponent,
							turn,
							computersTurn,
							selfName,
							opponentName
						);
						if (opponentGameboard.allShipsSunk()) {
							renderGameOverMessage(true, opponentName);
						} else if (selfGameboard.allShipsSunk()) {
							renderGameOverMessage(false, selfName);
						} else {
							renderTurnMessage(opponentName);
						}
					} else if (receivedAttack !== null) {
						clearTurnMessage();
						clearBoard(id);
						renderBoard(
							id,
							opponentGameboard,
							selfGameboard,
							computerIsOpponent,
							turn,
							computersTurn,
							selfName,
							opponentName
						);
						renderTurnMessage(opponentName);
						clearTurnMessage();
						clearBoard(id);
						renderPassDeviceScreen();
						setTimeout(() => {
							clearPassDeviceScreen();
							renderBoard(
								id === 'gameboard-one' ? 'gameboard-two' : 'gameboard-one',
								selfGameboard,
								opponentGameboard,
								false,
								turn,
								null,
								opponentName,
								selfName
							);
							renderTurnMessage(selfName);
						}, 2000);
					}
				});
			}
			boardContainer.appendChild(square);
		});
		gameboardsContainer.appendChild(boardContainer);
		body.appendChild(gameboardsContainer);
	};

	return {
		renderOptionScreen,
		renderTitle,
	};
})(document);

export default DOM;
