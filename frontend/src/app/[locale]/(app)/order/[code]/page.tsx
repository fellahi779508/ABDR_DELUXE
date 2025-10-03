/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./order.module.css";

type orderProps = {
	params: { code: string };
};

export default function Page({ params }: orderProps) {
	const { code } = params;
	return (
		<main className={styles.page}>
			<div className={styles.container}>
				<div className={styles.card}>
					<div className={styles.illustration} aria-hidden>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							className={styles.check}
						>
							<circle cx="12" cy="12" r="9" />
							<path d="M9 12.5l2 2 4-5" />
						</svg>
					</div>

					<div className={styles.content}>
						<h1 className={styles.title}>Commande reçue</h1>
						<p className={styles.subtitle}>
							Merci — votre commande a été passée avec succès.
						</p>

						<div className={styles.codeRow}>
							<div className={styles.codeBox}>
								<span className={styles.codeLabel}>Code de commande</span>
								<code className={styles.code}>{code}</code>
							</div>

							<div className={styles.actions}>
								<CopyButton text={code} />
								<Link href="/" className={styles.primaryBtn}>
									Retour à l'accueil
								</Link>
								<button
									type="button"
									className={styles.ghostBtn}
									onClick={() => window.print()}
								>
									Imprimer
								</button>
							</div>
						</div>

						<p className={styles.note}>
							Nous vous contacterons sous peu pour confirmer les détails et
							organiser la livraison.
						</p>

						<div className={styles.footerRow}>
							<Link className={styles.link} href="/contact">
								Contacter le support
							</Link>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<button
			type="button"
			onClick={handleCopy}
			className={copied ? `${styles.copyBtn} ${styles.copied}` : styles.copyBtn}
			aria-label="Copier le code de commande"
		>
			{copied ? "Copié" : "Copier"}
		</button>
	);
}
