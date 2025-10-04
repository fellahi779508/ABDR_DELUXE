/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import styles from "./promotions.module.css";
import {
	DeleteAllPromotions,
	DeletePromoById,
	GetAllCarsSlug,
	GetAllPromotions,
	UploadPromotionPic,
} from "@/utils/Admin";

import Select from "react-select";
import Image from "next/image";

type Promotion = {
	id: number;
	carSlug: string;
	url: string;
};
function PromotionsComp() {
	const [carSlugs, setCarSlugs] = useState<string[]>([]);
	type CarOption = { value: string; label: string };
	const [selectedCarSlug, setSelectedCarSlug] = useState<CarOption | null>(
		null
	);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [promotions, setPromotions] = useState<Promotion[]>([]);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState({ text: "", type: "" });

	useEffect(() => {
		loadCarSlugs();
		loadPromotions();
	}, []);

	const loadCarSlugs = async () => {
		try {
			const slugs = await GetAllCarsSlug();
			setCarSlugs(slugs);
		} catch (error) {
			showMessage("Failed to load car slugs", "error");
		}
	};

	const loadPromotions = async () => {
		const resp = await GetAllPromotions();
		setPromotions(resp);
	};

	const showMessage = (text: string, type: string) => {
		setMessage({ text, type });
		setTimeout(() => setMessage({ text: "", type: "" }), 5000);
	};

	const handleFileChange = (event: any) => {
		const file = event.target.files[0];
		if (file) {
			if (!file.type.startsWith("image/")) {
				showMessage("Please select an image file", "error");
				return;
			}
			setSelectedFile(file);
		}
	};

	const handleSubmit = async () => {
		if (!selectedFile) {
			showMessage("Please select an image file", "error");
			return;
		}

		setLoading(true);
		try {
			const result = await UploadPromotionPic(
				selectedCarSlug?.value || null,
				selectedFile
			);
			console.log(result);

			if (result.id) {
				showMessage("Promotion uploaded successfully!", "success");
				setSelectedCarSlug(null);
				setSelectedFile(null);
				const fileInput = document.getElementById(
					"file-input"
				) as HTMLInputElement | null;
				if (fileInput) {
					fileInput.value = "";
				}
				loadPromotions();
			}
		} catch (error) {
			showMessage("Failed to upload promotion", "error");
		} finally {
			setLoading(false);
		}
	};

	const handleDeletePromotion = async (promotionId: number) => {
		if (!window.confirm("Are you sure you want to delete this promotion?")) {
			return;
		}

		try {
			const result = await DeletePromoById(promotionId);
			if (result) {
				showMessage("Promotion deleted successfully!", "success");
				loadPromotions(); // Refresh the promotions list
			}
		} catch (error) {
			showMessage("Failed to delete promotion", "error");
		}
	};

	const handleDeleteAll = async () => {
		if (
			!window.confirm(
				"Are you sure you want to delete ALL promotions? This action cannot be undone."
			)
		) {
			return;
		}

		try {
			const result = await DeleteAllPromotions();
			if (result) {
				showMessage("All promotions deleted successfully!", "success");
				setPromotions([]);
			}
		} catch (error) {
			showMessage("Failed to delete all promotions", "error");
		}
	};

	const selectOptions = carSlugs.map((slug) => ({
		value: slug,
		label: slug.replace(/-/g, " ").toUpperCase(),
	}));

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1 className={styles.title}>Promotions Management</h1>
				<p className={styles.subtitle}>Create and manage car promotions</p>
			</div>

			{message.text && (
				<div className={`${styles.message} ${styles[message.type]}`}>
					{message.text}
				</div>
			)}

			<div className={styles.content}>
				{/* Create Promotion Section */}
				<section className={styles.section}>
					<h2 className={styles.sectionTitle}>Create New Promotion</h2>
					<div className={styles.form}>
						<div className={styles.formGroup}>
							<label className={styles.label}>Select Car</label>
							{typeof window !== "undefined" && (
								<Select
									options={selectOptions}
									value={selectedCarSlug}
									onChange={(selected) => setSelectedCarSlug(selected)}
									placeholder="Choose a car (optional)..."
									className={styles.select}
									isLoading={carSlugs.length === 0}
								/>
							)}
						</div>

						<div className={styles.formGroup}>
							<label className={styles.label}>Promotion Image</label>
							<input
								id="file-input"
								type="file"
								accept="image/*"
								onChange={handleFileChange}
								className={styles.fileInput}
							/>
							{selectedFile && (
								<div className={styles.fileInfo}>
									Selected: {selectedFile.name}
								</div>
							)}
						</div>

						<button
							disabled={loading}
							className={`${styles.button} ${styles.primary}`}
							onClick={handleSubmit}
						>
							{loading ? "Uploading..." : "Create Promotion"}
						</button>
					</div>
				</section>

				{/* Existing Promotions Section */}
				<section className={styles.section}>
					<div className={styles.sectionHeader}>
						<h2 className={styles.sectionTitle}>Existing Promotions</h2>
						{promotions.length > 0 && (
							<button
								onClick={handleDeleteAll}
								className={`${styles.button} ${styles.danger}`}
							>
								Delete All Promotions
							</button>
						)}
					</div>

					{promotions.length === 0 ? (
						<div className={styles.emptyState}>
							<p>No promotions found. Create your first promotion above.</p>
						</div>
					) : (
						<div className={styles.promotionsGrid}>
							{promotions.map((promotion) => (
								<div key={promotion.id} className={styles.promotionCard}>
									<div className={styles.promotionImage}>
										<Image
											src={promotion.url ?? "/images/placeholder.png"}
											alt={promotion.carSlug}
											width={1000}
											height={1000}
											priority
										/>
									</div>
									<div className={styles.promotionInfo}>
										<h3 className={styles.carName}>
											{promotion.carSlug.replace(/-/g, " ").toUpperCase()}
										</h3>
										<p className={styles.promotionId}>ID: {promotion.id}</p>
									</div>
									<button
										onClick={() => handleDeletePromotion(promotion.id)}
										className={`${styles.button} ${styles.danger} ${styles.small}`}
									>
										Delete
									</button>
								</div>
							))}
						</div>
					)}
				</section>
			</div>
		</div>
	);
}

export default PromotionsComp;
