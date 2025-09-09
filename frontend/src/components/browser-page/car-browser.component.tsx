/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./car-browser.component.module.css";
import Image from "next/image";

type Car = {
	finition: string;
	id: string;
	price: number;
	Moteur: string;
	Energie: string;
	Boite: string;
	Kilométrage: string;
	Année: string;
	description?: string;
	color: string;
	images: { isPrimary?: boolean; url: string }[];
	slug: string;
};

type CarBrowserProps = { car: Car[] };

function CarBrowserComp({ car }: CarBrowserProps) {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>(
		{}
	);

	useEffect(() => {
		// Simulate loading delay for better UX
		const timer = setTimeout(() => {
			setLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	const handleCarClick = (car: Car) => {
		router.push(`/cars/${car.slug}`);
	};

	const getPrimaryImage = (images: Car["images"]) => {
		return (
			images.find((img) => img.isPrimary)?.url ||
			images[0]?.url ||
			"/placeholder-car.jpg"
		);
	};

	const handleImageLoad = (carId: string) => {
		setImageLoaded((prev) => ({ ...prev, [carId]: true }));
	};

	if (loading) {
		return (
			<div className={styles.container}>
				{[...Array(6)].map((_, index) => (
					<div key={index} className={styles.carCardSkeleton}>
						<div className={styles.imageSkeleton}></div>
						<div className={styles.infoSkeleton}>
							<div className={styles.titleSkeleton}></div>
							<div className={styles.priceSkeleton}></div>
							<div className={styles.detailsSkeleton}></div>
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className={styles.container}>
			{car.map((car) => (
				<div
					key={car.id}
					className={styles.carCard}
					onClick={() => handleCarClick(car)}
				>
					<div className={styles.imageContainer}>
						{!imageLoaded[car.id] && (
							<div className={styles.imageSkeleton}></div>
						)}
						<Image
							src={getPrimaryImage(car.images)}
							alt={car.finition}
							width={300}
							height={200}
							className={`${styles.carImage} ${
								imageLoaded[car.id] ? styles.loaded : ""
							}`}
							onLoad={() => handleImageLoad(car.id)}
						/>
						<div className={styles.carOverlay}>
							<span className={styles.viewDetails}>View Details</span>
						</div>
					</div>
					<div className={styles.carInfo}>
						<h3 className={styles.carTitle}>{car.finition}</h3>
						<p className={styles.carPrice}>{car.price.toLocaleString()} DZD</p>
						<div className={styles.carDetails}>
							<span>
								{car.Année} • {car.Kilométrage}
							</span>
							<span>
								{car.Boite} • {car.Energie}
							</span>
						</div>
						<div className={styles.carFeatures}>
							<span className={styles.carFeature}>{car.Moteur}</span>
							<span className={styles.carFeature}>{car.color}</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

export default CarBrowserComp;
