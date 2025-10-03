"use client";
import Link from "next/link";
import styles from "./footer.component.module.css";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

function Footer() {
	const t = useTranslations("Footer");
	const year = new Date().getFullYear();
	const brand = "ABR DELUXE AUTO";

	return (
		<footer className={styles.footer}>
			<div className={styles.container}>
				<div className={styles.mainContent}>
					<div className={styles.brandSection}>
						<div className={styles.logo}>
							<span style={{ color: "var(--primary)" }}>ABR</span>
							<span style={{ color: "var(--text)" }}>DELUXE</span>
							<span style={{ color: "var(--primary)" }}>AUTO</span>
						</div>
						<p className={styles.description}>{t("description")}</p>
						<div className={styles.socialLinks}>
							<Link
								href="https://www.facebook.com/profile.php?id=61578296488657"
								aria-label="Facebook"
								className={styles.socialLink}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Image
									src="/images/facebook.png"
									alt="facebook"
									width={28}
									height={28}
								/>
							</Link>
							<Link
								href="https://www.instagram.com/abr_deluxe_auto"
								aria-label="Instagram"
								className={styles.socialLink}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Image
									src="/images/insta.png"
									alt="Instagram"
									width={24}
									height={24}
								/>
							</Link>
							<Link
								href="https://www.tiktok.com/@abrdeluxeautochina?_t=ZS-8ziobk4aG0o&_r=1"
								aria-label="Tiktok"
								className={styles.socialLink}
								target="_blank"
								rel="noopener noreferrer"
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
						<h3 className={styles.sectionTitle}>{t("links.title")}</h3>
						<ul className={styles.linkList}>
							<li>
								<Link href="/" className={styles.footerLink}>
									{t("links.home")}
								</Link>
							</li>
							<li>
								<Link href="/buy" className={styles.footerLink}>
									{t("links.buy")}
								</Link>
							</li>
							<li>
								<Link href="/rent" className={styles.footerLink}>
									{t("links.rent")}
								</Link>
							</li>
							<li>
								<Link href="/contact" className={styles.footerLink}>
									{t("links.contact")}
								</Link>
							</li>
							<li>
								<Link href="/about" className={styles.footerLink}>
									{t("links.about")}
								</Link>
							</li>
						</ul>
					</div>

					<div className={styles.contactSection}>
						<h3 className={styles.sectionTitle}>{t("contact.title")}</h3>
						<div className={styles.contactInfo}>
							<div className={styles.contactItem}>
								<Mail />
								<Link href={`mailto:${t("contact.email")}`}>
									{t("contact.email")}
								</Link>
							</div>
							<div className={styles.contactItem}>
								<Phone />
								<Link href="/contact" target="_blank" rel="noopener noreferrer">
									contact
								</Link>
							</div>
							<Link
								href="https://maps.app.goo.gl/eNhG4sJcpDcArbhv9?g_st=ipc"
								className={styles.contactItem}
								target="_blank"
								rel="noopener noreferrer"
							>
								<MapPin />
								<span>Chlef</span>
							</Link>
							<Link
								href="https://maps.app.goo.gl/DdgPyHgVq6AtJX566?g_st=ipc"
								className={styles.contactItem}
								target="_blank"
								rel="noopener noreferrer"
							>
								<MapPin />
								<span>Jijel</span>
							</Link>
						</div>
					</div>
				</div>

				<div className={styles.bottomBar}>
					<div className={styles.copyright}>
						&copy; {year} {brand}. {t("copyright")}
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
