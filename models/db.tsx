import Dexie, { Table } from "dexie";
import middleware from "dexie-easy-encrypt";

import { Nonce } from "models/nonce";
import { Nonces } from "models/nonces";
import { encryption } from "lib/utils";

class NoncesDb extends Dexie {
	nonces!: Table<Nonces, number>;
	nonce!: Table<Nonce, number>;

	deleteList(noncesId: number) {
		return this.transaction("rw", this.nonce, this.nonces, () => {
			this.nonce.where({ noncesId }).delete();
			this.nonces.delete(noncesId);
		});
	}
	// changePassword(oldPassword = "123", newPassword = "12345") {
	// 	const db = new NoncesDb("Nonces");
	// 	db.version(1).stores({
	// 		nonces: "++id",
	// 		nonce: "++id, noncesId, title, uid",
	// 	});
	// 	db.nonce.toArray().then((arr) => {
	// 		arr.map(({ id, __DATA__ }) => {
	// 			const data = encryption(oldPassword).decrypt(__DATA__);
	// 			console.log({ id, ...data });
	// 		});
	// 	});
	// }
}

const { name, secret } = window["___TEMP_DB_DATA___"];
const db = new NoncesDb(name);
const tables = ["nonces", "nonce"];

middleware({ db, encryption: encryption(secret || ""), tables });
db.version(2).stores({
	nonces: "++id",
	nonce: "++id, noncesId, title, uid",
});

async function open(): Promise<NoncesDb> {
	await db.open();
	return db;
}

export default open;
