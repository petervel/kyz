export const choice = <T>(list: T[]): T | null => {
	if (list.length > 0) {
		return list[Math.floor(Math.random() * list.length)];
	}
	return null;
};
