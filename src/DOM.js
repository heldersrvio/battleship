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
		option1.textContent = 'Play against computer';
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

	const renderGameOverMessage = (won) => {
		const message = doc.createElement('div');
		const span = doc.createElement('span');
		if (won) {
			message.id = 'won-message';
			span.textContent = 'You won!';
		} else {
			message.id = 'lost-message';
			span.textContent = 'You lost';
		}
		message.appendChild(span);
		body.appendChild(message);
	};

	const renderBoard = (
		id,
		opponentGameboard,
		selfGameboard,
		computerIsOpponent,
		turn,
		computersTurn
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
					if (opponentGameboard.receiveAttack(index) !== null) {
						computersTurn();
						clearBoard('gameboard-one');
						renderBoard(
							'gameboard-one',
							selfGameboard,
							opponentGameboard,
							!computerIsOpponent,
							!turn,
							() => {}
						);
						clearBoard(id);
						renderBoard(
							id,
							opponentGameboard,
							selfGameboard,
							computerIsOpponent,
							turn,
							computersTurn
						);
						if (opponentGameboard.allShipsSunk()) {
							renderGameOverMessage(true);
						} else if (selfGameboard.allShipsSunk()) {
							renderGameOverMessage(false);
						}
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
