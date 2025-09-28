/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useCallback } from "react";
import styles from "./order.manager.module.css";
import {
	AcceptOrder,
	CancaleOrder,
	CompleteOrder,
	DeleteAllOrders,
	DeleteOrderById,
	GetAllOrders,
} from "@/utils/Admin";
import { toast, ToastContainer } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSocket } from "@/hooks/useSocket";
import { socketService } from "@/services/socket.service";

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
	status: "new" | "pending" | "completed" | "cancelled";
	cart: Cart;
};

function OrderManger() {
	socketService.connect();
	const [allOrders, setAllOrders] = useState<Order[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [activeTab, setActiveTab] = useState<Order["status"]>("new");
	const [loading, setLoading] = useState(true);

	// Use the socket hook for real-time updates
	useSocket("orderCreated", (newOrder: Order) => {
		setAllOrders((prev) => {
			const existingIndex = prev.findIndex((o) => o.id === newOrder.id);
			if (existingIndex > -1) {
				const newOrders = [...prev];
				newOrders[existingIndex] = newOrder;
				return newOrders;
			} else {
				return [newOrder, ...prev];
			}
		});
		console.log("New order created via socket:", newOrder);
	});

	useSocket("orderUpdated", (updatedOrder: Order) => {
		setAllOrders((prev) =>
			prev.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
		);
		console.log("Order updated via socket:", updatedOrder);
	});

	useSocket("orderDeleted", (deletedOrder: Order) => {
		setAllOrders((prev) =>
			prev.filter((order) => order.id !== deletedOrder.id)
		);
		console.log("Order deleted via socket:", deletedOrder);
	});

	const fetchMoreData = useCallback(async () => {
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
	}, [page]);

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

		// Remove the old SSE code and replace with socket connection
		// The socket connection is now handled by the useSocket hook
	}, []);

	const filteredOrders = allOrders.filter(
		(order) => order.status === activeTab
	);

	const handleOrderAction = async (
		action: () => Promise<unknown>,
		successMessage: string,
		orderId: string
	) => {
		try {
			const response = await action();
			if (response === true) {
				toast.success(successMessage);
				// Update local state to reflect the change
				setAllOrders((prev) =>
					prev.map((order) =>
						order.id === orderId
							? {
									...order,
									status: successMessage.includes("accepted")
										? "pending"
										: successMessage.includes("cancelled")
										? "cancelled"
										: successMessage.includes("completed")
										? "completed"
										: order.status,
							  }
							: order
					)
				);
			} else {
				throw new Error("Invalid response");
			}
		} catch (error: any) {
			toast.error(`Error: ${error.message}`);
		}
	};

	const acceptOrder = (orderId: string) =>
		handleOrderAction(
			() => AcceptOrder(orderId),
			"Order accepted successfully",
			orderId
		);

	const cancelOrder = (orderId: string) =>
		handleOrderAction(
			() => CancaleOrder(orderId),
			"Order cancelled successfully",
			orderId
		);

	const completeOrder = (orderId: string) =>
		handleOrderAction(
			() => CompleteOrder(orderId),
			"Order completed successfully",
			orderId
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
			} else {
				throw new Error("Invalid response");
			}
		} catch (error) {
			toast.error("Error deleting order");
		}
	};

	const getStatusCount = (status: Order["status"]) => {
		return allOrders.filter((order) => order.status === status).length;
	};

	if (loading) {
		return (
			<div className={styles.container}>
				<div className={styles.loadingState}>Loading orders...</div>
			</div>
		);
	}
	const handleDeleteAllOrders = async () => {
		const resp = await DeleteAllOrders();
		if (resp) {
			toast.success("All orders deleted successfully");
			setAllOrders([]); // Clear the orders state
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1 className={styles.title}>Order Management</h1>
				<div className={styles.stats}>
					<div className={styles.statItem}>
						<span className={styles.statNumber}>{allOrders.length}</span>
						<span className={styles.statLabel}>Total Orders</span>
					</div>
				</div>
			</div>

			<div className={styles.tabs}>
				{(["new", "pending", "completed", "cancelled"] as const).map((tab) => (
					<button
						key={tab}
						className={`${styles.tab} ${
							activeTab === tab ? styles.activeTab : ""
						}`}
						onClick={() => setActiveTab(tab)}
					>
						{tab === "cancelled"
							? "Declined"
							: tab.charAt(0).toUpperCase() + tab.slice(1)}
						<span className={styles.badge}>{getStatusCount(tab)}</span>
					</button>
				))}
			</div>
			<button
				className={styles.deleteAllBtn}
				onClick={() => handleDeleteAllOrders()}
			>
				Delete all
			</button>

			<div id="scrollableDiv" className={styles.ordersContainer}>
				{filteredOrders.length === 0 ? (
					<div className={styles.emptyState}>No {activeTab} orders found.</div>
				) : (
					filteredOrders.map((order) => (
						<div key={order.id} className={styles.orderCard}>
							<div className={styles.orderHeader}>
								<div className={styles.orderInfo}>
									<h3 className={styles.orderId}>
										Order #{order.id.slice(0, 8)}...
									</h3>
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
										${formatPrice(order.cart.total)}
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
									</div>
								</div>

								<div className={styles.cartInfo}>
									<h4>Order Items ({order.cart.soldItem.length})</h4>
									<div className={styles.itemsList}>
										{order.cart.soldItem.map((item) => (
											<div key={item.id} className={styles.cartItem}>
												<div className={styles.itemImage}>
													<div className={styles.imagePlaceholder}>
														{item.car.slug.split("-")[0].charAt(0)}
													</div>
												</div>
												<div className={styles.itemDetails}>
													<h5>{item.car.slug}</h5>
													<div className={styles.itemSpecs}>
														<span>{item.car.Année}</span>
														<span>{item.car.Energie}</span>
														<span>{item.car.Boite}</span>
														<span>{item.color}</span>
													</div>
													<div className={styles.itemMeta}>
														<span>Qty: {item.quantity}</span>
														<span className={styles.itemPrice}>
															${formatPrice(item.total)}
														</span>
													</div>
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

									{order.status === "pending" && (
										<button
											className={styles.completeBtn}
											onClick={() => completeOrder(order.id)}
										>
											Mark as Completed
										</button>
									)}

									{(order.status === "completed" ||
										order.status === "cancelled") && (
										<span className={styles.finalStatus}>
											This order is {order.status}.
										</span>
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
