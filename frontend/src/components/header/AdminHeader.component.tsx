"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import styles from "./header.module.css";
import ThemeToggle from "../ThemeProvider/themeProvider";
import { Car, Menu, X, Phone, MapPin, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import { toast, ToastContainer } from "react-toastify";
import Image from "next/image";

function AdminHeader() {
	const router = useRouter();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isServiceOpen, setIsServiceOpen] = useState(false);
	const [newOrdersCount, setNewOrdersCount] = useState(0);
	const dropdownRef = useRef(null);

	// Use socket to listen for new orders
	useSocket("orderCreated", async () => {
		toast.success("New order alert");
		setNewOrdersCount((prev) => prev + 1);
	});

	// Reset count when visiting orders page
	const handleOrdersClick = () => {
		setNewOrdersCount(0);
		setIsMenuOpen(false);
	};

	return (
		<header className={`${styles.header} `}>
			<div className={styles.main_nav}>
				<div className={styles.container}>
					<div className={styles.nav_content}>
						<div className={styles.brand}>
							<div className={styles.logoWrapper}>
								<Image
									src="/images/logo.png"
									alt="logo"
									width={180}
									height={100}
									className={styles.logo}
									onClick={() => router.push("/0218213/dashboard")}
									style={{ cursor: "pointer" }}
								/>
							</div>
						</div>

						<div
							className={`${styles.links} ${
								isMenuOpen ? styles.linksOpen : ""
							}`}
						>
							<div className={styles.linkWithBadge}>
								<Link
									href="/0218213/dashboard/orders"
									className={styles.link}
									onClick={handleOrdersClick}
								>
									Orders
									{newOrdersCount > 0 && (
										<span className={styles.notificationBadge}>
											{newOrdersCount}
										</span>
									)}
								</Link>
							</div>

							<Link
								href="/0218213/dashboard/cars"
								className={styles.link}
								onClick={() => setIsMenuOpen(false)}
							>
								Cars
							</Link>
							<Link
								href="/0218213/dashboard/promotions"
								className={styles.link}
								onClick={() => setIsMenuOpen(false)}
							>
								promotions
							</Link>
							<Link
								href="/0218213/dashboard/gallery"
								className={styles.link}
								onClick={() => setIsMenuOpen(false)}
							>
								gallery
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
				<ToastContainer />
			</div>
		</header>
	);
}

export default AdminHeader;
