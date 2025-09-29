import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import AdminHeader from "@/components/header/AdminHeader.component";
import Footer from "@/components/footer/footer.component";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<AdminHeader />
			{children}
			<Footer />
		</div>
	);
}
