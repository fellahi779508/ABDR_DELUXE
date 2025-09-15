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
			<h1 style={{ color: "green", fontSize: "2rem" }}>
				la commande a ete passer avec success
			</h1>
			<h2 style={{ fontSize: "1.5rem" }}>merci pour votre confiance</h2>
		</div>
	);
}

export default page;
