import Dexie from "dexie";
import { useCallback, useEffect, useState } from "react";

import CreateDb from "components/withAuth/CreateDb";
import ListDb from "components/withAuth/ListDb";
import Credential from "components/withAuth/Credential";
import { encryption } from "lib/utils";

export default function withAuth(Component) {
	return function Auth(props) {
		const [step, setstep] = useState<
			"loading" | "creating" | "credential" | "list"
		>("loading");
		const [selectedDb, setselectedDb] = useState<string>("");
		const [databases, setdatabases] = useState<string[]>([]);
		const [errors, seterrors] = useState<{ [key: string]: string }>({});
		const [openVault, setopenVault] = useState(false);
		const vaultData =
			typeof window !== "undefined" ? window["___TEMP_DB_DATA___"] : {};
		const checkStep = useCallback(() => {
			Dexie.getDatabaseNames().then((db) => {
				setdatabases(db);
				console.log(db.length);
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
			// To keep the vault open between route navigation
			setopenVault(!!window["___TEMP_DB_DATA___"]);
		}, []);

		useEffect(() => {
			checkStep();
		}, [checkStep]);

		return (
			<div>
				{openVault ? (
					<Component dbData={{ ...vaultData }} onLogout={logout} {...props} />
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

		function login(values) {
			console.log({ values });
			try {
				openDb(values.name, values.secret);
			} catch (e) {
				seterrors({ credential: "WRONG_PASSWORD" });
			}
		}

		function logout() {
			delete window["___TEMP_DB_DATA___"];
			checkStep();
		}
		async function openDb(name: string, secret = "") {
			window["___TEMP_DB_DATA___"] = {
				name,
				secret,
			};
			setopenVault(true);
		}
		function createDb(values) {
			if (values.password) {
				sessionStorage.setItem(
					`DB__${values.title}`,
					JSON.stringify({
						secret: encryption(values.password).encrypt(values.secret),
					})
				);
			}
			openDb(values.title, values.password ? values.secret : null);
		}
		function deleteDb(db) {
			sessionStorage.removeItem(`DB__${db}`);
			Dexie.delete(db);
			Dexie.getDatabaseNames().then(setdatabases);
			checkStep();
		}
	};
}
