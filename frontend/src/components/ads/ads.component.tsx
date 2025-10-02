"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./ads.module.css";

interface Ad {
	id: number;
	publicId: string;
	url: string;
	carSlug: string;
}

interface AdsComponentProps {
	ads: Ad[];
}

export default function Ads({ ads }: AdsComponentProps) {
	const [showPopup, setShowPopup] = useState(false);
	const [currentAdIndex, setCurrentAdIndex] = useState(0);
	const [isMinimized, setIsMinimized] = useState(false);
	const [isClient, setIsClient] = useState(false);
	const router = useRouter();

	useEffect(() => {
		setIsClient(true);

		if (!ads || ads.length === 0) return;

		// Get previously seen ad IDs from localStorage
		const seenAdIds = JSON.parse(localStorage.getItem("seenAdIds") || "[]");

		// Check if there are any new ads that haven't been seen
		const currentAdIds = ads.map((ad) => ad.id);
		const hasNewAds = currentAdIds.some((adId) => !seenAdIds.includes(adId));
		const hasSeenAds = localStorage.getItem("hasSeenAd");
		if (hasSeenAds) {
			setIsMinimized(true);
		}
		if (hasNewAds) {
			setShowPopup(true);
		}
	}, [ads]);

	const handleClose = () => {
		setShowPopup(false);
		setIsMinimized(true);

		// Store all current ad IDs as seen
		if (ads && ads.length > 0) {
			const currentAdIds = ads.map((ad) => ad.id);
			const seenAdIds = JSON.parse(localStorage.getItem("seenAdIds") || "[]");

			// Merge and deduplicate
			const updatedSeenAdIds = [...new Set([...seenAdIds, ...currentAdIds])];
			localStorage.setItem("seenAdIds", JSON.stringify(updatedSeenAdIds));
		}
	};

	const handleAdClick = (ad: Ad) => {
		if (ad.carSlug && ad.carSlug !== "null") {
			router.push(`/buy/${ad.carSlug}`);
			handleClose();
		}
	};

	const handleMinimizedClick = () => {
		console.log("Minimized ad clicked");
		setShowPopup(true);
		setIsMinimized(false);
	};

	const goToNextAd = (e: React.MouseEvent) => {
		e.stopPropagation();
		setCurrentAdIndex((prev) => (prev + 1) % ads.length);
	};

	const goToPrevAd = (e: React.MouseEvent) => {
		e.stopPropagation();
		setCurrentAdIndex((prev) => (prev - 1 + ads.length) % ads.length);
	};

	// Don't render anything if no ads or not on client
	if (!isClient || !ads || ads.length === 0) {
		return null;
	}

	const currentAd = ads[currentAdIndex];

	return (
		<>
			{/* Popup Ads */}
			{showPopup && currentAd && (
				<div className={styles.overlay}>
					<div className={styles.popup}>
						<button
							className={styles.closeButton}
							onClick={handleClose}
							aria-label="Close advertisement"
						>
							×
						</button>

						<div
							className={styles.imageContainer}
							onClick={() => handleAdClick(currentAd)}
							style={{
								cursor:
									currentAd.carSlug && currentAd.carSlug !== "null"
										? "pointer"
										: "default",
							}}
						>
							<Image
								src={currentAd.url}
								alt={`Promotion ${currentAd.id}`}
								width={500}
								height={200}
								className={styles.image}
								priority
								onError={(e) => {
									console.error("Image failed to load:", currentAd.url);
									e.currentTarget.style.display = "none";
								}}
								style={{
									objectFit: "contain",
								}}
							/>
						</div>

						{/* Navigation Arrows - Only show if multiple ads */}
						{ads.length > 1 && (
							<>
								<button
									className={`${styles.navigation} ${styles.prev}`}
									onClick={goToPrevAd}
									aria-label="Previous advertisement"
								>
									‹
								</button>
								<button
									className={`${styles.navigation} ${styles.next}`}
									onClick={goToNextAd}
									aria-label="Next advertisement"
								>
									›
								</button>
								<div className={styles.counter}>
									{currentAdIndex + 1} / {ads.length}
								</div>
							</>
						)}
					</div>
				</div>
			)}

			{/* Minimized Ad */}
			{isMinimized && currentAd && (
				<div
					className={styles.minimizedAd}
					onClick={handleMinimizedClick}
					title="Click to view promotion"
				>
					<Image
						src={currentAd.url}
						alt={`Promotion ${currentAd.id}`}
						width={120}
						height={120}
						className={styles.minimizedImage}
						onError={(e) => {
							console.error("Minimized image failed to load:", currentAd.url);
							e.currentTarget.style.display = "none";
						}}
						style={{
							objectFit: "cover",
						}}
					/>
				</div>
			)}
		</>
	);
}
