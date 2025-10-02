"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import styles from "./header.module.css";
import ThemeToggle from "../ThemeProvider/themeProvider";
import { Car, Menu, X, Phone, MapPin, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CartIcon from "../footer/cart";
import LanguageSwitcher from "../lang/languageSwitcher";
import { useTranslations } from "next-intl";

function Header() {
	const t = useTranslations("Header");
	const router = useRouter();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isServiceOpen, setIsServiceOpen] = useState(false);
	const dropdownRef = useRef(null);

	return (
		<header className={`${styles.header} `}>
			<div className={styles.main_nav}>
				<div className={styles.container}>
					<div className={styles.nav_content}>
						<div className={styles.brand}>
							<div className={styles.logoWrapper}>
								<Image
									src="/images/Logo.png"
									alt="Logo"
									width={180}
									height={100}
									className={styles.logo}
									onClick={() => router.push("/")}
									style={{ cursor: "pointer" }}
								/>
							</div>
						</div>
						<div className={styles.mobile_Cart}>
							<CartIcon />
						</div>

						<div
							className={`${styles.links} ${
								isMenuOpen ? styles.linksOpen : ""
							}`}
						>
							<Link
								href="/home"
								className={styles.link}
								onClick={() => setIsMenuOpen(false)}
							>
								{t("navigation.home")}
							</Link>

							<div
								className={styles.service_container}
								ref={dropdownRef}
								onMouseEnter={() =>
									window.innerWidth > 968 && setIsServiceOpen(true)
								}
								onMouseLeave={() =>
									window.innerWidth > 968 && setIsServiceOpen(false)
								}
							>
								<div
									className={styles.service_trigger}
									onClick={() => setIsServiceOpen(!isServiceOpen)}
								>
									<span>{t("navigation.services")}</span>
									<ChevronDown
										size={16}
										className={`${styles.chevron} ${
											isServiceOpen ? styles.rotate : ""
										}`}
									/>
								</div>

								<div
									className={`${styles.dropdown} ${
										isServiceOpen ? styles.dropdownOpen : ""
									}`}
								>
									<Link
										href="/buy"
										className={styles.dropdown_link}
										onClick={() => {
											setIsMenuOpen(false);
											setIsServiceOpen(false);
										}}
									>
										{t("navigation.buy")}
									</Link>
									<Link
										href="/rent"
										className={styles.dropdown_link}
										onClick={() => {
											setIsMenuOpen(false);
											setIsServiceOpen(false);
										}}
									>
										{t("navigation.rent")}
									</Link>
								</div>
							</div>

							<Link
								href="/contact"
								className={styles.link}
								onClick={() => setIsMenuOpen(false)}
							>
								{t("navigation.contact")}
							</Link>

							<div className={styles.theme_toggle}>
								<ThemeToggle />
							</div>

							{/* Cart Icon for Mobile */}
							<div className={styles.mobile_cart}>
								<LanguageSwitcher />
							</div>
						</div>

						{/* Desktop Cart Icon */}
						<div className={styles.desktop_cart}>
							<CartIcon />
							<LanguageSwitcher />
						</div>
						<div></div>

						<button
							className={styles.menuToggle}
							aria-label={t("aria.toggleMenu")}
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
