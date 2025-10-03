"use client";
import { AlertCircle } from "lucide-react";
import styles from "./orderError.module.css";
import Link from "next/link";
import { useTranslations } from "next-intl";
function OrderErr() {
	const t = useTranslations("orderError");
	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<div className={styles.iconWrapper}>
					<AlertCircle className={styles.errorIcon} />
				</div>
				<h1 className={styles.title}>{t("title")}</h1>
				<p className={styles.message}>{t("message1")}</p>
				<p className={styles.message}>{t("message2")}</p>

				<div className={styles.actions}>
					<Link href="/" className={styles.homeBtn}>
						{t("homeBtn")}
					</Link>
					<Link href="/contact" className={styles.contactBtn}>
						{t("contactBtn")}
					</Link>
				</div>
			</div>
		</div>
	);
}

export default OrderErr;
