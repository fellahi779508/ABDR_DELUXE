"use client";
import { useState, useEffect, useRef } from "react";
import { ShoppingCart, X, ArrowRight } from "lucide-react";
import { GetCarBySlug } from "@/utils/Admin";
import Image from "next/image";
import Link from "next/link";
import styles from "./CartIcon.module.css";

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
	quantity: number;
	color: string;
	id: string;
};

const CartIcon = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [cars, setCars] = useState<Car[]>([]);
	const [loading, setLoading] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Get cart from localStorage
	const getCartFromStorage = (): CartItem[] => {
		if (typeof window === "undefined") return [];
		try {
			const cart = localStorage.getItem("carDealershipCart");
			return cart ? JSON.parse(cart) : [];
		} catch (error) {
			return [];
		}
	};

	// Generate unique ID for cart items
	const generateCartItemId = (slug: string, color: string) => {
		return `${slug}-${color}`;
	};

	useEffect(() => {
		const cart = getCartFromStorage();
		setCartItems(
			cart.map((item) => ({
				...item,
				id: generateCartItemId(item.slug, item.color),
			}))
		);

		// Close dropdown when clicking outside
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		const fetchCars = async () => {
			if (cartItems.length === 0) return;

			setLoading(true);
			const uniqueSlugs = [...new Set(cartItems.map((item) => item.slug))];
			const carPromises = uniqueSlugs.map((slug) => GetCarBySlug(slug));
			const carResults = await Promise.all(carPromises);
			setCars(carResults.filter(Boolean) as Car[]);
			setLoading(false);
		};

		fetchCars();
	}, [cartItems]);

	// Listen for cart updates from other components
	useEffect(() => {
		const handleCartUpdate = () => {
			const cart = getCartFromStorage();
			setCartItems(
				cart.map((item) => ({
					...item,
					id: generateCartItemId(item.slug, item.color),
				}))
			);
		};

		window.addEventListener("cartUpdated", handleCartUpdate);
		return () => window.removeEventListener("cartUpdated", handleCartUpdate);
	}, []);

	const removeFromCart = (itemId: string) => {
		const updatedCart = cartItems.filter((item) => item.id !== itemId);
		localStorage.setItem("carDealershipCart", JSON.stringify(updatedCart));
		setCartItems(updatedCart);
		window.dispatchEvent(new Event("cartUpdated"));
	};

	const updateQuantity = (itemId: string, newQuantity: number) => {
		if (newQuantity < 1) return;

		const updatedCart = cartItems.map((item) =>
			item.id === itemId ? { ...item, quantity: newQuantity } : item
		);
		localStorage.setItem("carDealershipCart", JSON.stringify(updatedCart));
		setCartItems(updatedCart);
		window.dispatchEvent(new Event("cartUpdated"));
	};

	const getCarForItem = (slug: string) => {
		return cars.find((car) => car.slug === slug);
	};

	const getImageForColor = (car: Car, colorName: string) => {
		const color = car.colors.find((c) => c.name === colorName);
		return (
			color?.images[0]?.url ||
			car.colors[0]?.images[0]?.url ||
			"/images/placeholder.png"
		);
	};

	const getTotalPrice = () => {
		return cartItems.reduce((total, item) => {
			const car = getCarForItem(item.slug);
			return total + (car?.price || 0) * item.quantity;
		}, 0);
	};

	const getTotalItems = () => {
		return cartItems.reduce((total, item) => total + item.quantity, 0);
	};

	return (
		<div className={styles.cartContainer} ref={dropdownRef}>
			<button
				className={styles.cartButton}
				onClick={() => setIsOpen(!isOpen)}
				aria-label="Panier"
			>
				<ShoppingCart size={24} />
				{cartItems.length > 0 && (
					<span className={styles.cartBadge}>{getTotalItems()}</span>
				)}
			</button>

			{isOpen && (
				<div className={styles.cartDropdown}>
					<div className={styles.cartHeader}>
						<h3>Votre Panier ({getTotalItems()} articles)</h3>
						<button
							className={styles.closeButton}
							onClick={() => setIsOpen(false)}
						>
							<X size={20} />
						</button>
					</div>

					<div className={styles.cartContent}>
						{loading ? (
							<div className={styles.loading}>Chargement...</div>
						) : cartItems.length === 0 ? (
							<div className={styles.emptyCart}>
								<ShoppingCart size={48} />
								<p>Votre panier est vide</p>
							</div>
						) : (
							<div className={styles.cartItems}>
								{cartItems.map((item) => {
									const car = getCarForItem(item.slug);
									if (!car) return null;

									return (
										<div key={item.id} className={styles.cartItem}>
											<Image
												src={getImageForColor(car, item.color)}
												alt={`${car.serie.brand.name} ${car.serie.name}`}
												width={80}
												height={60}
												className={styles.cartItemImage}
											/>

											<div className={styles.cartItemDetails}>
												<h4 className={styles.carName}>
													{car.serie.brand.name} {car.serie.name}
												</h4>
												<p className={styles.carColor}>Couleur: {item.color}</p>
												<p className={styles.carPrice}>
													{car.price.toLocaleString()} DZD
												</p>

												<div className={styles.quantityControls}>
													<button
														className={styles.quantityBtn}
														onClick={() =>
															updateQuantity(item.id, item.quantity - 1)
														}
														disabled={item.quantity <= 1}
													>
														-
													</button>
													<span className={styles.quantity}>
														{item.quantity}
													</span>
													<button
														className={styles.quantityBtn}
														onClick={() =>
															updateQuantity(item.id, item.quantity + 1)
														}
													>
														+
													</button>
												</div>
											</div>

											<button
												className={styles.removeItemButton}
												onClick={() => removeFromCart(item.id)}
												aria-label="Supprimer"
											>
												<X size={16} />
											</button>
										</div>
									);
								})}
							</div>
						)}
					</div>

					{cartItems.length > 0 && (
						<div className={styles.cartFooter}>
							<div className={styles.cartTotal}>
								<span>Total:</span>
								<span>{getTotalPrice().toLocaleString()} DZD</span>
							</div>

							<Link
								href="/order"
								className={styles.checkoutButton}
								onClick={() => setIsOpen(false)}
							>
								<span>Finaliser la commande</span>
								<ArrowRight size={20} />
							</Link>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default CartIcon;
