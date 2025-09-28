"use client";
import { useState, useEffect } from "react";
import styles from "./order.module.css";
import {
	CreateCart,
	CreateNewOrder,
	CreateSoldItem,
	GetCarBySlug,
} from "@/utils/Admin";
import { toast, ToastContainer } from "react-toastify";
import { redirect } from "next/navigation";
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
	id?: string; // Add unique identifier
	carId?: string;
};

type Props = {
	price: number;
};

const getCartFromStorage = (): CartItem[] => {
	if (typeof window === "undefined") return [];

	try {
		const cart = localStorage.getItem("carDealershipCart");
		return cart ? JSON.parse(cart) : [];
	} catch (error) {
		console.error("Error reading cart from localStorage:", error);
		return [];
	}
};

async function getCarBySlug(slug: string): Promise<Car | null> {
	try {
		const response = await GetCarBySlug(slug);
		return response;
	} catch (error) {
		console.error("Error fetching car:", error);
		return null;
	}
}

// Generate unique ID for cart items
const generateCartItemId = (slug: string, color: string) => {
	return `${slug}-${color}`;
};

function OrderComponent({ price }: Props) {
	const [order, setOrder] = useState({
		name: "",
		email: "",
		phone: "",
		address: "",
	});
	const [address, setAddress] = useState("");
	const [wilaya, setWilaya] = useState("");
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [cars, setCars] = useState<Car[]>([]);
	const [loading, setLoading] = useState(true);
	const [quantities, setQuantities] = useState<{ [itemId: string]: number }>(
		{}
	);

	useEffect(() => {
		const fetchCars = async () => {
			setLoading(true);

			// Read cart from localStorage
			const cartItemsData = getCartFromStorage();
			if (cartItemsData.length === 0) {
				redirect("/buy");
			}

			// Add unique IDs to cart items
			const cartItemsWithIds = cartItemsData.map((item) => ({
				...item,
				id: generateCartItemId(item.slug, item.color),
			}));

			setCartItems(cartItemsWithIds);

			if (cartItemsWithIds.length === 0) {
				toast.error("Votre panier est vide");
				setLoading(false);
				return;
			}

			// Get unique slugs to avoid duplicate API calls
			const uniqueSlugs = [
				...new Set(cartItemsWithIds.map((item) => item.slug)),
			];
			const carPromises = uniqueSlugs.map((slug) => getCarBySlug(slug));
			const carResults = await Promise.all(carPromises);
			const validCars = carResults.filter(Boolean) as Car[];

			setCars(validCars);

			// Initialize quantities from localStorage using unique IDs
			const initialQuantities: { [itemId: string]: number } = {};
			cartItemsWithIds.forEach((item) => {
				initialQuantities[item.id!] = item.quantity;
			});
			setQuantities(initialQuantities);
			setLoading(false);
		};

		fetchCars();
	}, []);

	const updateQuantity = (itemId: string, newQuantity: number) => {
		if (newQuantity < 1) return;

		setQuantities((prev) => ({
			...prev,
			[itemId]: newQuantity,
		}));

		// Update localStorage
		const cartItemsData = getCartFromStorage();
		const updatedCart = cartItemsData.map((item) =>
			generateCartItemId(item.slug, item.color) === itemId
				? { ...item, quantity: newQuantity }
				: item
		);
		localStorage.setItem("carDealershipCart", JSON.stringify(updatedCart));
		setCartItems(
			updatedCart.map((item) => ({
				...item,
				id: generateCartItemId(item.slug, item.color),
			}))
		);
	};

	const removeCar = (itemId: string) => {
		if (cartItems.length <= 1) {
			toast.error("Vous ne pouvez pas supprimer le dernier véhicule");
			return;
		}

		// Update localStorage
		const cartItemsData = getCartFromStorage();
		const updatedCart = cartItemsData.filter(
			(item) => generateCartItemId(item.slug, item.color) !== itemId
		);
		localStorage.setItem("carDealershipCart", JSON.stringify(updatedCart));

		setCartItems(
			updatedCart.map((item) => ({
				...item,
				id: generateCartItemId(item.slug, item.color),
			}))
		);

		// Update quantities state
		setQuantities((prev) => {
			const newQuantities = { ...prev };
			delete newQuantities[itemId];
			return newQuantities;
		});
	};

	const getTotalPrice = () => {
		return cartItems.reduce((total, item) => {
			const car = cars.find((c) => c.slug === item.slug);
			return total + (car?.price || 0) * (quantities[item.id!] || 1);
		}, 0);
	};

	// Function to get car data for a cart item
	const getCarForItem = (slug: string) => {
		return cars.find((car) => car.slug === slug);
	};

	// Function to get image for a specific color
	const getImageForColor = (car: Car, colorName: string) => {
		const color = car.colors.find((c) => c.name === colorName);
		return (
			color?.images[0]?.url ||
			car.colors[0]?.images[0]?.url ||
			"/images/placeholder.png"
		);
	};

	async function HandleSubmit() {
		if (!order.name || !order.email || !order.phone || !address || !wilaya) {
			toast.error("Veuillez remplir tous les champs");
			return;
		}

		// Validate email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(order.email)) {
			toast.error("Veuillez entrer une adresse email valide");
			return;
		}

		const MainAddress = address.concat("-").concat(wilaya);
		const newOrder = {
			...order,
			address: MainAddress,
			items: cartItems.map((item) => {
				const car = getCarForItem(item.slug);
				return {
					carSlug: item.slug,
					quantity: quantities[item.id!] || 1,
					price: car?.price || 0,
					color: item.color,
				};
			}),
			totalPrice: getTotalPrice(),
		};

		// const result = await CreateNewOrder(newOrder);
		const soldItems = [];

		console.log(newOrder.items);
		for (const item of newOrder.items) {
			const soldItem = await CreateSoldItem(
				item.quantity,
				item.carSlug,
				item.color
			);
			if (soldItem.id) {
				soldItems.push(soldItem.id);
			} else {
				console.error("Une erreur s'est produite lors de la commande");
				return;
			}
		}
		console.log(soldItems);
		const cart = await CreateCart(soldItems);
		if (cart.id) {
			const order = await CreateNewOrder({
				name: newOrder.name,
				email: newOrder.email,
				phone: newOrder.phone,
				address: newOrder.address,
				cartId: cart.id,
			});
			if (order) {
				toast.success("Commande effectuée avec succès");
				// Clear cart after successful order
				localStorage.removeItem("carDealershipCart");
				redirect("/order/completed");
			} else {
				console.log("Une erreur s'est produite lors de la commande");
			}
		} else {
			console.log("Une erreur s'est produite lors de la commande");
			redirect("/order/error");
		}
	}

	if (loading) {
		return (
			<div className={styles.container}>
				<div className={styles.loading}>Chargement de votre commande...</div>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<div className={styles.mainLayout}>
				{/* Left Column - Order Summary */}
				<div className={styles.orderSummary}>
					<h2 className={styles.summaryTitle}>Récapitulatif de la commande</h2>

					<div className={styles.cartItems}>
						{cartItems.map((item) => {
							const car = getCarForItem(item.slug);
							if (!car) return null;

							return (
								<div key={item.id} className={styles.cartItem}>
									<div className={styles.carImage}>
										<Image
											src={getImageForColor(car, item.color)}
											alt={`${car.serie.brand.name} ${car.serie.name}`}
											width={120}
											height={80}
											className={styles.image}
										/>
									</div>

									<div className={styles.carDetails}>
										<h3 className={styles.carTitle}>
											{car.serie.brand.name} {car.serie.name} {car.finition}
										</h3>
										<p className={styles.carSpecs}>
											{car.Année} • {car.Kilométrage} • {car.Boite} •{" "}
											{car.Energie}
										</p>
										{/* Display the selected color */}
										<p className={styles.carColor}>
											Couleur: <strong>{item.color}</strong>
										</p>
										<p className={styles.carPrice}>
											{car.price.toLocaleString()} DZD
										</p>

										<div className={styles.quantityControls}>
											<span className={styles.quantityLabel}>Quantité:</span>
											<button
												className={styles.quantityBtn}
												onClick={() =>
													updateQuantity(item.id!, quantities[item.id!] - 1)
												}
												disabled={quantities[item.id!] <= 1}
											>
												-
											</button>
											<span className={styles.quantity}>
												{quantities[item.id!]}
											</span>
											<button
												className={styles.quantityBtn}
												onClick={() =>
													updateQuantity(item.id!, quantities[item.id!] + 1)
												}
											>
												+
											</button>

											{cartItems.length > 1 && (
												<button
													className={styles.removeBtn}
													onClick={() => removeCar(item.id!)}
												>
													Supprimer
												</button>
											)}
										</div>
									</div>
								</div>
							);
						})}
					</div>

					<div className={styles.priceSummary}>
						<div className={styles.subtotal}>
							<span>Sous-total:</span>
							<span>{getTotalPrice().toLocaleString()} DZD</span>
						</div>

						<div className={styles.total}>
							<span>Total:</span>
							<span>{getTotalPrice().toLocaleString()} DZD</span>
						</div>
					</div>
				</div>

				{/* Right Column - Order Form */}
				<div className={styles.orderForm}>
					<div className={styles.contactHeader}>
						<h2>Contacter nous : </h2>
						<a href="tel:+213 555 123 456" className={styles.phoneLink}>
							+213 555 123 456
						</a>
					</div>

					<h1 className={styles.orDivider}>ou</h1>

					<h2 className={styles.title}>Passer votre commande</h2>

					<div className={styles.inputFields}>
						<div className={styles.field}>
							<label htmlFor="fullName">Nom complet</label>
							<input
								type="text"
								id="fullName"
								required
								placeholder="Entrez votre nom complet"
								onChange={(e) => setOrder({ ...order, name: e.target.value })}
							/>
						</div>

						<div className={styles.field}>
							<label htmlFor="email">Email</label>
							<input
								type="email"
								id="email"
								required
								placeholder="Entrez votre adresse email"
								onChange={(e) => setOrder({ ...order, email: e.target.value })}
							/>
						</div>

						<div className={styles.field}>
							<label htmlFor="wilaya">Wilaya :</label>
							<input
								type="text"
								id="wilaya"
								placeholder="Entrez votre wilaya"
								onChange={(e) => setWilaya(e.target.value)}
							/>
						</div>

						<div className={styles.field}>
							<label htmlFor="address">Adresse :</label>
							<input
								type="text"
								id="address"
								placeholder="Entrez votre adresse"
								onChange={(e) => setAddress(e.target.value)}
							/>
						</div>

						<div className={styles.field}>
							<label htmlFor="phone">Numéro de téléphone</label>
							<input
								type="number"
								id="phone"
								required
								placeholder="Entrez votre numéro de téléphone"
								onChange={(e) => setOrder({ ...order, phone: e.target.value })}
							/>
						</div>
					</div>

					<button className={styles.submitButton} onClick={HandleSubmit}>
						Commander pour {getTotalPrice().toLocaleString()} DZD
					</button>
				</div>
			</div>
			<ToastContainer />
		</div>
	);
}

export default OrderComponent;
