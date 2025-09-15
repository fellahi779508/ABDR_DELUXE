/* eslint-disable react/no-unescaped-entities */
import styles from "./about.module.css";

function AboutComponent() {
	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<div className={styles.headerContent}>
					<h1 className={styles.title}>ABR Deluxe</h1>
					<p className={styles.subtitle}>L'excellence automobile depuis 2005</p>
					<div className={styles.accentLine}></div>
				</div>
			</header>

			<main className={styles.main}>
				<section className={styles.videoSection}>
					<div className={styles.videoContainer}>
						<div className={styles.sectionHeader}>
							<h2 className={styles.sectionTitle}>
								Présentation de Notre Entreprise
							</h2>
							<p className={styles.sectionDescription}>
								Découvrez l'histoire et les valeurs qui font d'Abr Deluxe un
								leader dans le secteur automobile de luxe.
							</p>
						</div>
						<div className={styles.videoWrapper}>
							<video
								className={styles.video}
								controls
								poster="/videos/video1-poster.png"
							>
								<source src="/videos/video1.mp4" type="video/mp4" />
								Votre navigateur ne supporte pas la lecture de vidéos.
							</video>
							<div className={styles.videoOverlay}></div>
						</div>
					</div>
				</section>

				<section className={styles.videoSection}>
					<div className={styles.videoContainer}>
						<div className={styles.sectionHeader}>
							<h2 className={styles.sectionTitle}>
								Notre Processus de Livraison
							</h2>
							<p className={styles.sectionDescription}>
								Voyez comment notre propriétaire garantit une expérience de
								livraison exceptionnelle pour chaque client.
							</p>
						</div>
						<div className={styles.videoWrapper}>
							<video
								className={styles.video}
								controls
								poster="/videos/video2-poster.png"
							>
								<source src="/videos/video2.mp4" type="video/mp4" />
								Votre navigateur ne supporte pas la lecture de vidéos.
							</video>
							<div className={styles.videoOverlay}></div>
						</div>
					</div>
				</section>

				<section className={styles.infoSection}>
					<div className={styles.sectionHeader}>
						<h2 className={styles.infoTitle}>Pourquoi Nous Choisir?</h2>
						<p className={styles.infoSubtitle}>
							Découvrez les avantages exclusifs qui nous distinguent de la
							concurrence
						</p>
					</div>
					<div className={styles.features}>
						<div className={styles.feature}>
							<div className={styles.featureIconContainer}>
								<div className={styles.featureIcon}>✓</div>
							</div>
							<h3>Service Personnalisé</h3>
							<p>
								Une attention particulière à chaque client pour répondre à ses
								besoins spécifiques.
							</p>
						</div>
						<div className={styles.feature}>
							<div className={styles.featureIconContainer}>
								<div className={styles.featureIcon}>✓</div>
							</div>
							<h3>Véhicules de Luxe</h3>
							<p>
								Une sélection rigoureuse des meilleurs modèles premium du
								marché.
							</p>
						</div>
						<div className={styles.feature}>
							<div className={styles.featureIconContainer}>
								<div className={styles.featureIcon}>✓</div>
							</div>
							<h3>Livraison Exceptionnelle</h3>
							<p>
								Un processus de livraison qui respecte les plus hauts standards
								de qualité.
							</p>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}

export default AboutComponent;
