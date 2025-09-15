/* eslint-disable react/no-unescaped-entities */
async function page() {
	return (
		<div
			style={{
				textAlign: "center",
				width: "100vw",
				height: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
			}}
		>
			<h1 style={{ color: "red", fontSize: "2rem" }}>
				la commande a ete annuler (error)
			</h1>
			<h2 style={{ fontSize: "1.5rem" }}>
				{" "}
				voulez vous retourner a la page d'acceuil
			</h2>
		</div>
	);
}

export default page;
