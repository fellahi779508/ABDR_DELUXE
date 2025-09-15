import Image from "next/image";
import Link from "next/link";
import styles from "./main.module.css";

function Main() {
	return (
		<div className={styles.container}>
			{/* Section 1: Bienvenue */}
			<section className={`${styles.section} ${styles.s1}`}>
				<div className={styles.sectionContent}>
					<div className={styles.imageContainer}>
						<Image
							src="/main/section1.jpg"
							alt="Voitures de luxe dans notre concession"
							width={600}
							height={400}
							className={styles.image}
							priority
						/>
					</div>
					<div className={styles.textContent}>
						<h1 className={styles.mainTitle}>Bienvenue chez ABR_DELUXE</h1>
						<p className={styles.description}>
							Découvrez la voiture de vos rêves parmi notre collection exclusive
							de véhicules de luxe. Profitez d’un service inégalé et d’une
							qualité qui nous distingue.
						</p>
						<Link href="/cars" className={styles.ctaButton}>
							Explorer l’inventaire
						</Link>
					</div>
				</div>
			</section>

			{/* Section 2: Comment ça marche */}
			<section className={`${styles.section} ${styles.s2}`}>
				<div className={styles.sectionContent}>
					<div className={styles.textContent}>
						<h2 className={styles.sectionTitle}>
							Comment fonctionne notre processus de commande
						</h2>
						<ol className={styles.processList}>
							<li className={styles.processStep}>
								<span className={styles.stepNumber}>1</span>
								<div className={styles.stepContent}>
									<h3>Soumettez votre commande</h3>
									<p>
										Choisissez le véhicule de votre choix et les options de
										personnalisation
									</p>
								</div>
							</li>
							<li className={styles.processStep}>
								<span className={styles.stepNumber}>2</span>
								<div className={styles.stepContent}>
									<h3>Nous vous contactons</h3>
									<p>
										Un de nos conseillers commerciaux vous contactera sous 24
										heures
									</p>
								</div>
							</li>
							<li className={styles.processStep}>
								<span className={styles.stepNumber}>3</span>
								<div className={styles.stepContent}>
									<h3>Finalisez les détails</h3>
									<p>
										Complétez les formalités administratives et organisez la
										livraison
									</p>
								</div>
							</li>
						</ol>
					</div>
					<div className={styles.imageContainer}>
						<Image
							src="/main/section2.jpg"
							alt="Processus de commande d’une voiture"
							width={500}
							height={500}
							className={styles.image}
						/>
					</div>
				</div>
			</section>

			{/* Section 3: À propos de nous */}
			<section className={`${styles.section} ${styles.s3}`}>
				<div className={styles.sectionContent}>
					<div className={styles.imageContainer}>
						<Image
							src="/main/section3.jpg"
							alt="Notre équipe de concession"
							width={550}
							height={400}
							className={styles.image}
						/>
					</div>
					<div className={styles.textContent}>
						<h2 className={styles.sectionTitle}>À propos de ABR_DELUXE</h2>
						<p className={styles.description}>
							Nous sommes fiers de proposer des véhicules exceptionnels et un
							service client irréprochable. Notre équipe expérimentée est dédiée
							à vous aider à trouver la voiture parfaite.
						</p>
						<Link href="/about" className={styles.ctaButton}>
							En savoir plus sur nous
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}

export default Main;
