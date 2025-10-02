/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import styles from "./car-details.component.module.css";
import { useState } from "react";
import {
	MoveLeft,
	MoveRight,
	Zap,
	ParkingMeter,
	Star,
	Bolt,
	Shield,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { useTranslations } from "next-intl";

type CarDetailsProps = {
	slug: string;
	data: Car;
};
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
		images: { isPrimary?: boolean; url: string; sortOrder: number }[];
	}[];
	options: {
		id: number;
		title: string;
		value: string;
	}[];
	slug: string;
	status: string;
	serie: {
		id: number;
		name: string;
		brand: { id: number; name: string; icon: { url: string } };
	};
	isShiped: boolean;
	oldPrice: number;
};

type CartItem = {
	slug: string;
	color: string;
	quantity: number;
};

// Utility functions for cart management
const CART_STORAGE_KEY = "carDealershipCart";

const getCartFromStorage = (): CartItem[] => {
	if (typeof window === "undefined") return [];

	try {
		const cart = localStorage.getItem(CART_STORAGE_KEY);
		return cart ? JSON.parse(cart) : [];
	} catch (error) {
		console.error("Error reading cart from localStorage:", error);
		return [];
	}
};

const addToCart = (slug: string, quantity: number = 1, color: string): void => {
	if (typeof window === "undefined") return;

	try {
		const currentCart = getCartFromStorage();

		// Check if item already exists in cart with same slug AND color
		const existingItemIndex = currentCart.findIndex(
			(item) => item.slug === slug && item.color === color
		);

		let newCart: CartItem[];

		if (existingItemIndex >= 0) {
			// Update quantity if item exists with same color
			newCart = currentCart.map((item, index) =>
				index === existingItemIndex
					? { ...item, quantity: item.quantity + quantity }
					: item
			);
		} else {
			// Add new item
			newCart = [...currentCart, { slug, quantity, color }];
		}

		localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));

		// Dispatch custom event for cart updates
		window.dispatchEvent(new Event("cartUpdated"));
	} catch (error) {
		console.error("Error adding to cart:", error);
	}
};

const clearCart = (): void => {
	if (typeof window === "undefined") return;

	try {
		localStorage.removeItem(CART_STORAGE_KEY);
		window.dispatchEvent(new Event("cartUpdated"));
	} catch (error) {
		console.error("Error clearing cart:", error);
	}
};

const getCartItemCount = (): number => {
	const cart = getCartFromStorage();
	return cart.reduce((total, item) => total + item.quantity, 0);
};

function CarDetailsComponent(param: CarDetailsProps) {
	const { data } = param;
	const [images, setImages] = useState<any>(data.colors[0].images);
	const [mainImage, setMainImage] = useState<any>({
		url: data.colors.find((color: any) =>
			color.images.find((image: any) => image.url)
		)?.images[0].url,
		sortOrder: 0,
	});
	const [startIndex, setStartIndex] = useState(0);
	const [selectedImageIndex, setSelectedImageIndex] = useState(
		images[0]?.sortOrder + 1 || 0
	);
	const [isLoading, setIsLoading] = useState(false);

	// Mock translation function - replace with your actual i18n implementation
	const t = useTranslations("carDetails");

	function rightArrowClick() {
		if (images.length < startIndex + 5) return;
		setStartIndex(startIndex + 5);
	}

	function leftArrowClick() {
		if (startIndex === 0) return;
		setStartIndex(startIndex - 5);
	}

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("fr-DZ", {
			style: "decimal",
			minimumFractionDigits: 0,
		}).format(price);
	};

	const router = useRouter();

	const handleBuy = () => {
		if (clickedColor.color === "") {
			toast.error(t("carDetails.errors.chooseColor"));
			return;
		}
		setIsLoading(true);

		// Add to cart with quantity 1 and selected color
		addToCart(data.slug, 1, clickedColor.color);

		// Simulate API call delay
		setTimeout(() => {
			setIsLoading(false);
			// Redirect to order page
			router.push("/order");
		}, 500);
	};

	const handleAddToCart = () => {
		if (clickedColor.color === "") {
			toast.error(t("carDetails.errors.chooseColor"));
			return;
		}
		setIsLoading(true);

		// Add to cart with quantity 1 and selected color
		addToCart(data.slug, 1, clickedColor.color);

		setTimeout(() => {
			setIsLoading(false);
			// Show success message
			toast.success(t("carDetails.notifications.added"));
		}, 500);
	};

	const [clickedColor, setClickedColor] = useState({
		color: "",
	});

	const handleColorClick = (color: any) => {
		setMainImage(
			color.images?.find((image: any) => image.isPrimary === true) ??
				color.images[0] ?? {
					url: "/images/placeholder.png",
					sortOrder: 0,
				}
		);
		setImages(color.images);
		setClickedColor({ color: color.name });
		setSelectedImageIndex(0);
	};

	return (
		<motion.div
			className={styles.main}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			<motion.div
				className={styles.header}
				initial={{ y: -20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<div className={styles.breadcrumb}>
					<Link href="/home" className={styles.link}>
						{t("carDetails.breadcrumb.home")}
					</Link>{" "}
					/
					<Link href="/buy" className={styles.link}>
						{" "}
						{t("carDetails.breadcrumb.cars")}
					</Link>{" "}
					/ <span> {data.serie.brand.name}</span> <span>{data.serie.name}</span>
				</div>
			</motion.div>

			<motion.div
				className={styles.title_container}
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.1, duration: 0.5 }}
			>
				<h1 className={styles.title}>
					{data.serie.brand.name} {data.serie.name} {data.finition}
				</h1>
				<div className={styles.car_meta}>
					<span className={styles.meta_item}>
						<Shield size={16} />{" "}
						{data.isShiped
							? t("carDetails.availability.available")
							: t("carDetails.availability.byOrder")}
					</span>
					{data.status === "new" ? (
						<span className={styles.meta_item}>
							<Star size={16} /> {t("carDetails.status.new")}
						</span>
					) : (
						<span className={styles.meta_item}>
							<Bolt size={16} /> {t("carDetails.status.used")}
						</span>
					)}
				</div>
			</motion.div>

			<motion.div
				className={styles.details_container}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2, duration: 0.5 }}
			>
				<motion.div className={styles.section} transition={{ duration: 0.2 }}>
					<div className={styles.main_image_container}>
						<motion.div
							className={styles.main_image}
							key={mainImage.url}
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3 }}
						>
							<span className={styles.image_index}>
								{selectedImageIndex} / {images.length}
							</span>
							<Image
								src={mainImage?.url ?? "/images/placeholder.png"}
								width={2000}
								height={2000}
								alt={`${data.serie.brand.name} ${data.serie.name}`}
								priority
							/>
						</motion.div>
					</div>
					<motion.div
						className={styles.mini_images_container}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.5 }}
					>
						{startIndex === 0 ? null : (
							<MoveLeft
								onClick={() => leftArrowClick()}
								className={styles.left_arrow}
							/>
						)}

						{images
							.slice(startIndex, startIndex + 5)
							.map((image: any, index: number) => {
								return (
									<motion.div
										className={`${styles.mini_image} ${
											mainImage.url === image.url ? styles.active : ""
										}`}
										key={index}
										onClick={() => (
											setMainImage(image),
											setSelectedImageIndex(image.sortOrder + 1)
										)}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: 0.1 * index, duration: 0.3 }}
									>
										<Image
											src={image.url ?? "/images/placeholder.png"}
											width={2000}
											height={2000}
											alt=""
											priority
										/>
									</motion.div>
								);
							})}

						{startIndex + 5 < images.length ? (
							<MoveRight
								onClick={() => rightArrowClick()}
								className={styles.right_arrow}
							/>
						) : null}
					</motion.div>
				</motion.div>

				<motion.div
					className={styles.DetailsSection}
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.4, duration: 0.5 }}
				>
					<motion.div
						className={styles.price_section}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5, duration: 0.5 }}
					>
						<div className={styles.price}>
							{data.oldPrice !== 0 ? (
								<>
									<span>{t("carDetails.price.promo")} </span>
									{formatPrice(data.price)} DZD
								</>
							) : (
								<>
									<span>{t("carDetails.price.oldPrice")} </span>
									{formatPrice(data.price)} DZD
								</>
							)}
						</div>
						{data.oldPrice !== 0 && (
							<div className={styles.OldPrice}>
								<span>{t("carDetails.price.oldPrice")} </span>{" "}
								{formatPrice(data.oldPrice)} DZD
							</div>
						)}
					</motion.div>

					<motion.div
						className={styles.car_colors}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.6, duration: 0.5 }}
					>
						<div
							style={{
								fontWeight: "bold",
								fontSize: "20px",
								color: "var(--primary)",
								marginBottom: "1rem",
							}}
						>
							{t("carDetails.colors.title")}
						</div>
						<div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
							{data.colors.map((color: any, index: number) => {
								const isSelected = clickedColor.color === color.name;
								return (
									<motion.button
										key={index}
										onClick={() => handleColorClick(color)}
										whileHover={{ scale: 1.05, y: -2 }}
										whileTap={{ scale: 0.95 }}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.1 * index, duration: 0.3 }}
										style={{
											padding: "0.75rem 1.5rem",
											border: `2px solid ${
												isSelected ? "var(--primary)" : "var(--border)"
											}`,
											backgroundColor: isSelected
												? "var(--primary)"
												: "var(--surface)",
											color: isSelected ? "white" : "var(--text)",
											borderRadius: "var(--radius)",
											fontWeight: "600",
											fontSize: "0.9rem",
											cursor: "pointer",
											transition: "all 0.3s ease",
											boxShadow: isSelected
												? "0 4px 12px rgba(0, 0, 0, 0.15)"
												: "none",
											transform: isSelected ? "translateY(-2px)" : "none",
										}}
									>
										{color.name}
									</motion.button>
								);
							})}
						</div>
						{clickedColor.color && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.7, duration: 0.3 }}
								style={{
									marginTop: "1rem",
									padding: "0.5rem",
									backgroundColor: "var(--primary)",
									color: "white",
									borderRadius: "var(--radius)",
									fontSize: "0.9rem",
									fontWeight: "600",
									textAlign: "center",
								}}
							>
								{t("carDetails.colors.selected")} {clickedColor.color}
							</motion.div>
						)}
					</motion.div>

					<motion.div
						className={styles.feature_highlights}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.7, duration: 0.5 }}
					>
						<motion.div
							className={styles.feature}
							whileHover={{ scale: 1.05 }}
							transition={{ duration: 0.2 }}
						>
							<Zap size={20} />
							<span>{data.Energie}</span>
						</motion.div>
						<motion.div
							className={styles.feature}
							whileHover={{ scale: 1.05 }}
							transition={{ duration: 0.2 }}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M14 7h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"></path>
								<path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
								<line x1="10" y1="7" x2="10" y2="15"></line>
								<line x1="10" y1="11" x2="10" y2="11"></line>
							</svg>
							<span>{t("carDetails.specs.transmission")} </span>
							<span>{data.Boite}</span>
						</motion.div>
						<motion.div
							className={styles.feature}
							whileHover={{ scale: 1.05 }}
							transition={{ duration: 0.2 }}
						>
							<ParkingMeter size={20} />
							<span>{data.Kilométrage} </span>
						</motion.div>
					</motion.div>

					<motion.div
						className={styles.details_card}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8, duration: 0.5 }}
						whileHover={{ y: -5 }}
					>
						<h3 className={styles.details_title}>
							{t("carDetails.details.title")}
						</h3>
						<div className={styles.details}>
							<motion.div
								className={styles.detail_item}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.9, duration: 0.3 }}
							>
								<span className={styles.detail_label}>
									{t("carDetails.details.brand")}
								</span>
								<span className={styles.detail_value}>
									{data.serie.brand.name}
								</span>
							</motion.div>
							<motion.div
								className={styles.detail_item}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.95, duration: 0.3 }}
							>
								<span className={styles.detail_label}>
									{t("carDetails.details.model")}
								</span>
								<span className={styles.detail_value}>{data.serie.name}</span>
							</motion.div>
							<motion.div
								className={styles.detail_item}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 1.0, duration: 0.3 }}
							>
								<span className={styles.detail_label}>
									{t("carDetails.details.finish")}
								</span>
								<span className={styles.detail_value}>{data.finition}</span>
							</motion.div>
							<motion.div
								className={styles.detail_item}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 1.05, duration: 0.3 }}
							>
								<span className={styles.detail_label}>
									{t("carDetails.details.year")}
								</span>
								<span className={styles.detail_value}>{data.Année}</span>
							</motion.div>
						</div>
					</motion.div>

					<motion.div
						className={styles.actions}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 1.1, duration: 0.5 }}
					>
						<motion.button
							className={`${styles.btn} ${styles.primary_btn}`}
							onClick={handleBuy}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							disabled={isLoading || clickedColor.color === ""}
							style={{
								opacity: clickedColor.color === "" ? 0.6 : 1,
								cursor: clickedColor.color === "" ? "not-allowed" : "pointer",
							}}
						>
							{isLoading
								? t("carDetails.actions.redirecting")
								: t("carDetails.actions.buy")}
						</motion.button>
						<motion.button
							className={`${styles.btn} ${styles.secondary_btn}`}
							onClick={handleAddToCart}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							disabled={isLoading || clickedColor.color === ""}
							style={{
								opacity: clickedColor.color === "" ? 0.6 : 1,
								cursor: clickedColor.color === "" ? "not-allowed" : "pointer",
							}}
						>
							{isLoading
								? t("carDetails.actions.adding")
								: t("carDetails.actions.add")}
						</motion.button>
					</motion.div>
					{clickedColor.color === "" && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 1.2, duration: 0.3 }}
							style={{
								textAlign: "center",
								color: "#dc2626",
								fontSize: "0.9rem",
								marginTop: "1rem",
								fontWeight: "500",
							}}
						>
							{t("carDetails.errors.mustSelectColor")}
						</motion.div>
					)}
				</motion.div>
			</motion.div>

			<motion.div
				className={styles.specs_section}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 1.2, duration: 0.5 }}
			>
				<h2 className={styles.section_title}>{t("carDetails.specs.title")}</h2>
				<div className={styles.specs_grid}>
					<motion.div
						className={styles.spec_item}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 1.3, duration: 0.3 }}
					>
						<span className={styles.spec_label}>
							{t("carDetails.specs.engine")}
						</span>
						<span className={styles.spec_value}>{data.Moteur}</span>
					</motion.div>
					<motion.div
						className={styles.spec_item}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 1.35, duration: 0.3 }}
					>
						<span className={styles.spec_label}>
							{t("carDetails.specs.transmission")}
						</span>
						<span className={styles.spec_value}>{data.Boite}</span>
					</motion.div>
					<motion.div
						className={styles.spec_item}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 1.4, duration: 0.3 }}
					>
						<span className={styles.spec_label}>
							{t("carDetails.specs.fuel")}
						</span>
						<span className={styles.spec_value}>{data.Energie}</span>
					</motion.div>
					<motion.div
						className={styles.spec_item}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 1.45, duration: 0.3 }}
					>
						<span className={styles.spec_label}>
							{t("carDetails.specs.mileage")}
						</span>
						<span className={styles.spec_value}>{data.Kilométrage} </span>
					</motion.div>
					<motion.div
						className={styles.spec_item}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 1.5, duration: 0.3 }}
					>
						<span className={styles.spec_label}>
							{t("carDetails.specs.year")}
						</span>
						<span className={styles.spec_value}>{data.Année}</span>
					</motion.div>
					<motion.div
						className={styles.spec_item}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 1.55, duration: 0.3 }}
					>
						<span className={styles.spec_label}>
							{t("carDetails.specs.color")}
						</span>
						<span className={styles.spec_value}>{data.colors[0].name}</span>
					</motion.div>
					{data.options?.map((option, index) => (
						<motion.div
							className={styles.spec_item}
							key={option.id}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 1.6 + index * 0.05, duration: 0.3 }}
						>
							<span className={styles.spec_label}>{option.title}</span>
							<span className={styles.spec_value}>{option.value}</span>
						</motion.div>
					))}
				</div>
			</motion.div>

			{data.description && (
				<motion.div
					className={styles.description_section}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.7, duration: 0.5 }}
				>
					<h2 className={styles.section_title}>
						{t("carDetails.description.title")}
					</h2>
					<motion.p
						className={styles.description}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1.8, duration: 0.5 }}
					>
						{data.description}
					</motion.p>
				</motion.div>
			)}
			<ToastContainer />
		</motion.div>
	);
}

export default CarDetailsComponent;
