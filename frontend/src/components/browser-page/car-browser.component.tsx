/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./car-browser.component.module.css";
import Image from "next/image";
import {
	FetchSeriesByBrand,
	GetAllBrandsOfNewCars,
	GetAllBrandsOfUsedCars,
	GetAllNewCarsOfBrand,
	GetAllNewCarsOfSerie,
	GetAllUsedCarsOfBrand,
	GetAllUsedCarsOfSerie,
	GetAllVisibleCars,
	GetAllVisibleNewCars,
	GetAllVisibleUsedCars,
	GetCarsOfBrand,
	GetCarsOfSerie,
	SearchCars, // Assuming this API exists
} from "@/utils/Admin";
import { ChevronLeft, Search, Filter, X, Car, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
	colors: {
		id: number;
		name: string;
		images: { isPrimary?: boolean; url: string }[];
	}[];
	slug: string;
	status: string;
	serie: { id: number; name: string; brand: { id: number; name: string } };
};

type Brands = {
	id: number;
	name: string;
};

type CarBrowserProps = {
	SVbrands: Brands[];
	AllCars: Car[];
};

// Animation variants
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const itemVariants = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			duration: 0.3,
		},
	},
};

const cardVariants = {
	hidden: { scale: 0.9, opacity: 0 },
	visible: {
		scale: 1,
		opacity: 1,
		transition: {
			duration: 0.3,
		},
	},
};

function CarBrowserComp({ SVbrands, AllCars }: CarBrowserProps) {
	const [car, setCar] = useState<Car[]>(AllCars);
	const [brands, setBrand] = useState<Brands[]>(SVbrands);
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>(
		{}
	);
	const [series, setSeries] = useState<{ id: number; name: string }[]>([]);
	const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
	const [seriesLoading, setSeriesLoading] = useState(false);
	const [visibleCars, setVisibleCars] = useState<Car[] | []>(car);
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const [searchResults, setSearchResults] = useState<Car[]>([]);
	const [typeOfCars, setTypeOfCars] = useState("all");
	const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);

	useEffect(() => {
		setLoading(false);
	}, []);

	async function GetSeriesOfBrand(brandId: number) {
		setSeriesLoading(true);
		setSelectedBrand(brandId);
		try {
			const response = await FetchSeriesByBrand(brandId);
			if (response.length > 0) {
				setSeries(response);
				setBreadcrumbs([
					...breadcrumbs,
					brands.find((b) => b.id === brandId)?.name || "",
				]);
			} else {
				setSeries([]);
			}
		} catch (error) {
			console.error("Erreur lors de la récupération des séries :", error);
			setSeries([]);
		} finally {
			setSeriesLoading(false);
		}
	}

	async function getCarsOfSerie(SerieId: number) {
		if (typeOfCars === "used") {
			const response = await GetAllUsedCarsOfSerie(SerieId);
			setVisibleCars(response);
			setBreadcrumbs([
				...breadcrumbs,
				series.find((s) => s.id === SerieId)?.name || "",
			]);
		} else if (typeOfCars === "new") {
			const response = await GetAllNewCarsOfSerie(SerieId);
			setVisibleCars(response);
			setBreadcrumbs([
				...breadcrumbs,
				series.find((s) => s.id === SerieId)?.name || "",
			]);
		} else {
			const response = await GetCarsOfSerie(SerieId);
			setVisibleCars(response);
			setBreadcrumbs([
				...breadcrumbs,
				series.find((s) => s.id === SerieId)?.name || "",
			]);
		}
	}

	async function getCarsOfBrand(BrandId: number) {
		if (typeOfCars === "used") {
			const response = await GetAllUsedCarsOfBrand(BrandId);
			setVisibleCars(response);
		} else if (typeOfCars === "new") {
			const response = await GetAllNewCarsOfBrand(BrandId);
			setVisibleCars(response);
		} else {
			try {
				const response = await GetCarsOfBrand(BrandId);
				setVisibleCars(response);
			} catch (error) {
				console.error(error);
			}
		}
	}

	const handleCarClick = (car: Car) => {
		router.push(`/buy/${car.slug}`);
	};

	const handleImageLoad = (carId: string) => {
		setImageLoaded((prev) => ({ ...prev, [carId]: true }));
	};

	const getAllBrandsOfUsedCars = async () => {
		const cars = await GetAllVisibleUsedCars();
		if (cars) setVisibleCars(cars);
		const brands = await GetAllBrandsOfUsedCars();
		if (brands) {
			setBrand(brands);
			setTypeOfCars("used");
			setBreadcrumbs(["Used Cars"]);
		}
	};

	const getAllBrandsOfNewCars = async () => {
		const cars = await GetAllVisibleNewCars();
		if (cars) setVisibleCars(cars);
		const brands = await GetAllBrandsOfNewCars();
		if (brands) {
			setBrand(brands);
			setTypeOfCars("new");
			setBreadcrumbs(["New Cars"]);
		}
	};

	const handleAllBtnCLick = async () => {
		if (typeOfCars === "used") {
			const response = await GetAllVisibleUsedCars();
			setVisibleCars(response);
		} else if (typeOfCars === "new") {
			const response = await GetAllVisibleNewCars();
			setVisibleCars(response);
		} else {
			const response = await GetAllVisibleCars();
			setVisibleCars(response);
		}
		setSeries([]);
	};
	const handleSearch = async () => {
		if (searchQuery.trim() === "") {
			setIsSearching(false);
			return;
		}

		setIsSearching(true);
		try {
			const results = await SearchCars(searchQuery);
			setSearchResults(results);
		} catch (error) {
			console.error("Error searching cars:", error);
		}
	};

	const clearSearch = () => {
		setSearchQuery("");
		setIsSearching(false);
		setSearchResults([]);
	};

	return (
		<>
			<motion.div
				className={styles.header}
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className={styles.titleContainer}>
					<motion.h1
						className={styles.mainTitle}
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.5 }}
					>
						Find Your Dream Car
					</motion.h1>
					<motion.p
						className={styles.subtitle}
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.5 }}
					>
						Browse our extensive collection of new and used vehicles
					</motion.p>
				</div>

				<motion.div
					className={styles.searchContainer}
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.4, duration: 0.5 }}
				>
					<div className={styles.searchBox}>
						<Search size={20} className={styles.searchIcon} />
						<input
							type="text"
							placeholder="Search by model, brand, or feature..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onKeyPress={(e) => e.key === "Enter" && handleSearch()}
							className={styles.searchInput}
						/>
						{searchQuery && (
							<X size={18} className={styles.clearIcon} onClick={clearSearch} />
						)}
						<button className={styles.searchButton} onClick={handleSearch}>
							Search
						</button>
					</div>
				</motion.div>

				<motion.div
					className={styles.carTypeSelector}
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					<motion.div
						className={`${styles.option} ${
							typeOfCars === "all" ? styles.optionActive : ""
						}`}
						onClick={() => (
							setTypeOfCars("all"), setBrand(SVbrands), setVisibleCars(AllCars)
						)}
						variants={itemVariants}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Car size={20} />
						<span>All Cars</span>
					</motion.div>
					<motion.div
						className={`${styles.option} ${
							typeOfCars === "used" ? styles.optionActive : ""
						}`}
						onClick={() => getAllBrandsOfUsedCars()}
						variants={itemVariants}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Car size={20} />
						<span>Used Cars</span>
					</motion.div>
					<motion.div
						className={`${styles.option} ${
							typeOfCars === "new" ? styles.optionActive : ""
						}`}
						onClick={() => getAllBrandsOfNewCars()}
						variants={itemVariants}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Car size={20} />
						<span>New Cars</span>
					</motion.div>
				</motion.div>
			</motion.div>

			<div className={styles.main}>
				{!isSearching ? (
					<>
						<motion.div
							className={styles.section}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							<h2 className={styles.sectionTitle}>
								<span>Popular Brands</span>
							</h2>
							<motion.div
								className={styles.brands}
								variants={containerVariants}
								initial="hidden"
								animate="visible"
							>
								<motion.div
									className={`${styles.brandItem} ${
										selectedBrand === null ? styles.brandItemActive : ""
									}`}
									onClick={() => (handleAllBtnCLick(), setSelectedBrand(null))}
									variants={itemVariants}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									All Brands
								</motion.div>
								{brands?.map((brand) => (
									<motion.div
										key={brand.id}
										className={`${styles.brandItem} ${
											selectedBrand === brand.id ? styles.brandItemActive : ""
										}`}
										onClick={() => (
											GetSeriesOfBrand(brand.id), getCarsOfBrand(brand.id)
										)}
										variants={itemVariants}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										{brand.name}
									</motion.div>
								))}
							</motion.div>
						</motion.div>

						<AnimatePresence>
							{selectedBrand && (
								<motion.div
									className={styles.section}
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.3 }}
								>
									<h2 className={styles.sectionTitle}>
										Series for{" "}
										{brands.find((b) => b.id === selectedBrand)?.name}
										{seriesLoading && (
											<span className={styles.loadingText}>Loading...</span>
										)}
									</h2>
									{series.length > 0 ? (
										<motion.div
											className={styles.series}
											variants={containerVariants}
											initial="hidden"
											animate="visible"
										>
											{series.map((serie) => (
												<motion.button
													key={serie.id}
													className={styles.serieItem}
													onClick={() => getCarsOfSerie(serie.id)}
													variants={itemVariants}
													whileHover={{ scale: 1.05 }}
													whileTap={{ scale: 0.95 }}
												>
													{serie.name}
												</motion.button>
											))}
										</motion.div>
									) : (
										!seriesLoading && (
											<motion.p
												className={styles.noSeries}
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												transition={{ delay: 0.2 }}
											>
												No series available for this brand
											</motion.p>
										)
									)}
								</motion.div>
							)}
						</AnimatePresence>

						<motion.div
							className={styles.section}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							<h2 className={styles.sectionTitle}>
								Available Vehicles ({visibleCars.length})
							</h2>
							{visibleCars.length > 0 ? (
								<motion.div
									className={styles.container}
									variants={containerVariants}
									initial="hidden"
									animate="visible"
								>
									{visibleCars.map((car) => (
										<motion.div
											key={car.id}
											className={styles.carCard}
											onClick={() => handleCarClick(car)}
											variants={cardVariants}
											whileHover={{ y: -5, transition: { duration: 0.2 } }}
										>
											<div className={styles.imageContainer}>
												{!imageLoaded[car.id] && (
													<div className={styles.imageSkeleton}></div>
												)}
												<Image
													src={
														car.colors[0].images.find((i) => i.isPrimary)
															?.url || "/images/placeholder.png"
													}
													alt={car.finition}
													width={300}
													height={200}
													className={`${styles.carImage} ${
														imageLoaded[car.id] ? styles.loaded : ""
													}`}
													onLoad={() => handleImageLoad(car.id)}
												/>
												<div className={styles.carOverlay}>
													<span className={styles.viewDetails}>
														View Details
													</span>
												</div>
												<div className={styles.carStatus}>{car.status}</div>
											</div>
											<div className={styles.carInfo}>
												<h2 className={styles.carTitle}>
													{car.serie.brand.name}
												</h2>
												<h4 style={{ color: "var(--text-secondary)" }}>
													{car.serie.name}
												</h4>
												<h4 style={{ color: "var(--text-secondary)" }}>
													{car.finition}
												</h4>
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
													<span className={styles.carFeature}>
														{car.Moteur}
													</span>
													<span className={styles.carFeature}>
														{car.colors.map((color) => color.name).join(" • ")}
													</span>
												</div>
											</div>
										</motion.div>
									))}
								</motion.div>
							) : (
								<motion.div
									className={styles.emptyState}
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.5 }}
								>
									<Car size={48} className={styles.emptyStateIcon} />
									<h3>No cars found</h3>
									<p>Try adjusting your filters or search criteria</p>
								</motion.div>
							)}
						</motion.div>
					</>
				) : (
					<motion.div
						className={styles.section}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h2 className={styles.sectionTitle}>
							Search Results for "{searchQuery}" ({searchResults.length})
						</h2>
						{searchResults.length > 0 ? (
							<motion.div
								className={styles.container}
								variants={containerVariants}
								initial="hidden"
								animate="visible"
							>
								{searchResults.map((car) => (
									<motion.div
										key={car.id}
										className={styles.carCard}
										onClick={() => handleCarClick(car)}
										variants={cardVariants}
										whileHover={{ y: -5, transition: { duration: 0.2 } }}
									>
										<div className={styles.imageContainer}>
											{!imageLoaded[car.id] && (
												<div className={styles.imageSkeleton}></div>
											)}
											<Image
												src={
													car.colors[0].images.find((i) => i.isPrimary)?.url ||
													"/images/placeholder.png"
												}
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
											<div className={styles.carStatus}>{car.status}</div>
										</div>
										<div className={styles.carInfo}>
											<h2 className={styles.carTitle}>
												{car.serie.brand.name}
											</h2>
											<h4 style={{ color: "var(--text-secondary)" }}>
												{car.serie.name}
											</h4>
											<h4 style={{ color: "var(--text-secondary)" }}>
												{car.finition}
											</h4>
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
												<span className={styles.carFeature}>
													{car.colors.map((color) => color.name).join(" • ")}
												</span>
											</div>
										</div>
									</motion.div>
								))}
							</motion.div>
						) : (
							<motion.div
								className={styles.emptyState}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5 }}
							>
								<Search size={48} className={styles.emptyStateIcon} />
								<h3>No results found</h3>
								<p>Try different search terms or browse all categories</p>
								<motion.button
									className={styles.primaryButton}
									onClick={clearSearch}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									Clear Search
								</motion.button>
							</motion.div>
						)}
					</motion.div>
				)}
			</div>
		</>
	);
}

export default CarBrowserComp;
