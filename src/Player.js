const Player = (playerName, isComputer) => {
	const name = playerName;

	const getPositionsByStatus = (gameboard, status) => {
		return Array(100)
			.fill(0)
			.map((value, index) => index)
			.filter((position) => gameboard.getPosition(position).status === status);
	};

	const randomMove = (gameboard) => {
		if (!isComputer) {
			return null;
		}
		const availablePositions = getPositionsByStatus(gameboard, 'available');
		const hitPositions = getPositionsByStatus(gameboard, 'hit');
		if (hitPositions.length !== 0) {
			const availableVicinity = availablePositions.filter(
				(position) =>
					hitPositions.includes(position + 1) ||
					hitPositions.includes(position - 1) ||
					hitPositions.includes(position - 10) ||
					hitPositions.includes(position + 10)
			);
			if (availableVicinity.length !== 0) {
				return availableVicinity[
					Math.floor(Math.random() * availableVicinity.length)
				];
			}
		}
		return availablePositions[
			Math.floor(Math.random() * availablePositions.length)
		];
	};

	return {
		name,
		randomMove,
	};
};

export default Player;
