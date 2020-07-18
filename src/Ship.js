const Ship = (shipLength) => {
	const length = shipLength;
	let whereHit = [];

	const getWhereHit = () => {
		return whereHit;
	};

	const hit = (position) => {
		if (position < length && !whereHit.includes(position)) {
			whereHit = whereHit.concat([position]);
		}
	};

	const isSunk = () => {
		return whereHit.length === length;
	};

	return {
		length,
		getWhereHit,
		hit,
		isSunk,
	};
};

export default Ship;
