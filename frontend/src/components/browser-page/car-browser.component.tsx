/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./car-browser.component.module.css";
import Image from "next/image";
import { FetchSeriesByBrand, GetCarsOfSerie } from "@/utils/Admin";
import { Serie } from "@/utils/Types";
import { Divide } from "lucide-react";

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

type Brands = {
	id: number;
	name: string;
};

type CarBrowserProps = { car: Car[]; brands: Brands[] };

function CarBrowserComp({ car, brands }: CarBrowserProps) {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>(
		{}
	);
	const [series, setSeries] = useState<{ id: number; name: string }[]>([]);
	const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
	const [seriesLoading, setSeriesLoading] = useState(false);
	const [visibleCars, setVisibleCars] = useState<Car[]>(car);
	async function GetSeriesOfBrand(brandId: number) {
		setSeriesLoading(true);
		setSelectedBrand(brandId);
		try {
			const response = await FetchSeriesByBrand(brandId);
			if (response.length > 0) {
				setSeries(response);
			} else {
				setSeries([]);
			}
		} catch (error) {
			console.error("Error fetching series:", error);
			setSeries([]);
		} finally {
			setSeriesLoading(false);
		}
	}
	async function getCarsOfSerie(SerieId: number) {
		const response = await GetCarsOfSerie(SerieId);
		setVisibleCars(response);
	}
	useEffect(() => {
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
			"/placeholder.png"
		);
	};

	const handleImageLoad = (carId: string) => {
		setImageLoaded((prev) => ({ ...prev, [carId]: true }));
	};

	if (loading) {
		return (
			<div className={styles.main}>
				<div className={styles.title}>
					<span>Browse Our Cars</span>
				</div>

				<div className={styles.section}>
					<h2 className={styles.sectionTitle}>Brands</h2>
					<div className={styles.brands}>
						{[...Array(6)].map((_, index) => (
							<div key={index} className={styles.brandSkeleton}></div>
						))}
					</div>
				</div>

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
			</div>
		);
	}

	return (
		<div className={styles.main}>
			<div className={styles.title}>
				<span>Browse Our Cars</span>
			</div>

			<div className={styles.section}>
				<h2 className={styles.sectionTitle}>Brands</h2>
				<div className={styles.brands}>
					<div
						className={`${styles.brandItem} ${
							selectedBrand === null ? styles.brandItemActive : ""
						}`}
						onClick={() => (setVisibleCars(car), setSelectedBrand(null))}
					>
						All
					</div>
					{brands.map((brand) => (
						<div
							key={brand.id}
							className={`${styles.brandItem} ${
								selectedBrand === brand.id ? styles.brandItemActive : ""
							}`}
							onClick={() => GetSeriesOfBrand(brand.id)}
						>
							{brand.name}
						</div>
					))}
				</div>
			</div>

			{selectedBrand && (
				<div className={styles.section}>
					<h2 className={styles.sectionTitle}>
						Series for {brands.find((b) => b.id === selectedBrand)?.name}
						{seriesLoading && (
							<span className={styles.loadingText}>Loading...</span>
						)}
					</h2>
					{series.length > 0 ? (
						<div className={styles.series}>
							{series.map((serie) => (
								<div
									key={serie.id}
									className={styles.serieItem}
									onClick={() => getCarsOfSerie(serie.id)}
								>
									{serie.name}
								</div>
							))}
						</div>
					) : (
						!seriesLoading && (
							<p className={styles.noSeries}>
								No series available for this brand
							</p>
						)
					)}
				</div>
			)}
			{car || visibleCars ? (
				<div className={styles.section}>
					<h2 className={styles.sectionTitle}>
						Available Cars ({visibleCars.length})
					</h2>
					<div className={styles.container}>
						{visibleCars.map((car) => (
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
									<p className={styles.carPrice}>
										{car.price.toLocaleString()} DZD
									</p>
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
				</div>
			) : (
				<div>
					<p className={styles.noCars}>No cars available for this series</p>
				</div>
			)}
		</div>
	);
}

export default CarBrowserComp;
