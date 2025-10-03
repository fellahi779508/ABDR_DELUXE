"use client";
import {
	Car,
	Clipboard,
	GalleryHorizontal,
	GalleryHorizontalIcon,
	GalleryThumbnails,
	LogOut,
} from "lucide-react";
import styles from "./dashboard.component.module.css";
import { logout } from "@/utils/Admin";
import Link from "next/link";
function Dashboard_Component() {
	async function handleLogout() {
		const response = await logout();
		if (response) {
		} else {
			alert("Something went wrong");
		}
	}
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<span>Welcome To Your Admin Dashboard</span>
				<span>What Do You Want To Do?</span>
			</div>

			<div className={styles.Admin_options}>
				<Link href="/admin/dashboard/orders" className={styles.option}>
					<Clipboard />
					<span>Manage Orders</span>
				</Link>
				<Link href="/admin/dashboard/cars" className={styles.option}>
					<Car />
					<span>Manage Cars</span>
				</Link>
				<Link href="/admin/dashboard/promotions" className={styles.option}>
					<GalleryHorizontalIcon />
					<span>Manage Promotions</span>
				</Link>
				<Link href="/admin/dashboard/gallery" className={styles.option}>
					<GalleryThumbnails />
					<span>Manage Gallery</span>
				</Link>
				<div className={styles.option} onClick={() => handleLogout()}>
					<LogOut />
					<span>Disconnect</span>
				</div>
			</div>
		</div>
	);
}

export default Dashboard_Component;
