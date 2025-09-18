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
import Image from "next/image";

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
							<Link
								href="https://www.instagram.com/abr_delux_auto"
								aria-label="Instagram"
								className={styles.socialLink}
							>
								<Instagram />
							</Link>
							<Link
								href="https://www.tiktok.com/@abrdeluxeautochina?_t=ZS-8ziobk4aG0o&_r=1"
								aria-label="YouTube"
								className={styles.socialLink}
							>
								<Image
									src="/images/tik-tok.png"
									alt="Tiktok"
									width={24}
									height={24}
								/>
							</Link>
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
								<span>Dz:</span>
								<a href="tel:+213 77 22 78 102">+213 77 22 78 102</a>
							</div>
							<div className={styles.contactItem}>
								<Phone />
								<span>Qa:</span>
								<a href="tel:+974 77 00 55 29">+974 77 00 55 29</a>
							</div>
							<div className={styles.contactItem}>
								<MapPin />
								<span>Chlef, Jijel, Bouira</span>
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
