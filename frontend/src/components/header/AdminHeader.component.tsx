"use client";
import Link from "next/link";
import { useState, useRef } from "react";
import styles from "./header.module.css";
import ThemeToggle from "../ThemeProvider/themeProvider";
import { Car, Menu, X, Phone, MapPin, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

function AdminHeader() {
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
								onClick={() => router.push("/admin/dashboard")}
							>
								<span className={styles.logoText}>ABR_DELUXE Admin</span>
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
								Main Site
							</Link>

							<Link
								href="/admin/dashboard/orders"
								className={styles.link}
								onClick={() => setIsMenuOpen(false)}
							>
								Orders
							</Link>
							<Link
								href="/admin/dashboard/cars"
								className={styles.link}
								onClick={() => setIsMenuOpen(false)}
							>
								Cars
							</Link>

							<div className={styles.theme_toggle}>
								<ThemeToggle />
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
			</div>
		</header>
	);
}

export default AdminHeader;
