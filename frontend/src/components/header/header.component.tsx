"use client";
import Link from "next/link";
import { useState } from "react";
import styles from "./header.module.css";
import ThemeToggle from "../ThemeProvider/themeProvider";
import { Car, Menu, X, Phone, MapPin } from "lucide-react";
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
							<div className={styles.contact_item}>
								<Phone size={16} />
								<span>+213 555 123 456</span>
							</div>
							<div className={styles.contact_item}>
								<MapPin size={16} />
								<span>Algiers, Algeria</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className={styles.main_nav}>
				<div className={styles.container}>
					<div className={styles.nav_content}>
						<div className={styles.brand}>
							<Link href="/" className={styles.logoLink}>
								<Car size={32} className={styles.logo_icon} />
								<span className={styles.logo}>ABDR_DELUXE</span>
							</Link>
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
								Home
							</Link>
							<Link
								href="/about"
								className={styles.link}
								onClick={() => setIsMenuOpen(false)}
							>
								About
							</Link>
							<Link
								href="/contact"
								className={styles.link}
								onClick={() => setIsMenuOpen(false)}
							>
								Contact
							</Link>
							<button
								className={styles.cta_button}
								onClick={() => router.push("/cars")}
							>
								Browse Cars
							</button>
							<div className={styles.theme_toggle}>
								<ThemeToggle />
							</div>
						</div>

						<button
							className={styles.menuToggle}
							aria-label="Toggle menu"
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
