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

	const renderNameInput = (callback) => {
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
				callback(name1.value, name2.value);
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
		renderNameInput,
		clearNameInput,
		renderTurnMessage,
	};
})(document);

export default DOM;
