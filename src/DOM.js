const DOM = ((doc) => {
	const body = doc.querySelector('body');

	const clearBoard = (id) => {
		const container = document.getElementById('gameboards-container');
		container.removeChild(doc.getElementById(id));
	};

	const renderTitle = () => {
		const title = doc.createElement('div');
		title.id = 'title';
		const h1 = doc.createElement('h1');
		h1.textContent = 'Battleship';
		title.appendChild(h1);
		body.appendChild(title);
	};

	const renderOptionScreen = (playAgainstComputer, playAgainstSomeoneElse) => {
		const options = doc.createElement('div');
		options.id = 'options';
		const option1 = doc.createElement('button');
		option1.classList.add('option-button');
		option1.textContent = 'Play against the computer';
		option1.addEventListener('click', () => {
			clearOptionScreen();
			playAgainstComputer();
		});
		const option2 = doc.createElement('button');
		option2.classList.add('option-button');
		option2.textContent = 'Play against someone else';
		option2.addEventListener('click', () => {
			clearOptionScreen();
			playAgainstSomeoneElse();
		});
		options.appendChild(option1);
		options.appendChild(option2);
		body.appendChild(options);
	};

	const clearOptionScreen = () => {
		body.removeChild(doc.getElementById('options'));
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
						computersTurn();
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
							renderGameOverMessage(true, null);
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
						}
					} else if (receivedAttack !== null) {
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
						}, 5000);
					}
				});
			}
			boardContainer.appendChild(square);
		});
		gameboardsContainer.appendChild(boardContainer);
		body.appendChild(gameboardsContainer);
	};

	return {
		clearBoard,
		renderBoard,
		renderTitle,
		renderOptionScreen,
		clearOptionScreen,
	};
})(document);

export default DOM;
