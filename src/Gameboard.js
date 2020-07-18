const Gameboard = () => {
	let positions = Array(100).fill({
		ship: null,
		index: null,
		status: 'available',
	});

	const getPosition = (position) => {
		return positions[position];
	};

	const getPositionRange = (startPosition, endPosition) => {
		const difference = endPosition - startPosition;
		let range = [];
		if (difference < 0) {
			return range;
		}
		if (difference <= 4) {
			for (let i = startPosition; i <= endPosition; i++) {
				range.push(i);
			}
		} else if (difference % 10 === 0 && difference <= 40) {
			for (let i = startPosition; i <= endPosition; i += 10) {
				range.push(i);
			}
		}
		return range;
	};

	const getVicinity = (position) => {
		let vicinity = [];
		[
			position - 1,
			position + 1,
			position - 10,
			position + 10,
			position - 11,
			position - 9,
			position + 9,
			position + 11,
		].forEach((slot) => {
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
		});
		return vicinity;
	};

	const updateAfterSunkShip = (ship) => {
		const positionsCopy = positions.slice(0);
		positions.forEach((position, index) => {
			if (position.ship === ship) {
				getVicinity(index).forEach((slot) => {
					if (
						getPosition(slot).ship === null &&
						getPosition(slot).status === 'available'
					) {
						positionsCopy[slot] = {
							ship: null,
							index: null,
							status: 'unavailable',
						};
					}
				});
			}
		});
		positions = positionsCopy;
	};

	const updateAfterAttack = (status, position) => {
		const positionsCopy = positions.slice(0);
		positionsCopy[position] = {
			ship: positionsCopy[position].ship,
			index: positionsCopy[position].index,
			status: status,
		};
		positions = positionsCopy;
	};

	const placeShip = (ship, startPosition, endPosition) => {
		const positionRange = getPositionRange(startPosition, endPosition);
		const positionsCopy = positions.slice(0);
		let invalidRange = false;
		if (positionRange.length !== ship.length) {
			return;
		}
		if (positionRange.length === 0) {
			return;
		}
		positionRange.forEach((position) => {
			if (getPosition(position).ship !== null) {
				invalidRange = true;
				return;
			}
			getVicinity(position).forEach((vicinityPosition) => {
				if (getPosition(vicinityPosition).ship !== null) {
					invalidRange = true;
					return;
				}
			});
		});
		if (invalidRange) {
			return;
		}
		positionRange.forEach((position, index) => {
			positionsCopy[position] = {
				ship,
				index,
				status: 'available',
			};
		});
		positions = positionsCopy;
	};

	const receiveAttack = (position) => {
		if (getPosition(position).status === 'available') {
			const status = getPosition(position).ship === null ? 'missed' : 'hit';
			updateAfterAttack(status, position);
			if (status === 'hit') {
				getPosition(position).ship.hit(getPosition(position).index);
				if (getPosition(position).ship.isSunk()) {
					updateAfterSunkShip(getPosition(position).ship);
				}
			}
			return status;
		}
		return null;
	};

	const allShipsSunk = () => {
		let foundUnsunkShip = false;
		positions.forEach((position) => {
			if (position.ship !== null && !position.ship.isSunk()) {
				foundUnsunkShip = true;
			}
		});
		return !foundUnsunkShip;
	};

	return {
		getPosition,
		placeShip,
		receiveAttack,
		allShipsSunk,
	};
};

export default Gameboard;
