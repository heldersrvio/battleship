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
						clearBoard(id);
						renderBoard(
							id,
							opponentGameboard,
							selfGameboard,
							computerIsOpponent,
							turn,
							computersTurn
						);
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
	};
})(document);

export default DOM;
