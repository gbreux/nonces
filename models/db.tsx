import Dexie, { Table } from "dexie";
import { populate } from "./populate";
import { Nonce } from "./nonce";
import { Nonces } from "./nonces";

export class NoncesDb extends Dexie {
	nonces!: Table<Nonces, number>;
	nonce!: Table<Nonce, number>;
	constructor() {
		super("Nonces");
		this.version(2).stores({
			nonces: "++id",
			nonce: "++id, noncesId, title, uid",
		});
	}

	deleteList(noncesId: number) {
		return this.transaction("rw", this.nonce, this.nonces, () => {
			this.nonce.where({ noncesId }).delete();
			this.nonces.delete(noncesId);
		});
	}
}

export const db = new NoncesDb();

db.on("populate", populate);

export function resetDatabase() {
	return db.transaction("rw", db.nonces, db.nonce, async () => {
		await Promise.all(db.tables.map((table) => table.clear()));
		await populate();
	});
}
