"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./AdsCarousel.module.css";

interface Ad {
	id: number;
	publicId: string;
	url: string;
	carSlug: string;
}

interface AdsCarouselProps {
	ads: Ad[];
}

export default function AdsCarousel({ ads }: AdsCarouselProps) {
	const [currentAdIndex, setCurrentAdIndex] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const router = useRouter();

	// Auto slide every 5 seconds
	useEffect(() => {
		if (!isAutoPlaying || ads.length <= 1) return;

		const interval = setInterval(() => {
			setCurrentAdIndex((prev) => (prev + 1) % ads.length);
		}, 2500);

		return () => clearInterval(interval);
	}, [ads.length, isAutoPlaying]);

	const goToNextAd = () => {
		setCurrentAdIndex((prev) => (prev + 1) % ads.length);
	};

	const goToPrevAd = () => {
		setCurrentAdIndex((prev) => (prev - 1 + ads.length) % ads.length);
	};

	const goToAd = (index: number) => {
		setCurrentAdIndex(index);
	};

	const handleAdClick = (ad: Ad) => {
		if (ad.carSlug && ad.carSlug !== "null") {
			router.push(`/buy/${ad.carSlug}`);
		}
	};

	// Don't render if no ads
	if (!ads || ads.length === 0) {
		return null;
	}

	const currentAd = ads[currentAdIndex];

	return (
		<div className={styles.adsContainer}>
			<div
				className={styles.carousel}
				onMouseEnter={() => setIsAutoPlaying(false)}
				onMouseLeave={() => setIsAutoPlaying(true)}
			>
				<div className={styles.title}>
					<h3>Current Offers</h3>
				</div>
				<div
					className={styles.slidesContainer}
					style={{ transform: `translateX(-${currentAdIndex * 100}%)` }}
				>
					{ads.map((ad, index) => (
						<div
							key={ad.id}
							className={styles.slide}
							onClick={() => handleAdClick(ad)}
							style={{
								cursor:
									ad.carSlug && ad.carSlug !== "null" ? "pointer" : "default",
							}}
						>
							<Image
								src={ad.url}
								alt={`Promotion ${ad.id}`}
								className={styles.image}
								priority={index === 0}
								width={1000}
								height={1000}
							/>
						</div>
					))}
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

			{/* Dots indicator - Only show if multiple ads */}
			{ads.length > 1 && (
				<div className={styles.dots}>
					{ads.map((_, index) => (
						<button
							key={index}
							className={`${styles.dot} ${
								index === currentAdIndex ? styles.dotActive : ""
							}`}
							onClick={() => goToAd(index)}
							aria-label={`Go to advertisement ${index + 1}`}
						/>
					))}
				</div>
			)}
		</div>
	);
}
