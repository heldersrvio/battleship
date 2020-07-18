const Player = (playerName, isComputer) => {
	const name = playerName;

	const getPositionsByStatus = (gameboard, status) => {
		return Array(100)
			.fill(0)
			.map((value, index) => index)
			.filter((position) => gameboard.getPosition(position).status === status);
	};

	const getVicinity = (position) => {
		let vicinity = [];
		[position - 1, position + 1, position - 10, position + 10].forEach(
			(slot) => {
				if (slot >= 0 && slot < 100) {
					if (position % 10 !== 9 && position % 10 !== 0) {
						vicinity.push(slot);
					} else if (position % 10 === 9) {
						if (slot % 10 !== 0) {
							vicinity.push(slot);
						}
					} else {
						if (slot % 10 !== 9) {
							vicinity.push(slot);
						}
					}
				}
			}
		);
		return vicinity;
	};

	const randomMove = (gameboard) => {
		if (!isComputer) {
			return null;
		}
		const availablePositions = getPositionsByStatus(gameboard, 'available');
		const hitPositions = getPositionsByStatus(gameboard, 'hit');
		if (hitPositions.length !== 0) {
			const availableVicinity = availablePositions.filter((position) =>
				hitPositions.some((hitPosition) =>
					getVicinity(position).includes(hitPosition)
				)
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
