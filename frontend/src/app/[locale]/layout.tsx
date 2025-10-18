import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
	children: ReactNode;
	params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
	title: "ABR-DELUXE-AUTO | Buy, Sale & Car Rental",
	description:
		"ABR-DELUXE-AUTO is your trusted partner for car buying, selling, and rental services.",
	keywords: [
		"car",
		"rental",
		"buy",
		"sale",
		"auto",
		"vehicles",
		"ABR-DELUXE-AUTO",
		"car sales",
		"car rentals",
		"car buying",
		"car selling",
		"car dealership",
		"car dealership website",
		"car dealership software",
		"car dealership management",
		"car dealership system",
		"car dealership app",
		"ouedkniss",
		"ouedkniss.com",
	],
	openGraph: {
		title: "ABR-DELUXE-AUTO | Buy, Sale & Car Rental",
		description:
			"Find the best deals on car sales, purchases, and rentals with ABR-DELUXE-AUTO.",
		url: "https://abr-deluxe-auto.com",
		siteName: "ABR-DELUXE-AUTO",
		locale: "en_US",
		type: "website",
	},
	icons: {
		icon: "/images/logo.png", // optional
	},
};

// ✅ Layout component
export default async function LocaleLayout({ children, params }: Props) {
	const { locale } = await params;

	let messages;
	try {
		messages = (await import(`../../../messages/${locale}.json`)).default;
	} catch (error) {
		notFound();
	}

	return (
		<html lang={locale}>
			<body>
				<NextIntlClientProvider locale={locale} messages={messages}>
					{children}
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
