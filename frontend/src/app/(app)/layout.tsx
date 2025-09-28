import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/header/header.component";
import Footer from "@/components/footer/footer.component";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "ABR_DELUXE Auto",
	description: "Buy / Rent / Import Cars",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html>
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	);
}
