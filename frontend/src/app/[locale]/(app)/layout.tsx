import "@/styles/globals.css";
import Header from "@/components/header/header.component";
import Footer from "@/components/footer/footer.component";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<Header />
			{children}
			<Footer />
		</div>
	);
}
