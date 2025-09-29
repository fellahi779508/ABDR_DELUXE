"use client";
import React, { useState, useEffect } from "react";
import styles from "./home.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function HomeComponent() {
	const [isVisible, setIsVisible] = useState(false);
	const router = useRouter();
	const t = useTranslations("Home");

	useEffect(() => {
		setIsVisible(true);
	}, []);

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
							<span className={styles.badge}>{t("hero.badge")}</span>
							<div className={styles.badgeGlow}></div>
						</div>
						<h1 id="hero-title">
							<span className={styles.titleLine}>{t("hero.title1")}</span>
							<span className={styles.titleLine}>{t("hero.title2")}</span>
						</h1>
						<p className={styles.lead}>{t("hero.lead")}</p>

						<div className={styles.heroActions}>
							<button
								className={styles.primaryBtn}
								onClick={() => router.push("/buy")}
							>
								<span>{t("hero.button")}</span>
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
								<div className={styles.statNumber}>
									{t("hero.stats.brands.number")}
								</div>
								<div className={styles.statLabel}>
									{t("hero.stats.brands.label")}
								</div>
							</div>
							<div className={styles.statItem}>
								<div className={styles.statNumber}>
									{t("hero.stats.cars.number")}
								</div>
								<div className={styles.statLabel}>
									{t("hero.stats.cars.label")}
								</div>
							</div>
							<div className={styles.statItem}>
								<div className={styles.statNumber}>
									{t("hero.stats.offices.number")}
								</div>
								<div className={styles.statLabel}>
									{t("hero.stats.offices.label")}
								</div>
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

			{/* SERVICES */}
			<section className={styles.services} aria-labelledby="services-title">
				<div className={styles.sectionHeader}>
					<h2 id="services-title">{t("services.title")}</h2>
					<p className={styles.sectionSubtitle}>{t("services.subtitle")}</p>
				</div>

				<div className={styles.serviceGrid}>
					<article className={styles.serviceCard}>
						<div className={styles.cardBackground}></div>
						<div className={styles.iconWrap}>
							<svg viewBox="0 0 24 24" fill="none">
								{" "}
								<path
									d="M3 13l1.5-4.5A2 2 0 0 1 6.3 7h11.4a2 2 0 0 1 1.8 1.5L21 13"
									stroke="currentColor"
									strokeWidth="1.2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>{" "}
								<path
									d="M5 16v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1M17 16v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1"
									stroke="currentColor"
									strokeWidth="1.2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>{" "}
							</svg>
						</div>
						<h3>{t("services.buy.title")}</h3>
						<p>{t("services.buy.description")}</p>
						<div className={styles.cardHover}></div>
					</article>

					<article className={styles.serviceCard}>
						<div className={styles.cardBackground}></div>
						<div className={styles.iconWrap}>
							<svg viewBox="0 0 24 24" fill="none">
								{" "}
								<path
									d="M4 7h16M4 12h10M4 17h7"
									stroke="currentColor"
									strokeWidth="1.6"
									strokeLinecap="round"
								/>{" "}
							</svg>
						</div>
						<h3>{t("services.import.title")}</h3>
						<p>{t("services.import.description")}</p>
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
								{" "}
								<path
									d="M3 7h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
									stroke="currentColor"
									strokeWidth="1.2"
								/>{" "}
								<path
									d="M8 7V5a4 4 0 0 1 8 0v2"
									stroke="currentColor"
									strokeWidth="1.2"
								/>{" "}
							</svg>
						</div>
						<h3>{t("services.rent.title")}</h3>
						<p>{t("services.rent.description")}</p>
						<div className={styles.cardHover}></div>
					</article>

					<article className={styles.serviceCard}>
						<div className={styles.cardBackground}></div>
						<div className={styles.iconWrap}>
							<svg viewBox="0 0 24 24" fill="none">
								{" "}
								<path
									d="M12 2v6"
									stroke="currentColor"
									strokeWidth="1.2"
									strokeLinecap="round"
								/>{" "}
								<path
									d="M20 12h-6M4 12h6"
									stroke="currentColor"
									strokeWidth="1.2"
									strokeLinecap="round"
								/>{" "}
							</svg>
						</div>
						<h3>{t("services.support.title")}</h3>
						<p>{t("services.support.description")}</p>
						<div className={styles.cardHover}></div>
					</article>
				</div>
			</section>

			{/* OFFICES */}
			<section className={styles.offices} aria-labelledby="offices-title">
				<div className={styles.sectionHeader}>
					<h2 id="offices-title">{t("offices.title")}</h2>
					<p className={styles.sectionSubtitle}>{t("offices.subtitle")}</p>
				</div>

				<div className={styles.officesGrid}>
					<div className={styles.officeCard}>
						<div className={styles.officeHeader}>
							<h3>{t("offices.chlef.title")}</h3>
							<span className={styles.officeLabel}>
								{t("offices.chlef.label")}
							</span>
						</div>
						<p className={styles.officeText}>
							{t("offices.chlef.description")}
						</p>
						<div className={styles.officeImage}>
							<div className={styles.imagePlaceholderSmall}>
								<Image
									src="/main/chlef.JPG"
									alt="Office Image"
									width={1000}
									height={1000}
								/>
							</div>
						</div>
					</div>

					<div className={styles.officeCard}>
						<div className={styles.officeHeader}>
							<h3>{t("offices.jijel.title")}</h3>
							<span className={styles.officeLabel}>
								{t("offices.jijel.label")}
							</span>
						</div>
						<p className={styles.officeText}>
							{t("offices.jijel.description")}
						</p>
						<div className={styles.officeImage}>
							<div className={styles.imagePlaceholderSmall}>
								<Image
									src="/main/jijel.JPG"
									alt="Office Image"
									width={600}
									height={600}
								/>
							</div>
						</div>
					</div>

					<div className={styles.officeCard}>
						<div className={styles.officeHeader}>
							<h3>{t("offices.doha.title")}</h3>
							<span className={styles.officeLabel}>
								{t("offices.doha.label")}
							</span>
						</div>
						<p className={styles.officeText}>{t("offices.doha.description")}</p>
						<div className={styles.officeImage}>
							<div className={styles.imagePlaceholderSmall}>
								<Image
									src="/main/quatar.JPG"
									alt="Office Image"
									width={600}
									height={600}
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className={styles.ctaSection} aria-labelledby="cta-title">
				<div className={styles.ctaBackground}></div>
				<div className={styles.ctaInner}>
					<div className={styles.ctaContent}>
						<h2 id="cta-title">{t("cta.title")}</h2>
						<p>{t("cta.description")}</p>
					</div>
					<div className={styles.ctaActions}>
						<button
							className={styles.primaryBtn}
							onClick={() => router.push("/contact")}
						>
							<span>{t("cta.button")}</span>
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
