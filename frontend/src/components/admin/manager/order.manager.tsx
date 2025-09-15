/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useCallback } from "react";
import styles from "./order.manager.module.css";
import {
	AcceptOrder,
	CancaleOrder,
	CompleteOrder,
	DeleteOrderById,
	GetAllOrders,
} from "@/utils/Admin";
import { toast, ToastContainer } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";

type Car = {
	Année: string;
	Boite: string;
	Energie: string;
	Kilométrage: string;
	Moteur: string;
	color: string;
	description: string;
	finition: string;
	id: string;
	isVisible: boolean;
	price: number;
	slug: string;
};

type Order = {
	address: string;
	cars: Car;
	createdAt: string;
	id: string;
	name: string;
	phone: string;
	status: "new" | "pending" | "completed" | "cancelled";
	updatedAt: string;
};

function OrderManger() {
	const [allOrders, setAllOrders] = useState<Order[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [activeTab, setActiveTab] = useState<Order["status"]>("new");

	const fetchMoreData = useCallback(async () => {
		try {
			const [newOrders, moreAvailable] = await GetAllOrders(page + 1);
			setPage((prev) => prev + 1);
			setAllOrders((prev) => {
				// Filter out duplicates
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
		// Initial data fetch
		GetAllOrders(1)
			.then(([orders, moreAvailable]) => {
				setAllOrders(orders);
				setHasMore(moreAvailable);
			})
			.catch(() => toast.error("Error loading orders"));

		// SSE setup
		const eventSource = new EventSource("http://localhost:7777/order/stream", {
			withCredentials: true,
		});

		const handleOrderEvent = (event: MessageEvent) => {
			try {
				const order: Order = JSON.parse(event.data);
				setAllOrders((prev) => {
					const existingIndex = prev.findIndex((o) => o.id === order.id);
					if (existingIndex > -1) {
						// Update existing order
						const newOrders = [...prev];
						newOrders[existingIndex] = order;
						return newOrders;
					} else {
						// Add new order at beginning for newest first ordering
						return [order, ...prev];
					}
				});
			} catch (error) {
				console.error("Error parsing SSE data:", error);
			}
		};

		eventSource.addEventListener("orderCreated", handleOrderEvent);
		eventSource.addEventListener("orderAccepted", handleOrderEvent);
		eventSource.addEventListener("orderCancelled", handleOrderEvent);
		eventSource.addEventListener("orderCompleted", handleOrderEvent);

		eventSource.addEventListener("orderDeleted", (event) => {
			try {
				const deletedOrderId = event.data;
				setAllOrders((prev) => prev.filter((o) => o.id !== deletedOrderId));
			} catch (error) {
				console.error("Error handling delete event:", error);
			}
		});

		eventSource.onerror = (error) => {
			console.error("SSE connection error:", error);
			eventSource.close();
		};

		return () => {
			eventSource.close();
		};
	}, []);

	const filteredOrders = allOrders.filter(
		(order) => order.status === activeTab
	);

	const handleOrderAction = async (
		action: () => Promise<unknown>,
		successMessage: string
	) => {
		try {
			const response = await action();
			if (response === true) {
				toast.success(successMessage);
			} else {
				throw new Error("Invalid response");
			}
		} catch (error) {
			toast.error(`Error: ${error.message}`);
		}
	};

	const acceptOrder = (orderId: string) =>
		handleOrderAction(
			() => AcceptOrder(orderId),
			"Order accepted successfully"
		);

	const cancelOrder = (orderId: string) =>
		handleOrderAction(
			() => CancaleOrder(orderId),
			"Order cancelled successfully"
		);

	const completeOrder = (orderId: string) =>
		handleOrderAction(
			() => CompleteOrder(orderId),
			"Order completed successfully"
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

	const deleteOrder = async (id: string) => {
		try {
			const resp = await DeleteOrderById(id);
			if (resp === "deleted") {
				toast.success("Order deleted successfully");
			} else {
				throw new Error("Invalid response");
			}
		} catch (error) {
			toast.error("Error deleting order");
		}
	};

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Order Management</h1>

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
							: tab.charAt(0).toUpperCase() + tab.slice(1)}{" "}
						Orders
					</button>
				))}
			</div>

			<div id="scrollableDiv" className={styles.ordersContainer}>
				<InfiniteScroll
					dataLength={allOrders.length}
					next={fetchMoreData}
					hasMore={hasMore}
					loader={<h4></h4>}
					endMessage={<p style={{ textAlign: "center" }}></p>}
					scrollableTarget="scrollableDiv"
				>
					{filteredOrders.length === 0 ? (
						<div className={styles.emptyState}>
							No {activeTab} orders found.
						</div>
					) : (
						filteredOrders.map((order) => (
							<div key={order.id} className={styles.orderCard}>
								{/* Order card content remains same */}
								<div className={styles.orderHeader}>
									<div className={styles.orderInfo}>
										<h3 className={styles.orderId}>Order #{order.id}</h3>
										<span className={styles.orderDate}>
											{formatDate(order.createdAt)}
										</span>
									</div>
									<span className={`${styles.status} ${styles[order.status]}`}>
										{order.status}
									</span>
								</div>

								<div className={styles.orderDetails}>
									<div className={styles.customerInfo}>
										<h4>Customer Information</h4>
										<p>
											<strong>Name:</strong> {order.name}
										</p>
										<p>
											<strong>Phone:</strong> {order.phone}
										</p>
										<p>
											<strong>Address:</strong> {order.address}
										</p>
									</div>

									<div className={styles.carInfo}>
										<h4>Car Details</h4>
										<p>
											<strong>Car:</strong> {order.cars.slug}
										</p>
										<p>
											<strong>Price:</strong> ${order.cars.price}
										</p>
										<p>
											<strong>Year:</strong> {order.cars.Année}
										</p>
										<p>
											<strong>Energy:</strong> {order.cars.Energie}
										</p>
										<p>
											<strong>Transmission:</strong> {order.cars.Boite}
										</p>
										<p>
											<strong>Mileage:</strong> {order.cars.Kilométrage} km
										</p>
										<p>
											<strong>Color:</strong> {order.cars.color}
										</p>
									</div>
								</div>

								<div className={styles.orderActions}>
									<button
										className={styles.deleteBtn}
										onClick={() => deleteOrder(order.id)}
									>
										Delete
									</button>
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
						))
					)}
				</InfiniteScroll>
			</div>
			<ToastContainer />
		</div>
	);
}

export default OrderManger;
