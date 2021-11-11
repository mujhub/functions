type EateryInfo = {
	title: string;
	description: string;
	cover: string;
	is_open: boolean;
	tint: string;
	contact: string;
	location: string;
	opens_at: string;
	closes_at: string;
	payments: { upi: string; paytm: string };
};

export default EateryInfo;
