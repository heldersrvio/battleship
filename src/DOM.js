const DOM = ((doc) => {
	const body = doc.querySelector('body');

	const clearBoard = (id) => {
		body.removeChild(doc.getElementById(id));
	};

	const renderBoard = (
		id,
		opponentGameboard,
		selfGameboard,
		computerIsOpponent,
		turn,
		computersTurn
	) => {
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
			if (computerIsOpponent && turn && !opponentGameboard.allShipsSunk()) {
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
		body.appendChild(boardContainer);
	};

	return {
		clearBoard,
		renderBoard,
	};
})(document);

export default DOM;
