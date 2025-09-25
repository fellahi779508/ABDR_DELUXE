"use client";
import React, { useState, useEffect } from "react";
import styles from "./home.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomeComponent() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		setIsVisible(true);
	}, []);
	const router = useRouter();
	return (
		<main className={styles.container} role="main">
			{/* HERO */}
			<section
				className={`${styles.hero} ${isVisible ? styles.visible : ""}`}
				aria-labelledby="hero-title"
			>
				<div className={styles.heroBackground}></div>
				<div className={styles.heroContent}>
					<div className={styles.heroLeft}>
						<div className={styles.badgeContainer}>
							<span className={styles.badge}>ABR_DELUXE Auto</span>
							<div className={styles.badgeGlow}></div>
						</div>
						<h1 id="hero-title">
							<span className={styles.titleLine}>New & Used Cars</span>
							<span className={styles.titleLine}>Buy, Rent or Import</span>
						</h1>
						<p className={styles.lead}>
							Premium car dealership operating in Algeria & Qatar. Buy vehicles
							available locally, import directly from China / Qatar / UAE, or
							rent flexible cars for short and long term use.
						</p>

						<div className={styles.heroActions}>
							<button
								className={styles.primaryBtn}
								onClick={() => router.push("/buy")}
							>
								<span>Browse Inventory</span>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
									<path
										d="M5 12H19M19 12L12 5M19 12L12 19"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
						</div>

						<div className={styles.quickStats}>
							<div className={styles.statItem}>
								<div className={styles.statNumber}>20+</div>
								<div className={styles.statLabel}>Brands</div>
							</div>
							<div className={styles.statItem}>
								<div className={styles.statNumber}>150+</div>
								<div className={styles.statLabel}>Cars</div>
							</div>
							<div className={styles.statItem}>
								<div className={styles.statNumber}>3</div>
								<div className={styles.statLabel}>Offices</div>
							</div>
						</div>
					</div>

					<div className={styles.heroRight}>
						<div className={styles.imageContainer}>
							<Image
								src={"/images/homeHero.jpg"}
								alt="ABR_DELUXE main office"
								className={styles.mainImage}
								priority
								width={2000}
								height={2000}
							/>
							<div className={styles.imageOverlay}></div>
						</div>
					</div>
				</div>
			</section>

			{/* SERVICES / OFFERINGS */}
			<section className={styles.services} aria-labelledby="services-title">
				<div className={styles.sectionHeader}>
					<h2 id="services-title">What We Offer</h2>
					<p className={styles.sectionSubtitle}>
						Comprehensive automotive solutions tailored to your needs
					</p>
				</div>

				<div className={styles.serviceGrid}>
					<article className={styles.serviceCard}>
						<div className={styles.cardBackground}></div>
						<div className={styles.iconWrap}>
							<svg viewBox="0 0 24 24" fill="none">
								<path
									d="M3 13l1.5-4.5A2 2 0 0 1 6.3 7h11.4a2 2 0 0 1 1.8 1.5L21 13"
									stroke="currentColor"
									strokeWidth="1.2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M5 16v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1M17 16v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1"
									stroke="currentColor"
									strokeWidth="1.2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
						<h3>Buy Locally</h3>
						<p>
							Wide selection of new and certified used cars available within
							Algeria — immediate delivery options from Chlef &amp; Jijel
							locations.
						</p>
						<div className={styles.cardHover}></div>
					</article>

					<article className={styles.serviceCard}>
						<div className={styles.cardBackground}></div>
						<div className={styles.iconWrap}>
							<svg viewBox="0 0 24 24" fill="none">
								<path
									d="M4 7h16M4 12h10M4 17h7"
									stroke="currentColor"
									strokeWidth="1.6"
									strokeLinecap="round"
								/>
							</svg>
						</div>
						<h3>Import from China / Qatar / UAE</h3>
						<p>
							We handle the paperwork, shipping, and customs clearance — choose
							a car from our partners or supply your wishlist and we'll source
							it for you.
						</p>
						<div className={styles.flagsRow}>
							<span className={styles.flag}>🇨🇳</span>
							<span className={styles.flag}>🇶🇦</span>
							<span className={styles.flag}>🇦🇪</span>
						</div>
						<div className={styles.cardHover}></div>
					</article>

					<article className={styles.serviceCard}>
						<div className={styles.cardBackground}></div>
						<div className={styles.iconWrap}>
							<svg viewBox="0 0 24 24" fill="none">
								<path
									d="M3 7h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
									stroke="currentColor"
									strokeWidth="1.2"
								/>
								<path
									d="M8 7V5a4 4 0 0 1 8 0v2"
									stroke="currentColor"
									strokeWidth="1.2"
								/>
							</svg>
						</div>
						<h3>Rentals & Leasing</h3>
						<p>
							Short-term and long-term rental plans for individuals and
							businesses. Flexible pickup from any of our offices.
						</p>
						<div className={styles.cardHover}></div>
					</article>

					<article className={styles.serviceCard}>
						<div className={styles.cardBackground}></div>
						<div className={styles.iconWrap}>
							<svg viewBox="0 0 24 24" fill="none">
								<path
									d="M12 2v6"
									stroke="currentColor"
									strokeWidth="1.2"
									strokeLinecap="round"
								/>
								<path
									d="M20 12h-6M4 12h6"
									stroke="currentColor"
									strokeWidth="1.2"
									strokeLinecap="round"
								/>
							</svg>
						</div>
						<h3>After-sales & Support</h3>
						<p>
							Professional assistance with maintenance, warranty claims and
							parts sourcing — we stay with you after the sale.
						</p>
						<div className={styles.cardHover}></div>
					</article>
				</div>
			</section>

			{/* OFFICES */}
			<section className={styles.offices} aria-labelledby="offices-title">
				<div className={styles.sectionHeader}>
					<h2 id="offices-title">Our Offices</h2>
					<p className={styles.sectionSubtitle}>
						Global presence with local expertise
					</p>
				</div>

				<div className={styles.officesGrid}>
					<div className={styles.officeCard}>
						<div className={styles.officeHeader}>
							<h3>Chlef — Algeria</h3>
							<span className={styles.officeLabel}>Main (Sales & Service)</span>
						</div>
						<p className={styles.officeText}>
							Address and contact details go here. In-person inspections and
							test drives available.
						</p>
						<div className={styles.officeImage}>
							<div className={styles.imagePlaceholderSmall}>
								<span>Office Image</span>
							</div>
						</div>
					</div>

					<div className={styles.officeCard}>
						<div className={styles.officeHeader}>
							<h3>Jijel — Algeria</h3>
							<span className={styles.officeLabel}>Local Branch</span>
						</div>
						<p className={styles.officeText}>
							Local stock, quick delivery to nearby cities, and after-sales
							pickup point.
						</p>
						<div className={styles.officeImage}>
							<div className={styles.imagePlaceholderSmall}>
								<span>Office Image</span>
							</div>
						</div>
					</div>

					<div className={styles.officeCard}>
						<div className={styles.officeHeader}>
							<h3>Doha — Qatar</h3>
							<span className={styles.officeLabel}>Regional Hub</span>
						</div>
						<p className={styles.officeText}>
							Coordination with international suppliers and export logistics.
						</p>
						<div className={styles.officeImage}>
							<div className={styles.imagePlaceholderSmall}>
								<span>Office Image</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* WHY CHOOSE US / CTA */}
			<section className={styles.ctaSection} aria-labelledby="cta-title">
				<div className={styles.ctaBackground}></div>
				<div className={styles.ctaInner}>
					<div className={styles.ctaContent}>
						<h2 id="cta-title">Ready to find your next car?</h2>
						<p>
							Whether it's buying locally, importing, or renting — our team at
							ABR_DELUXE Auto makes the process simple and transparent.
						</p>
					</div>
					<div className={styles.ctaActions}>
						<button
							className={styles.primaryBtn}
							onClick={() => router.push("/contact")}
						>
							<span>Contact Sales</span>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
								<path
									d="M5 12H19M19 12L12 5M19 12L12 19"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>
					</div>
				</div>
			</section>
		</main>
	);
}
