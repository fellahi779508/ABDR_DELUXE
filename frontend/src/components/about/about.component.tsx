/* eslint-disable react/no-unescaped-entities */
import styles from "./about.module.css";
import { useTranslations } from "next-intl";

function AboutComponent() {
	const t = useTranslations("About.about");

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<div className={styles.headerContent}>
					<h1 className={styles.title}>{t("header.title")}</h1>
					<p className={styles.subtitle}>{t("header.subtitle")}</p>
					<div className={styles.accentLine}></div>
				</div>
			</header>

			<main className={styles.main}>
				<section className={styles.videoSection}>
					<div className={styles.videoContainer}>
						<div className={styles.sectionHeader}>
							<h2 className={styles.sectionTitle}>
								{t("sections.companyIntro.title")}
							</h2>
							<p className={styles.sectionDescription}>
								{t("sections.companyIntro.description")}
							</p>
						</div>
						<div className={styles.videoWrapper}>
							<video
								className={styles.video}
								controls
								poster="/videos/video1-poster.png"
							>
								<source src="/videos/video1.mp4" type="video/mp4" />
								{t("video.fallback")}
							</video>
							<div className={styles.videoOverlay}></div>
						</div>
					</div>
				</section>

				<section className={styles.videoSection}>
					<div className={styles.videoContainer}>
						<div className={styles.sectionHeader}>
							<h2 className={styles.sectionTitle}>
								{t("sections.deliveryProcess.title")}
							</h2>
							<p className={styles.sectionDescription}>
								{t("sections.deliveryProcess.description")}
							</p>
						</div>
						<div className={styles.videoWrapper}>
							<video
								className={styles.video}
								controls
								poster="/videos/video2-poster.png"
							>
								<source src="/videos/video2.mp4" type="video/mp4" />
								{t("video.fallback")}
							</video>
							<div className={styles.videoOverlay}></div>
						</div>
					</div>
				</section>

				<section className={styles.infoSection}>
					<div className={styles.sectionHeader}>
						<h2 className={styles.infoTitle}>
							{t("sections.whyChooseUs.title")}
						</h2>
						<p className={styles.infoSubtitle}>
							{t("sections.whyChooseUs.subtitle")}
						</p>
					</div>
					<div className={styles.features}>
						<div className={styles.feature}>
							<div className={styles.featureIconContainer}>
								<div className={styles.featureIcon}>✓</div>
							</div>
							<h3>
								{t("sections.whyChooseUs.features.personalizedService.title")}
							</h3>
							<p>
								{t(
									"sections.whyChooseUs.features.personalizedService.description"
								)}
							</p>
						</div>
						<div className={styles.feature}>
							<div className={styles.featureIconContainer}>
								<div className={styles.featureIcon}>✓</div>
							</div>
							<h3>{t("sections.whyChooseUs.features.luxuryVehicles.title")}</h3>
							<p>
								{t("sections.whyChooseUs.features.luxuryVehicles.description")}
							</p>
						</div>
						<div className={styles.feature}>
							<div className={styles.featureIconContainer}>
								<div className={styles.featureIcon}>✓</div>
							</div>
							<h3>
								{t("sections.whyChooseUs.features.exceptionalDelivery.title")}
							</h3>
							<p>
								{t(
									"sections.whyChooseUs.features.exceptionalDelivery.description"
								)}
							</p>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}

export default AboutComponent;
