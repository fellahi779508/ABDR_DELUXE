import "@/styles/globals.css";
import Header from "@/components/header/header.component";
import Footer from "@/components/footer/footer.component";
import Ads from "@/components/ads/ads.component";
import { GetAllPromotions } from "@/utils/Admin";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const ads = await GetAllPromotions();

	return (
		<div>
			<Header />
			<Ads ads={ads} />
			{children}
			<Footer />
		</div>
	);
}
