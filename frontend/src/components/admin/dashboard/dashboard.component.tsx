"use client";
import {
  Car,
  Clipboard,
  GalleryHorizontal,
  GalleryHorizontalIcon,
  GalleryThumbnails,
  LogOut,
  Workflow,
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
        <Link href="/0218213/dashboard/orders" className={styles.option}>
          <Clipboard />
          <span>Manage Orders</span>
        </Link>
        <Link href="/0218213/dashboard/cars" className={styles.option}>
          <Car />
          <span>Manage Cars</span>
        </Link>
        <Link href="/0218213/dashboard/promotions" className={styles.option}>
          <GalleryHorizontalIcon />
          <span>Manage Promotions</span>
        </Link>
        <Link
          href="/0218213/dashboard/gallery"
          className={styles.option}
          target="_blank"
        >
          <GalleryThumbnails />
          <span>Manage Gallery</span>
        </Link>
        <Link
          href="https://abr-deluxe-management.vercel.app/"
          className={styles.option}
        >
          <Workflow />
          <span>Open manager</span>
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
