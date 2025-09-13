import Footer from "@/components/footer/footer.component";
import Header from "@/components/header/header.component";
import Main from "@/components/main/main.component";

export default function Home() {
	return (
		<div style={{ overflow: "hidden" }}>
			<div style={{ position: "fixed" }}>
				<Header />
			</div>
			<Main />
			<div style={{ position: "fixed" }}>
				<Footer />
			</div>
		</div>
	);
}
