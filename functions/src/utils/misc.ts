export const currDate = new Date(Date.now() + 19800000);

export const isOpen = ({ opens_at, closes_at }: { opens_at: string; closes_at: string }) => {
	let dt = currDate;
	let currParts = [dt.getUTCHours(), dt.getUTCMinutes()];
	let startParts = opens_at.split(":");
	let endParts = closes_at.split(":");
	let currTime = Number(currParts[0]) * 60 + Number(currParts[1]);
	let startTime = Number(startParts[0]) * 60 + Number(startParts[1]);
	let endTime = Number(endParts[0]) * 60 + Number(endParts[1]);
	return currTime < endTime && currTime > startTime;
};
