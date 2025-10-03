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
	const [showPopup, setShowPopup] = useState(true);
	const [currentAdIndex, setCurrentAdIndex] = useState(0);
	const [isMinimized, setIsMinimized] = useState(false);
	const [isClient, setIsClient] = useState(false);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const router = useRouter();

	// Auto-play with smooth transitions
	useEffect(() => {
		if (!isAutoPlaying || ads.length <= 1) return;

		const interval = setInterval(() => {
			setIsTransitioning(true);
			setTimeout(() => {
				setCurrentAdIndex((prev) => (prev + 1) % ads.length);
				setIsTransitioning(false);
			}, 300);
		}, 2000);

		return () => clearInterval(interval);
	}, [ads.length, isAutoPlaying]);

	useEffect(() => {
		setIsClient(true);

		if (!ads || ads.length === 0) return;

		const seenAdIds = JSON.parse(localStorage.getItem("seenAdIds") || "[]");
		const currentAdIds = ads.map((ad) => ad.id);
		const hasNewAds = currentAdIds.some((adId) => !seenAdIds.includes(adId));
		const hasSeenAds = localStorage.getItem("hasSeenAd");

		if (hasSeenAds) {
			setIsMinimized(true);
		}
		if (hasNewAds) {
			setTimeout(() => setShowPopup(true), 1000);
		}
	}, [ads]);

	const handleClose = () => {
		setShowPopup(false);
		setIsMinimized(true);

		if (ads && ads.length > 0) {
			const currentAdIds = ads.map((ad) => ad.id);
			const seenAdIds = JSON.parse(localStorage.getItem("seenAdIds") || "[]");
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
		setShowPopup(true);
		setIsMinimized(false);
	};

	const goToNextAd = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsTransitioning(true);
		setTimeout(() => {
			setCurrentAdIndex((prev) => (prev + 1) % ads.length);
			setIsTransitioning(false);
		}, 300);
	};

	const goToPrevAd = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsTransitioning(true);
		setTimeout(() => {
			setCurrentAdIndex((prev) => (prev - 1 + ads.length) % ads.length);
			setIsTransitioning(false);
		}, 300);
	};

	if (!isClient || !ads || ads.length === 0) {
		return null;
	}

	const currentAd = ads[currentAdIndex];

	return (
		<>
			{/* Popup Ads */}
			{showPopup && currentAd && (
				<div
					className={`${styles.overlay} ${
						showPopup ? styles.overlayVisible : ""
					}`}
				>
					<div className={styles.popup}>
						<button
							className={styles.closeButton}
							onClick={handleClose}
							aria-label="Close advertisement"
						>
							×
						</button>

						<div
							className={`${styles.imageContainer} ${
								isTransitioning ? styles.fadeOut : styles.fadeIn
							}`}
							onClick={() => handleAdClick(currentAd)}
							style={{
								cursor:
									currentAd.carSlug && currentAd.carSlug !== "null"
										? "pointer"
										: "default",
							}}
							onMouseEnter={() => setIsAutoPlaying(false)}
							onMouseLeave={() => setIsAutoPlaying(true)}
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

								<div className={styles.progressBar}>
									<div
										className={styles.progressFill}
										style={{
											width: `${((currentAdIndex + 1) / ads.length) * 100}%`,
											transition: "width 0.3s ease",
										}}
									/>
								</div>
							</>
						)}
					</div>
				</div>
			)}

			{/* Minimized Ad - Now positioned at bottom left */}
			{isMinimized && currentAd && (
				<div
					className={`${styles.minimizedAd} ${styles.floating}`}
					onClick={handleMinimizedClick}
					title="Click to view promotion"
				>
					<div className={styles.minimizedAdInner}>
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
						<div className={styles.pulseRing}></div>
					</div>
				</div>
			)}
		</>
	);
}
