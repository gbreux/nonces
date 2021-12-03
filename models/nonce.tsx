export interface Nonce {
	id?: number;
	noncesId?: number;
	uid: string;
	title: string;
	__DATA__?: string;
	meta: {
		[key: string]: { secret: boolean; value: string };
	};
}
