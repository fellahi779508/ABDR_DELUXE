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
	SearchCars,
} from "@/utils/Admin";
import { ChevronLeft, Search, Filter, X, Car, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/globals.css";
import { useTranslations } from "next-intl";

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
	isShiped: boolean;
	oldPrice: number;
};

type Brands = {
	id: number;
	name: string;
	icon: {
		url: string;
		publicId: string;
	};
};

type CarBrowserProps = {
	SVbrands: Brands[];
	AllCars: Car[];
};

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.05,
		},
	},
};

const itemVariants = {
	hidden: { y: 10, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
	},
};

function CarBrowserComp({ SVbrands, AllCars }: CarBrowserProps) {
	const t = useTranslations("Browser");
	const [theme, setTheme] = useState("light");
	useEffect(() => {
		const storedTheme = localStorage.getItem("theme");
		if (storedTheme === "dark") {
			setTheme("dark");
		} else {
			setTheme("light");
		}
	}, []);

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
	const [showFilters, setShowFilters] = useState(true);

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
		} else if (typeOfCars === "new") {
			const response = await GetAllNewCarsOfSerie(SerieId);
			setVisibleCars(response);
		} else {
			const response = await GetCarsOfSerie(SerieId);
			setVisibleCars(response);
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
		}
	};

	const getAllBrandsOfNewCars = async () => {
		const cars = await GetAllVisibleNewCars();
		if (cars) setVisibleCars(cars);
		const brands = await GetAllBrandsOfNewCars();
		if (brands) {
			setBrand(brands);
			setTypeOfCars("new");
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
		setSelectedBrand(null);
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

	const displayedCars = isSearching ? searchResults : visibleCars;

	return (
		<div className={styles.container}>
			{/* Header */}
			<motion.header
				className={styles.header}
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<div className={styles.searchSection}>
					<div className={styles.searchBox}>
						<Search size={18} className={styles.searchIcon} />
						<input
							type="text"
							placeholder={t("carBrowser.search.placeholder")}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onKeyPress={(e) => e.key === "Enter" && handleSearch()}
							className={styles.searchInput}
						/>
						{searchQuery && (
							<X size={16} className={styles.clearIcon} onClick={clearSearch} />
						)}
					</div>

					<button
						className={`${styles.filterButton} ${
							showFilters ? styles.active : ""
						}`}
						onClick={() => setShowFilters(!showFilters)}
					>
						<Filter size={18} />
					</button>
				</div>

				<AnimatePresence>
					{showFilters && (
						<motion.div
							className={styles.filtersPanel}
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
						>
							<div className={styles.carTypeTabs}>
								<button
									className={`${styles.typeTab} ${
										typeOfCars === "all" ? styles.active : ""
									}`}
									onClick={() => (
										setTypeOfCars("all"),
										setBrand(SVbrands),
										setVisibleCars(AllCars)
									)}
								>
									{t("carBrowser.types.all")}
								</button>
								<button
									className={`${styles.typeTab} ${
										typeOfCars === "used" ? styles.active : ""
									}`}
									onClick={() => getAllBrandsOfUsedCars()}
								>
									{t("carBrowser.types.used")}
								</button>
								<button
									className={`${styles.typeTab} ${
										typeOfCars === "new" ? styles.active : ""
									}`}
									onClick={() => getAllBrandsOfNewCars()}
								>
									{t("carBrowser.types.new")}
								</button>
							</div>

							<div className={styles.brandsSection}>
								<button
									className={`${styles.brandPill} ${
										selectedBrand === null ? styles.active : ""
									}`}
									onClick={handleAllBtnCLick}
								>
									All
								</button>
								{brands?.map((brand) => (
									<button
										key={brand.id}
										className={`${styles.brandPill} ${
											selectedBrand === brand.id ? styles.active : ""
										}`}
										onClick={() => (
											GetSeriesOfBrand(brand.id), getCarsOfBrand(brand.id)
										)}
									>
										<Image
											src={brand.icon.url ?? ""}
											alt={brand.name}
											width={20}
											height={18}
											className={styles.brandIcon}
										/>
										{brand.name}
									</button>
								))}
							</div>

							{selectedBrand && series.length > 0 && (
								<div className={styles.seriesSection}>
									{series.map((serie) => (
										<button
											key={serie.id}
											className={styles.seriePill}
											onClick={() => getCarsOfSerie(serie.id)}
										>
											{serie.name}
										</button>
									))}
								</div>
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</motion.header>

			{/* Main Content */}
			<main className={styles.main}>
				{displayedCars.length > 0 ? (
					<motion.div
						className={styles.carsGrid}
						variants={containerVariants}
						initial="hidden"
						animate="visible"
					>
						{displayedCars.map((car) => (
							<motion.div
								key={car.id}
								className={styles.carCard}
								onClick={() => handleCarClick(car)}
								variants={itemVariants}
								whileHover={{ y: -4 }}
							>
								<div className={styles.imageSection}>
									<div className={styles.imageContainer}>
										{!imageLoaded[car.id] && (
											<div className={styles.imageSkeleton}></div>
										)}
										<Image
											src={
												car.colors
													.find((color) =>
														color.images.find(
															(image) => image.isPrimary === true
														)
													)
													?.images.find((image) => image.isPrimary === true)
													?.url || "/images/placeholder.png"
											}
											alt={car.finition}
											width={300}
											height={180}
											className={`${styles.carImage} ${
												imageLoaded[car.id] ? styles.loaded : ""
											}`}
											onLoad={() => handleImageLoad(car.id)}
										/>
									</div>

									<div className={styles.badges}>
										<span className={`${styles.badge} ${styles.statusBadge}`}>
											{car.status === "new"
												? t("carBrowser.badges.status.new")
												: t("carBrowser.badges.status.used")}
										</span>
										<span className={`${styles.badge} ${styles.stockBadge}`}>
											{car.isShiped
												? t("carBrowser.badges.stock.in")
												: t("carBrowser.badges.stock.order")}
										</span>
									</div>
								</div>

								<div className={styles.carInfo}>
									<div className={styles.priceSection}>
										<span className={styles.price}>
											{car.price.toLocaleString()} DZD
										</span>
										{car.oldPrice !== 0 && (
											<span className={styles.oldPrice}>
												{car.oldPrice.toLocaleString()} DZD
											</span>
										)}
									</div>

									<div className={styles.carTitle}>
										<h3>{car.serie.brand.name}</h3>
										<p>
											{car.serie.name} {car.finition}
										</p>
									</div>

									<div className={styles.specs}>
										<div className={styles.specItem}>
											<span>{car.Année}</span>
										</div>
										<div className={styles.specItem}>
											<span>{car.Kilométrage}</span>
										</div>
										<div className={styles.specItem}>
											<span>{car.Boite}</span>
										</div>
										<div className={styles.specItem}>
											<span>{car.Energie}</span>
										</div>
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
					>
						<Car size={40} className={styles.emptyIcon} />
						<h3>{t("carBrowser.vehicles.emptyTitle")}</h3>
						<p>{t("carBrowser.vehicles.emptyDesc")}</p>
						<button className={styles.resetButton} onClick={handleAllBtnCLick}>
							{t("carBrowser.search.clear")}
						</button>
					</motion.div>
				)}
			</main>
		</div>
	);
}

export default CarBrowserComp;
