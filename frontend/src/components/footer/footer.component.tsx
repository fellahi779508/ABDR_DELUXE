import Link from "next/link";
import styles from "./footer.component.module.css";
import {
	Facebook,
	Instagram,
	Mail,
	MapPin,
	Phone,
	Twitter,
	Youtube,
} from "lucide-react";

function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles.container}>
				<div className={styles.mainContent}>
					<div className={styles.brandSection}>
						<div className={styles.logo}>ABDR_DELUXE</div>
						<p className={styles.description}>
							Concessionnaire automobile haut de gamme offrant la meilleure
							sélection de véhicules de luxe avec un service et une expérience
							client exceptionnels.
						</p>
						<div className={styles.socialLinks}>
							<Link
								href="https://www.facebook.com/profile.php?id=61578296488657"
								aria-label="Facebook"
								className={styles.socialLink}
							>
								<Facebook />
							</Link>
							<Link href="#" aria-label="Twitter" className={styles.socialLink}>
								<Twitter />
							</Link>
							<Link
								href="#"
								aria-label="Instagram"
								className={styles.socialLink}
							>
								<Instagram />
							</Link>
							<a href="#" aria-label="YouTube" className={styles.socialLink}>
								<Youtube />
							</a>
						</div>
					</div>

					<div className={styles.linksSection}>
						<h3 className={styles.sectionTitle}>Liens rapides</h3>
						<ul className={styles.linkList}>
							<li>
								<Link href="/" className={styles.footerLink}>
									Accueil
								</Link>
							</li>
							<li>
								<Link href="/cars" className={styles.footerLink}>
									Voitures
								</Link>
							</li>
							<li>
								<Link href="/about" className={styles.footerLink}>
									À propos
								</Link>
							</li>
						</ul>
					</div>

					<div className={styles.contactSection}>
						<h3 className={styles.sectionTitle}>Contactez-nous</h3>
						<div className={styles.contactInfo}>
							<div className={styles.contactItem}>
								<Mail />
								<span>contact@abdrdeluxe.com</span>
							</div>
							<div className={styles.contactItem}>
								<Phone />
								<span>+1 (555) 123-4567</span>
							</div>
							<div className={styles.contactItem}>
								<MapPin />
								<span>123 Avenue du Luxe, Ville Premium, PC 90210</span>
							</div>
						</div>
					</div>
				</div>

				<div className={styles.bottomBar}>
					<div className={styles.copyright}>
						&copy; {new Date().getFullYear()} ABDR_DELUXE. Tous droits réservés.
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
