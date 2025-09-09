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
							Premium car dealership offering the finest selection of luxury
							vehicles with exceptional service and customer experience.
						</p>
						<div className={styles.socialLinks}>
							<a href="#" aria-label="Facebook" className={styles.socialLink}>
								<Facebook />
							</a>
							<a href="#" aria-label="Twitter" className={styles.socialLink}>
								<Twitter />
							</a>
							<a href="#" aria-label="Instagram" className={styles.socialLink}>
								<Instagram />
							</a>
							<a href="#" aria-label="YouTube" className={styles.socialLink}>
								<Youtube />
							</a>
						</div>
					</div>

					<div className={styles.linksSection}>
						<h3 className={styles.sectionTitle}>Quick Links</h3>
						<ul className={styles.linkList}>
							<li>
								<Link href="/" className={styles.footerLink}>
									Home
								</Link>
							</li>
							<li>
								<Link href="/cars" className={styles.footerLink}>
									Cars
								</Link>
							</li>
							<li>
								<Link href="/about" className={styles.footerLink}>
									About
								</Link>
							</li>
							<li>
								<Link href="/contact" className={styles.footerLink}>
									Contact
								</Link>
							</li>
							<li>
								<Link href="/testimonials" className={styles.footerLink}>
									Testimonials
								</Link>
							</li>
						</ul>
					</div>

					<div className={styles.contactSection}>
						<h3 className={styles.sectionTitle}>Contact Us</h3>
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
								<span>123 Luxury Avenue, Premium City, PC 90210</span>
							</div>
						</div>
					</div>
				</div>

				<div className={styles.bottomBar}>
					<div className={styles.copyright}>
						&copy; {new Date().getFullYear()} ABDR_DELUXE. All rights reserved.
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
