import Dexie, { Table } from "dexie";

import { Nonce } from "models/nonce";
import { Nonces } from "models/nonces";
import { EncryptionCheck } from "models/encryption_check";

export default class NoncesDb extends Dexie {
	nonces!: Table<Nonces, number>;
	nonce!: Table<Nonce, number>;
	__encryption_check__!: Table<EncryptionCheck, number>;

	deleteList(noncesId: number) {
		return this.transaction("rw", this.nonce, this.nonces, () => {
			this.nonce.where({ noncesId }).delete();
			this.nonces.delete(noncesId);
		});
	}
}
