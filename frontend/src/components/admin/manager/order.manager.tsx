/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import styles from "./order.manager.module.css";
import {
	AcceptOrder,
	CancaleOrder,
	CompleteOrder,
	DeleteAllOrders,
	DeleteOrderById,
	DeleteSoldItemById,
	DeliverOrder,
	ExportOrderToExcel,
	GetAllOrders,
	RefundOrder,
	SearchOrders,
	UpdateSoldItemQantity,
} from "@/utils/Admin";
import { toast, ToastContainer } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSocket } from "@/hooks/useSocket";
import { socketService } from "@/services/socket.service";
import Image from "next/image";
import { Color } from "@/utils/Types";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Car = {
	id: string;
	finition: string;
	price: number;
	Moteur: string;
	Energie: string;
	Boite: string;
	Kilométrage: string;
	Année: string;
	description: string;
	slug: string;
	isVisible: boolean;
	status: string;
	isShiped: boolean;
	oldPrice: number;
	colors: Color[];
	serie: { id: number; name: string; brand: { id: number; name: string } };
};

type SoldItem = {
	id: number;
	quantity: number;
	car: Car;
	total: number;
	createdAt: string;
	color: string;
};

type Cart = {
	id: number;
	soldItem: SoldItem[];
	total: number;
};

type Order = {
	id: string;
	name: string;
	phone: string;
	address: string;
	email: string;
	createdAt: string;
	updatedAt: string;
	status:
		| "new"
		| "pending"
		| "completed"
		| "cancelled"
		| "delivered"
		| "refunded";
	cart: Cart;
	OrderCode: string;
	passport: string;
};

function OrderManger() {
	const router = useRouter();
	socketService.connect();
	const [allOrders, setAllOrders] = useState<Order[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	// activeTab is one of our UI tabs (maps to real backend statuses)
	const [activeTab, setActiveTab] = useState<
		"new" | "pending" | "paid" | "delivered" | "declined"
	>("new");
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	// Search state
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const [searchResults, setSearchResults] = useState<Order[]>([]);

	// helper to try to fetch a full order by id using your GetAllOrders(0) endpoint
	const fetchOrderDetails = async (orderId: string): Promise<Order | null> => {
		try {
			const [orders] = await GetAllOrders(0);
			const found = orders.find((o: Order) => o.id === orderId);
			return found || null;
		} catch (err) {
			console.warn("Failed to fetch order details for", orderId, err);
			return null;
		}
	};

	// Use the socket hook for real-time updates - FIXED: Always fetch full order details for new orders
	useSocket("orderCreated", async (raw: any) => {
		// Always try to fetch full order details for new orders
		const fullOrder = await fetchOrderDetails(raw.id);

		if (fullOrder) {
			console.log("Fetched full order details:", fullOrder);
			setAllOrders((prev) => {
				const existingIndex = prev.findIndex((o) => o.id === fullOrder.id);
				if (existingIndex > -1) {
					const newOrders = [...prev];
					newOrders[existingIndex] = fullOrder;
					return newOrders;
				} else {
					return [fullOrder, ...prev];
				}
			});
			// Also update search results if searching
			if (isSearching) {
				setSearchResults((prev) => {
					const existingIndex = prev.findIndex((o) => o.id === fullOrder.id);
					if (existingIndex > -1) {
						const newResults = [...prev];
						newResults[existingIndex] = fullOrder;
						return newResults;
					} else {
						// Only add to search results if it matches the current search query
						if (doesOrderMatchSearch(fullOrder, searchQuery)) {
							return [fullOrder, ...prev];
						}
						return prev;
					}
				});
			}
		} else {
			// Fallback: use the raw data and schedule a retry
			console.warn(
				"Could not fetch full order details, using raw data and will retry"
			);
			const formattedOrder: Order = {
				...raw,
				status: raw?.status || "new",
				OrderCode:
					raw?.OrderCode || `ORD-${raw?.id?.slice(0, 8) ?? Date.now()}`,
				cart: raw?.cart || { soldItem: [], total: 0, id: Date.now() }, // Ensure cart has required structure
			};

			setAllOrders((prev) => {
				const existingIndex = prev.findIndex((o) => o.id === formattedOrder.id);
				if (existingIndex > -1) {
					const newOrders = [...prev];
					newOrders[existingIndex] = formattedOrder;
					return newOrders;
				} else {
					return [formattedOrder, ...prev];
				}
			});

			// Update search results if searching
			if (isSearching && doesOrderMatchSearch(formattedOrder, searchQuery)) {
				setSearchResults((prev) => {
					const existingIndex = prev.findIndex(
						(o) => o.id === formattedOrder.id
					);
					if (existingIndex > -1) {
						const newResults = [...prev];
						newResults[existingIndex] = formattedOrder;
						return newResults;
					} else {
						return [formattedOrder, ...prev];
					}
				});
			}

			// Retry fetching after a delay
			setTimeout(async () => {
				const retriedOrder = await fetchOrderDetails(raw.id);
				if (retriedOrder) {
					setAllOrders((prev) =>
						prev.map((order) =>
							order.id === retriedOrder.id ? retriedOrder : order
						)
					);
					if (isSearching) {
						setSearchResults((prev) =>
							prev.map((order) =>
								order.id === retriedOrder.id ? retriedOrder : order
							)
						);
					}
				}
			}, 2000); // Retry after 2 seconds
		}
	});

	// Also update the orderUpdated handler to be more robust
	useSocket("orderUpdated", async (raw: any) => {
		console.log("Order updated via socket:", raw);

		// Always try to fetch the latest full order details
		const fullOrder = await fetchOrderDetails(raw.id);

		if (fullOrder) {
			setAllOrders((prev) =>
				prev.map((order) => (order.id === fullOrder.id ? fullOrder : order))
			);
			// Update search results if searching
			if (isSearching) {
				setSearchResults((prev) =>
					prev.map((order) => (order.id === fullOrder.id ? fullOrder : order))
				);
			}
		} else {
			// Fallback to raw data if fetch fails
			const formattedOrder: Order = {
				...raw,
				status: raw?.status || "new",
				OrderCode:
					raw?.OrderCode || `ORD-${raw?.id?.slice(0, 8) ?? Date.now()}`,
				cart: raw?.cart || { soldItem: [], total: 0, id: Date.now() },
			};

			setAllOrders((prev) =>
				prev.map((order) =>
					order.id === formattedOrder.id ? formattedOrder : order
				)
			);
			if (isSearching) {
				setSearchResults((prev) =>
					prev.map((order) =>
						order.id === formattedOrder.id ? formattedOrder : order
					)
				);
			}
		}
	});

	useSocket("orderDeleted", (deletedOrder: any) => {
		console.log("Order deleted via socket:", deletedOrder);
		if (!deletedOrder || !deletedOrder.id) return;
		setAllOrders((prev) =>
			prev.filter((order) => order.id !== deletedOrder.id)
		);
		// Also remove from search results
		if (isSearching) {
			setSearchResults((prev) =>
				prev.filter((order) => order.id !== deletedOrder.id)
			);
		}
	});

	const fetchMoreData = useCallback(async () => {
		if (isSearching) return; // Don't fetch more when searching

		try {
			const [newOrders, moreAvailable] = await GetAllOrders(page + 1);
			setPage((prev) => prev + 1);
			setAllOrders((prev) => {
				const uniqueOrders = newOrders.filter(
					(newOrder: any) => !prev.some((order) => order.id === newOrder.id)
				);
				return [...prev, ...uniqueOrders];
			});
			setHasMore(moreAvailable);
		} catch (error) {
			toast.error("Error loading more orders");
		}
	}, [page, isSearching]);

	const refreshOrders = useCallback(async () => {
		try {
			setRefreshing(true);
			const [orders, moreAvailable] = await GetAllOrders(0);
			setAllOrders(orders);
			setHasMore(moreAvailable);
			setPage(1);

			// If currently searching, re-run the search with updated data
			if (isSearching && searchQuery) {
				handleSearch(searchQuery);
			}

			toast.success("Orders refreshed successfully");
		} catch (error) {
			toast.error("Error refreshing orders");
		} finally {
			setRefreshing(false);
		}
	}, [isSearching, searchQuery]);

	useEffect(() => {
		setLoading(true);
		GetAllOrders(0)
			.then(([orders, moreAvailable]) => {
				setAllOrders(orders);
				setHasMore(moreAvailable);
				setLoading(false);
			})
			.catch(() => {
				toast.error("Error loading orders");
				setLoading(false);
			});
	}, []);

	// Helper function to check if order matches search query
	const doesOrderMatchSearch = (order: Order, query: string): boolean => {
		if (!query.trim()) return false;

		const searchLower = query.toLowerCase();
		return (
			order.OrderCode?.toLowerCase().includes(searchLower) ||
			order.name?.toLowerCase().includes(searchLower) ||
			order.email?.toLowerCase().includes(searchLower) ||
			order.phone?.toLowerCase().includes(searchLower) ||
			order.address?.toLowerCase().includes(searchLower) ||
			order.passport?.toLowerCase().includes(searchLower) ||
			order.cart.soldItem.some(
				(item) =>
					item.car.slug?.toLowerCase().includes(searchLower) ||
					item.color?.toLowerCase().includes(searchLower)
			)
		);
	};

	// Search handler
	const handleSearch = async (query: string) => {
		setSearchQuery(query);

		if (!query.trim()) {
			setIsSearching(false);
			setSearchResults([]);
			return;
		}

		try {
			setIsSearching(true);
			const results = await SearchOrders(query);
			setSearchResults(results);
		} catch (error) {
			toast.error("Error searching orders");
			console.error("Search error:", error);
		}
	};

	// Clear search
	const clearSearch = () => {
		setSearchQuery("");
		setIsSearching(false);
		setSearchResults([]);
	};

	/** use this to delete one of the cart items : await DeleteSoldItemById(soldItem.id); */

	// helper: map our UI tab to actual backend order.status
	const mapTabToStatus = (tab: typeof activeTab) => {
		if (tab === "paid") return "completed";
		if (tab === "declined") return "cancelled";
		// 'new', 'pending', 'delivered' map directly
		return tab;
	};

	const getStatusCount = (tab: typeof activeTab) => {
		const realStatus = mapTabToStatus(tab);
		return allOrders.filter((order) => order.status === realStatus).length;
	};

	// Use search results when searching, otherwise use filtered orders
	const filteredOrders = isSearching
		? searchResults.filter(
				(order) => order.status === mapTabToStatus(activeTab)
		  )
		: allOrders.filter((order) => order.status === mapTabToStatus(activeTab));

	// generic handler: accept an API action and optional status to set locally
	const handleOrderAction = async (
		action: () => Promise<unknown>,
		successMessage: string,
		orderId: string,
		newStatus?: Order["status"]
	) => {
		try {
			const response = await action();
			// allow either true, 'deleted', or truthy response according to API
			if (response === true || response === "deleted" || !!response) {
				toast.success(successMessage);
				if (newStatus) {
					setAllOrders((prev) =>
						prev.map((order) =>
							order.id === orderId ? { ...order, status: newStatus } : order
						)
					);
					// Also update search results if searching
					if (isSearching) {
						setSearchResults((prev) =>
							prev.map((order) =>
								order.id === orderId ? { ...order, status: newStatus } : order
							)
						);
					}
				}
			} else {
				throw new Error("Invalid response");
			}
		} catch (error: any) {
			toast.error(`Error: ${error.message || "operation failed"}`);
		}
	};

	const acceptOrder = (orderId: string) =>
		handleOrderAction(
			() => AcceptOrder(orderId),
			"Order accepted successfully",
			orderId,
			"pending"
		);

	const cancelOrder = (orderId: string) =>
		handleOrderAction(
			() => CancaleOrder(orderId),
			"Order cancelled successfully",
			orderId,
			"cancelled"
		);

	const completeOrder = (orderId: string) =>
		handleOrderAction(
			() => CompleteOrder(orderId),
			"Order marked paid successfully",
			orderId,
			"completed" // backend status remains 'completed'
		);

	const deliverOrder = (orderId: string) =>
		handleOrderAction(
			() => DeliverOrder(orderId),
			"Order marked delivered successfully",
			orderId,
			"delivered"
		);

	const retrieveOrder = (orderId: string) =>
		handleOrderAction(
			() => AcceptOrder(orderId),
			"Order retrieved (accepted)",
			orderId,
			"pending"
		);

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("en-US").format(price);
	};

	const deleteOrder = async (id: string) => {
		try {
			const resp = await DeleteOrderById(id);
			if (resp === "deleted") {
				toast.success("Order deleted successfully");
				setAllOrders((prev) => prev.filter((order) => order.id !== id));
				// Also remove from search results
				if (isSearching) {
					setSearchResults((prev) => prev.filter((order) => order.id !== id));
				}
			} else {
				throw new Error("Invalid response");
			}
		} catch (error) {
			toast.error("Error deleting order");
		}
	};

	// remove one sold item from an order's cart
	const removeSoldItem = async (orderId: string, soldItemId: number) => {
		try {
			const resp = await DeleteSoldItemById(soldItemId);
			if (resp === "deleted" || resp === true || !!resp) {
				toast.success("Item removed from cart");
				setAllOrders((prev) =>
					prev.map((order) => {
						if (order.id !== orderId) return order;
						const remaining = order.cart.soldItem.filter(
							(si) => si.id !== soldItemId
						);
						const newTotal = remaining.reduce(
							(sum, it) => sum + Number(it.total),
							0
						);
						return {
							...order,
							cart: {
								...order.cart,
								soldItem: remaining,
								total: newTotal,
							},
						};
					})
				);
				// Also update search results
				if (isSearching) {
					setSearchResults((prev) =>
						prev.map((order) => {
							if (order.id !== orderId) return order;
							const remaining = order.cart.soldItem.filter(
								(si) => si.id !== soldItemId
							);
							const newTotal = remaining.reduce(
								(sum, it) => sum + Number(it.total),
								0
							);
							return {
								...order,
								cart: {
									...order.cart,
									soldItem: remaining,
									total: newTotal,
								},
							};
						})
					);
				}
			} else {
				throw new Error("Invalid response");
			}
		} catch (err: any) {
			toast.error(`Error removing item: ${err?.message || "failed"}`);
		}
	};

	// update quantity of a sold item
	const updateQuantity = async (
		orderId: string,
		soldItemId: number,
		newQuantity: number
	) => {
		if (newQuantity < 1) {
			toast.error("Quantity must be at least 1");
			return;
		}

		try {
			const resp = await UpdateSoldItemQantity(soldItemId, newQuantity);
			if (resp === true || resp === "updated" || !!resp) {
				toast.success("Quantity updated successfully");

				// Update local state with new quantity and recalculate total
				const updateOrderState = (prevOrders: Order[]) =>
					prevOrders.map((order) => {
						if (order.id !== orderId) return order;

						const updatedSoldItems = order.cart.soldItem.map((item) => {
							if (item.id !== soldItemId) return item;

							// Calculate new total based on car price and new quantity
							const unitPrice = item.car.price; // Use the car's base price
							const newTotal = unitPrice * newQuantity;

							return {
								...item,
								quantity: newQuantity,
								total: newTotal,
							};
						});

						// Recalculate cart total
						const newCartTotal = updatedSoldItems.reduce(
							(sum, item) => sum + item.total,
							0
						);

						return {
							...order,
							cart: {
								...order.cart,
								soldItem: updatedSoldItems,
								total: newCartTotal,
							},
						};
					});

				setAllOrders(updateOrderState);
				// Also update search results
				if (isSearching) {
					setSearchResults(updateOrderState);
				}
			} else {
				throw new Error("Invalid response");
			}
		} catch (err: any) {
			toast.error(`Error updating quantity: ${err?.message || "failed"}`);
		}
	};

	const handleDeleteAllOrders = async () => {
		const resp = await DeleteAllOrders();
		if (resp) {
			toast.success("All orders deleted successfully");
			setAllOrders([]); // Clear the orders state
			setSearchResults([]); // Clear search results too
		}
	};

	if (loading) {
		return (
			<div className={styles.container}>
				<div className={styles.loadingState}>Loading orders...</div>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1 className={styles.title}>Order Management</h1>
				<div className={styles.headerActions}>
					<button
						className={styles.refreshBtn}
						onClick={refreshOrders}
						disabled={refreshing}
					>
						{refreshing ? "Refreshing..." : "Refresh Orders"}
					</button>
				</div>
				<div className={styles.stats}>
					<div className={styles.statItem}>
						<span className={styles.statNumber}>{allOrders.length}</span>
						<span className={styles.statLabel}>Total Orders</span>
					</div>
				</div>
			</div>

			{/* Search Bar */}
			<div className={styles.searchSection}>
				<div className={styles.searchContainer}>
					<input
						type="text"
						placeholder="Search orders by code, name, email, phone, address, or passport..."
						value={searchQuery}
						onChange={(e) => handleSearch(e.target.value)}
						className={styles.searchInput}
					/>
					{searchQuery && (
						<button onClick={clearSearch} className={styles.clearSearchBtn}>
							Clear
						</button>
					)}
				</div>
				{isSearching && (
					<div className={styles.searchInfo}>
						Showing {filteredOrders.length} search results for "{searchQuery}"
					</div>
				)}
			</div>

			<div className={styles.tabs}>
				{(["new", "pending", "paid", "delivered", "declined"] as const).map(
					(tab) => (
						<button
							key={tab}
							className={`${styles.tab} ${
								activeTab === tab ? styles.activeTab : ""
							}`}
							onClick={() => setActiveTab(tab)}
						>
							{tab === "declined"
								? "Declined"
								: tab.charAt(0).toUpperCase() + tab.slice(1)}
							<span className={styles.badge}>{getStatusCount(tab)}</span>
						</button>
					)
				)}
			</div>
			<div style={{ display: "flex", gap: "1rem" }}>
				<button
					className={styles.deleteAllBtn}
					onClick={() => handleDeleteAllOrders()}
				>
					Delete all
				</button>
				<Link
					className={styles.deleteAllBtn}
					style={{ backgroundColor: "var(--primary)" }}
					href={`${process.env.NEXT_PUBLIC_API_URL}/order/export/excel/`}
				>
					Export Orders
				</Link>
			</div>

			<div id="scrollableDiv" className={styles.ordersContainer}>
				{filteredOrders.length === 0 ? (
					<div className={styles.emptyState}>
						{isSearching
							? `No ${activeTab} orders found for "${searchQuery}".`
							: `No ${activeTab} orders found.`}
					</div>
				) : (
					filteredOrders.map((order, index) => (
						<div key={index} className={styles.orderCard}>
							<div className={styles.orderHeader}>
								<div className={styles.orderInfo}>
									<h3 className={styles.orderId}>Order {order.OrderCode}</h3>
									<span className={styles.orderDate}>
										{formatDate(order.createdAt)}
									</span>
									<span className={styles.customerEmail}>{order.email}</span>
								</div>
								<div className={styles.headerRight}>
									<span className={`${styles.status} ${styles[order.status]}`}>
										{order.status}
									</span>
									<span className={styles.totalAmount}>
										{formatPrice(order.cart.total)} DZD
									</span>
								</div>
							</div>

							<div className={styles.orderDetails}>
								<div className={styles.customerInfo}>
									<h4>Customer Information</h4>
									<div className={styles.infoGrid}>
										<div className={styles.infoItem}>
											<strong>Name:</strong>
											<span>{order.name}</span>
										</div>
										<div className={styles.infoItem}>
											<strong>Phone:</strong>
											<span>{order.phone}</span>
										</div>
										<div className={styles.infoItem}>
											<strong>Address:</strong>
											<span>{order.address}</span>
										</div>
										<div className={styles.infoItem}>
											<strong>Email:</strong>
											<span>{order.email}</span>
										</div>
										<div className={styles.infoItem}>
											<strong>Passport Number:</strong>
											<span>{order.passport}</span>
										</div>
									</div>
								</div>

								<div className={styles.cartInfo} key={order.id}>
									<h4>Order Items ({order.cart.soldItem.length})</h4>
									<div className={styles.itemsList}>
										{order.cart.soldItem.map((item) => (
											<div key={item.id} className={styles.cartItem}>
												<div className={styles.itemImage}>
													<Image
														src={
															item.car.colors?.find(
																(color) => item.color === color.name
															)?.images?.[0]?.url || "/images/placeholder.png"
														}
														alt={item.car.slug}
														width={100}
														height={100}
														style={{
															objectFit: "cover",
															borderRadius: "5px",
															cursor: "pointer",
														}}
														onClick={() => router.push(`/buy/${item.car.slug}`)}
													/>
												</div>
												<div className={styles.itemDetails}>
													<h5>
														{item.car.serie.brand.name} {item.car.serie.name}{" "}
														{item.car.finition}
													</h5>
													<div className={styles.itemSpecs}>
														<span>{item.car.Année}</span>
														<span>{item.car.Energie}</span>
														<span>{item.car.Boite}</span>
														<span>{item.color}</span>
													</div>
													<div className={styles.itemMeta}>
														<div className={styles.quantityControl}>
															<label>Qty:</label>
															<input
																type="number"
																min="1"
																value={item.quantity}
																onChange={(e) => {
																	const newQuantity =
																		parseInt(e.target.value) || 1;
																	updateQuantity(
																		order.id,
																		item.id,
																		newQuantity
																	);
																}}
																className={styles.quantityInput}
															/>
														</div>
														<span className={styles.itemPrice}>
															{formatPrice(item.total)} DZD
														</span>
													</div>
												</div>

												{/* Remove item button (works with DeleteSoldItemById) */}
												<div>
													<button
														className={styles.removeItemBtn}
														onClick={() => removeSoldItem(order.id, item.id)}
													>
														Remove
													</button>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>

							<div className={styles.orderActions}>
								<button
									className={styles.deleteBtn}
									onClick={() => deleteOrder(order.id)}
								>
									Delete Order
								</button>

								<div className={styles.actionGroup}>
									{/* NEW */}
									{order.status === "new" && (
										<>
											<button
												className={styles.acceptBtn}
												onClick={() => acceptOrder(order.id)}
											>
												Accept Order
											</button>
											<button
												className={styles.declineBtn}
												onClick={() => cancelOrder(order.id)}
											>
												Decline Order
											</button>
										</>
									)}

									{/* PENDING: can mark as paid or decline */}
									{order.status === "pending" && (
										<>
											<button
												className={styles.completeBtn}
												onClick={() => completeOrder(order.id)}
											>
												Mark as Paid
											</button>
											<button
												className={styles.declineBtn}
												onClick={() => cancelOrder(order.id)}
											>
												Decline Order
											</button>
										</>
									)}

									{/* PAID (backend 'completed'): can mark as delivered */}
									{order.status === "completed" && (
										<>
											<button
												className={styles.acceptBtn}
												onClick={() => deliverOrder(order.id)}
											>
												Mark as Delivered
											</button>
											<span className={styles.finalStatus}>
												This order is paid.
											</span>
										</>
									)}

									{/* DELIVERED: only final/delete */}
									{order.status === "delivered" && (
										<span className={styles.finalStatus}>
											This order is delivered.
										</span>
									)}

									{/* DECLINED (backend 'cancelled'): retrieve (accept) or delete */}
									{order.status === "cancelled" && (
										<>
											<button
												className={styles.acceptBtn}
												onClick={() => retrieveOrder(order.id)}
											>
												Retrieve
											</button>
											<span className={styles.finalStatus}>
												This order is declined.
											</span>
										</>
									)}
								</div>
							</div>
						</div>
					))
				)}
			</div>
			<ToastContainer />
		</div>
	);
}

export default OrderManger;
