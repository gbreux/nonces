import Typography from "components/Typography";
import Trash from "components/Icons/Trash";
import GlobalLink from "components/GlobalLink";
import Button from "components/Button";

export default function ListDb({
	i18n,
	onCreate,
	onSelect,
	deleteDb,
	databases,
}) {
	return (
		<section>
			<header className="mb-4">
				<Typography variant="h1">{i18n.title}</Typography>
			</header>
			<ul className="space-y-4 mb-7">
				{databases.map((db) => {
					return (
						<li
							key={db}
							className="p-4 border w-full rounded-lg relative hover:border-gray-400 flex items-center justify-between"
						>
							<GlobalLink
								component="button"
								onClick={() => {
									onSelect(db);
								}}
								key={db}
							>
								{db.replace(/^getnonces.com__/, "")}
							</GlobalLink>
							<button
								className="w-10 h-10 rounded-full hover:bg-gray-200 z-10 flex items-center justify-center"
								onClick={() => {
									deleteDb(db);
								}}
							>
								<Trash className="w-6 h-6" />
							</button>
						</li>
					);
				})}
			</ul>
			<footer>
				<Button onClick={onCreate}>{i18n.create}</Button>
			</footer>
		</section>
	);
}
