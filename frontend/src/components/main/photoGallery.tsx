"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./AdsCarousel.module.css";

interface gallery {
	id: number;
	publicId: string;
	url: string;
}

interface GalleryProps {
	gallery: gallery[];
}

export default function PhotoGallery({ gallery }: GalleryProps) {
	const [currentAdIndex, setCurrentAdIndex] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);

	// Auto slide every 5 seconds
	// useEffect(() => {
	// 	if (!isAutoPlaying || gallery.length <= 1) return;

	// 	const interval = setInterval(() => {
	// 		setCurrentAdIndex((prev) => (prev + 1) % gallery.length);
	// 	}, 2500);

	// 	return () => clearInterval(interval);
	// }, [gallery.length, isAutoPlaying]);

	const goToNextAd = () => {
		setCurrentAdIndex((prev) => (prev + 1) % gallery.length);
	};

	const goToPrevAd = () => {
		setCurrentAdIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
	};

	const goToAd = (index: number) => {
		setCurrentAdIndex(index);
	};

	if (!gallery || gallery.length === 0) {
		return null;
	}

	return (
		<div className={styles.adsContainer}>
			<div
				className={styles.carousel}
				onMouseEnter={() => setIsAutoPlaying(false)}
				onMouseLeave={() => setIsAutoPlaying(true)}
			>
				<div className={styles.title}>
					<h3>Gallery</h3>
				</div>
				<div
					className={styles.slidesContainer}
					style={{ transform: `translateX(-${currentAdIndex * 100}%)` }}
				>
					{gallery.map((ad, index) => (
						<div key={ad.id} className={styles.slide}>
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
				{gallery.length > 1 && (
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
							{currentAdIndex + 1} / {gallery.length}
						</div>
					</>
				)}
			</div>

			{/* Dots indicator - Only show if multiple ads */}
			{gallery.length > 1 && (
				<div className={styles.dots}>
					{gallery.map((_, index) => (
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
