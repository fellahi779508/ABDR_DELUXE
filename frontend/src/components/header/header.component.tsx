"use client";
import Link from "next/link";
import { useState } from "react";
import styles from "./header.module.css";
import ThemeToggle from "../ThemeProvider/themeProvider";
import { Car, Menu, X, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

function Header() {
	const router = useRouter();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	return (
		<header className={`${styles.header} `}>
			<div className={styles.top_bar}>
				<div className={styles.container}>
					<div className={styles.top_content}>
						<div className={styles.contact_info}>
							{/* <div className={styles.contact_item}>
								<Phone size={16} />
								<span>+213 555 123 456</span>
							</div> */}
							<div className={styles.contact_item}>
								<MapPin size={16} />
								<span>Chlef, Jijel, Bouira</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className={styles.main_nav}>
				<div className={styles.container}>
					<div className={styles.nav_content}>
						<div className={styles.brand}>
							<button
								className={styles.logoLink}
								onClick={() => router.push("/")}
							>
								<Image
									src="/main/abr deluxe.png"
									alt="Logo"
									width={250}
									height={80}
									className={styles.logo}
								/>
							</button>
						</div>

						<div
							className={`${styles.links} ${
								isMenuOpen ? styles.linksOpen : ""
							}`}
						>
							<Link
								href="/"
								className={styles.link}
								onClick={() => setIsMenuOpen(false)}
							>
								Accueil
							</Link>
							<Link
								href="/about"
								className={styles.link}
								onClick={() => setIsMenuOpen(false)}
							>
								À propos
							</Link>

							<Link href="/cars" className={styles.cta_button}>
								Voir les voitures
							</Link>
							<div className={styles.theme_toggle}>
								<ThemeToggle />
							</div>
						</div>

						<button
							className={styles.menuToggle}
							aria-label="Basculer le menu"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>
			</div>
		</header>
	);
}

export default Header;
