import { useCallback, useEffect, useState } from "react";
import middleware from "dexie-easy-encrypt";
import Dexie from "dexie";

import CreateDb from "components/withAuth/CreateDb";
import ListDb from "components/withAuth/ListDb";
import Credential from "components/withAuth/Credential";
import { encryption } from "lib/utils";
import NoncesDb from "models/db";

const currentVersion = 2;

export default function withAuth(Component) {
	return function Auth(props) {
		const [step, setstep] = useState<
			"loading" | "creating" | "credential" | "list"
		>("loading");
		const [selectedDb, setselectedDb] = useState<string>("");
		const [databases, setdatabases] = useState<string[]>([]);
		const [db, setdb] = useState<any>();
		const [errors, seterrors] = useState<{ [key: string]: string }>({});
		const checkStep = useCallback(() => {
			Dexie.getDatabaseNames().then((db) => {
				setdatabases(db);
				switch (db.length) {
					case 0: {
						setstep("creating");
						break;
					}
					case 1: {
						setselectedDb(db[0]);
						setstep("credential");
						break;
					}
					default: {
						setstep("list");
						break;
					}
				}
			});
		}, []);

		useEffect(() => {
			checkStep();
		}, [checkStep]);

		return (
			<div>
				{!!db ? (
					<Component db={db} onLogout={logout} {...props} />
				) : (
					<section className="bg-gray-800 w-full h-screen flex items-start justify-center">
						{step === "loading" ? null : (
							<article className="bg-white max-w-3xl h-full md:h-auto md:my-auto w-full md:rounded-lg p-7">
								{step === "creating" ? (
									<CreateDb
										createDb={createDb}
										i18n={props.i18n.WithAuth.Components.CreateDb}
										onBack={() => {
											databases.length ? setstep("list") : null;
										}}
									/>
								) : step === "list" ? (
									<ListDb
										i18n={props.i18n.WithAuth.Components.ListDb}
										databases={databases}
										deleteDb={deleteDb}
										onCreate={() => {
											setstep("creating");
										}}
										onSelect={(db) => {
											setselectedDb(db);
											setstep("credential");
										}}
									/>
								) : (
									<Credential
										i18n={props.i18n.WithAuth.Components.Credential}
										onLogin={login}
										name={selectedDb}
										error={errors.credential}
										onBack={() =>
											databases.length ? setstep("list") : setstep("creating")
										}
									/>
								)}
							</article>
						)}
					</section>
				)}
			</div>
		);

		async function login({ name, password }) {
			try {
				const db = new NoncesDb(name);
				db.version(currentVersion).stores({ __encryption_check__: "++id" });
				await db.open();
				const key = await db.__encryption_check__.orderBy("id").first();
				const secret = encryption(password).decrypt(key?.secret);
				db.close();
				openDb(name, secret, currentVersion);
			} catch (e) {
				seterrors({ credential: "WRONG_PASSWORD" });
			}
		}

		function logout() {
			checkStep();
		}
		async function openDb(name: string, secret = "", version = currentVersion) {
			const db = new NoncesDb(name);
			const tables = ["nonces", "nonce"];
			middleware({
				db,
				encryption: encryption(secret),
				tables,
			});

			db.version(version).stores({
				__encryption_check__: "++id",
				nonces: "++id",
				nonce: "++id, noncesId, title, uid",
			});

			await db.open();
			await persist();

			setdb(db);
		}
		async function persist() {
			return (
				(await navigator.storage) &&
				navigator.storage.persist &&
				navigator.storage.persist()
			);
		}
		async function createDb(values) {
			const db = new NoncesDb(values.title);
			db.version(currentVersion - 1).stores({
				__encryption_check__: "++id",
				nonces: "++id",
				nonce: "++id, noncesId, title, uid",
			});
			await db.open();
			await db.__encryption_check__.add({
				secret: encryption(values.password).encrypt(values.secret),
			});
			db.close();
			openDb(values.title, values.secret, currentVersion);
		}
		function deleteDb(db) {
			Dexie.delete(db);
			Dexie.getDatabaseNames().then(setdatabases);
			checkStep();
		}
	};
}
