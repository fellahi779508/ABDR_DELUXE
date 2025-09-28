"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import styles from "./header.module.css";
import ThemeToggle from "../ThemeProvider/themeProvider";
import { Car, Menu, X, Phone, MapPin, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CartIcon from "../footer/cart"; // Import the CartIcon component

function Header() {
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
							<button
								className={styles.logoLink}
								onClick={() => router.push("/")}
							>
								<span className={styles.logoText}>ABR_DELUXE Auto</span>
							</button>
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
								Home
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
									<span>Service</span>
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
										Buy
									</Link>
									<Link
										href="/rent"
										className={styles.dropdown_link}
										onClick={() => {
											setIsMenuOpen(false);
											setIsServiceOpen(false);
										}}
									>
										Rent
									</Link>
								</div>
							</div>

							<Link
								href="/contact"
								className={styles.link}
								onClick={() => setIsMenuOpen(false)}
							>
								Contact
							</Link>

							<div className={styles.theme_toggle}>
								<ThemeToggle />
							</div>

							{/* Cart Icon for Mobile */}
							<div className={styles.mobile_cart}>
								<CartIcon />
							</div>
						</div>

						{/* Desktop Cart Icon */}
						<div className={styles.desktop_cart}>
							<CartIcon />
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
