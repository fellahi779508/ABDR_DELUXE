/* eslint-disable react/no-unescaped-entities */
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
			<section className={`${styles.hero} ${isVisible ? styles.visible : ""}`}>
				<div className={styles.heroContent}>
					<div className={styles.heroLeft}>
						<div className={styles.badge}>
							<span style={{ color: "var(--primary)" }}>ABR</span>
							<span style={{ color: "var(--text)" }}>DELUXE</span>
							<span style={{ color: "var(--primary)" }}>AUTO</span>
						</div>

						<h1>{t("hero.title")}</h1>
						<p className={styles.lead}>{t("hero.subtitle")}</p>

						<div className={styles.heroActions}>
							<button
								className={styles.primaryBtn}
								onClick={() => router.push("/buy")}
							>
								{t("hero.browseCars")}
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
									<path
										d="M5 12H19M19 12L12 5M19 12L12 19"
										stroke="currentColor"
										strokeWidth="2"
									/>
								</svg>
							</button>
							<button
								className={styles.ghostBtn}
								onClick={() => router.push("/contact")}
							>
								{t("hero.contactUs")}
							</button>
						</div>
					</div>

					<div className={styles.heroRight}>
						<div className={styles.imageContainer}>
							<Image
								src={"/images/homeHero.jpg"}
								alt="Luxury cars at ABR Deluxe Auto"
								className={styles.mainImage}
								priority
								width={1000}
								height={1000}
							/>
						</div>
					</div>
				</div>
			</section>

			{/* ABOUT */}
			<section className={styles.about}>
				<div className={styles.aboutContent}>
					<div className={styles.aboutText}>
						<h2>{t("about.title")}</h2>
						<p>{t("about.p1")}</p>
						<p>{t("about.p2")}</p>
						<p>{t("about.p3")}</p>
						<p>{t("about.p4")}</p>
						<p>{t("about.p5")}</p>
					</div>

					<div className={styles.missionGrid}>
						<div className={styles.missionCard}>
							<h3>{t("about.visionTitle")}</h3>
							<p>{t("about.visionText")}</p>
						</div>
						<div className={styles.missionCard}>
							<h3>{t("about.missionTitle")}</h3>
							<p>{t("about.missionText")}</p>
						</div>
					</div>

					<div className={styles.values}>
						<h3>{t("about.valuesTitle")}</h3>
						<div className={styles.valuesGrid}>
							<div className={styles.valueItem}>
								<span className={styles.valueIcon}>✓</span>
								<span>{t("about.values.integrity")}</span>
							</div>
							<div className={styles.valueItem}>
								<span className={styles.valueIcon}>✓</span>
								<span>{t("about.values.excellence")}</span>
							</div>
							<div className={styles.valueItem}>
								<span className={styles.valueIcon}>✓</span>
								<span>{t("about.values.innovation")}</span>
							</div>
							<div className={styles.valueItem}>
								<span className={styles.valueIcon}>✓</span>
								<span>{t("about.values.customer")}</span>
							</div>
							<div className={styles.valueItem}>
								<span className={styles.valueIcon}>✓</span>
								<span>{t("about.values.sustainability")}</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* SERVICES */}
			<section className={styles.services}>
				<div className={styles.sectionHeader}>
					<h2>{t("services.title")}</h2>
					<p>{t("services.subtitle")}</p>
				</div>

				<div className={styles.serviceGrid}>
					<div className={styles.serviceCard}>
						<div className={styles.serviceIcon}>🚗</div>
						<h3>{t("services.salesTitle")}</h3>
						<p>{t("services.salesText")}</p>
					</div>

					<div className={styles.serviceCard}>
						<div className={styles.serviceIcon}>⭐</div>
						<h3>{t("services.rentalsTitle")}</h3>
						<p>{t("services.rentalsText")}</p>
					</div>

					<div className={styles.serviceCard}>
						<div className={styles.serviceIcon}>🌍</div>
						<h3>{t("services.importTitle")}</h3>
						<p>{t("services.importText")}</p>
					</div>

					<div className={styles.serviceCard}>
						<div className={styles.serviceIcon}>🏢</div>
						<h3>{t("services.fleetTitle")}</h3>
						<p>{t("services.fleetText")}</p>
					</div>

					<div className={styles.serviceCard}>
						<div className={styles.serviceIcon}>🔧</div>
						<h3>{t("services.supportTitle")}</h3>
						<p>{t("services.supportText")}</p>
					</div>
				</div>
			</section>

			{/* OFFICES */}
			<section className={styles.offices}>
				<div className={styles.sectionHeader}>
					<h2>{t("offices.title")}</h2>
					<p>{t("offices.subtitle")}</p>
				</div>

				<div className={styles.officesGrid}>
					<div className={styles.officeCard}>
						<div className={styles.officeImage}>
							<Image
								src="/main/chlef.JPG"
								alt="Chlef Office"
								width={400}
								height={250}
							/>
						</div>
						<div className={styles.officeInfo}>
							<h3>{t("offices.chlefTitle")}</h3>
							<span className={styles.officeBadge}>
								{t("offices.chlefBadge")}
							</span>
							<p>{t("offices.chlefText")}</p>
						</div>
					</div>

					<div className={styles.officeCard}>
						<div className={styles.officeImage}>
							<Image
								src="/main/jijel.JPG"
								alt="Jijel Office"
								width={400}
								height={250}
							/>
						</div>
						<div className={styles.officeInfo}>
							<h3>{t("offices.jijelTitle")}</h3>
							<span className={styles.officeBadge}>
								{t("offices.jijelBadge")}
							</span>
							<p>{t("offices.jijelText")}</p>
						</div>
					</div>

					<div className={styles.officeCard}>
						<div className={styles.officeImage}>
							<Image
								src="/main/quatar.JPG"
								alt="Doha Office"
								width={400}
								height={250}
							/>
						</div>
						<div className={styles.officeInfo}>
							<h3>{t("offices.dohaTitle")}</h3>
							<span className={styles.officeBadge}>
								{t("offices.dohaBadge")}
							</span>
							<p>{t("offices.dohaText")}</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className={styles.cta}>
				<div className={styles.ctaContent}>
					<h2>{t("cta.title")}</h2>
					<p>{t("cta.subtitle")}</p>
					<button
						className={styles.primaryBtn}
						onClick={() => router.push("/contact")}
					>
						{t("cta.button")}
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
							<path
								d="M5 12H19M19 12L12 5M19 12L12 19"
								stroke="currentColor"
								strokeWidth="2"
							/>
						</svg>
					</button>
				</div>
			</section>
		</main>
	);
}
