"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import styles from "./header.module.css";
import ThemeToggle from "../ThemeProvider/themeProvider";
import { Car, Menu, X, Phone, MapPin, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

function Header() {
	const router = useRouter();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isServiceOpen, setIsServiceOpen] = useState(false);
	const dropdownRef = useRef(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: { target: any }) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsServiceOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<header className={`${styles.header} `}>
			<div className={styles.top_bar}>
				<div className={styles.container}>
					<div className={styles.top_content}>
						<div className={styles.contact_info}>
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
								{/* <Image
                  src="/main/abr deluxe.png"
                  alt="Logo"
                  width={250}
                  height={80}
                  className={styles.logo}
                /> */}
								<span className={styles.logoText}>ABR_DELUXE Auto</span>
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
