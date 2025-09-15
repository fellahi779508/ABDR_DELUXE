"use client";
import { useEffect, useState } from "react";
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
	const fetchMoreData = async () => {
		const [newOrders, moreAvailable] = await GetAllOrders(page + 1);
		setPage((prev) => prev + 1);
		setAllOrders((prev) => [...prev, ...newOrders]);
		setHasMore(moreAvailable);
	};
	useEffect(() => {
		GetAllOrders(1).then((res) => (setAllOrders(res[0]), setHasMore(res[1])));
		const eventSource = new EventSource("http://localhost:7777/order/stream");

		eventSource.addEventListener("orderCreated", (event) => {
			const newOrder: Order = JSON.parse(event.data);
			setAllOrders((prev) => [...prev, newOrder]);
		});

		eventSource.addEventListener("orderAccepted", (event) => {
			const updatedOrder: Order = JSON.parse(event.data);
			setAllOrders((prev) =>
				prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
			);
		});

		eventSource.addEventListener("orderCancelled", (event) => {
			const updatedOrder: Order = JSON.parse(event.data);
			setAllOrders((prev) =>
				prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
			);
		});

		eventSource.addEventListener("orderCompleted", (event) => {
			const updatedOrder: Order = JSON.parse(event.data);
			setAllOrders((prev) =>
				prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
			);
		});

		eventSource.addEventListener("orderDeleted", (event) => {
			const deletedOrder: string = event.data;
			setAllOrders((prev) => prev.filter((o) => o.id !== deletedOrder));
		});
		return () => {
			eventSource.close();
		};
	}, []);

	const [activeTab, setActiveTab] = useState<Order["status"]>("new");


	const filteredOrders = allOrders.filter(
		(order) => order.status === activeTab
	);

	const acceptOrder = async (orderId: string) => {
		const response = await AcceptOrder(orderId);
		if (response === true) {
			toast.success("Order accepted successfully");
		}
		toast.error("Error accepting order");
	};

	const cancelOrder = async (orderId: string) => {
		const response = await CancaleOrder(orderId);
		if (response === true) {
			toast.success("Order cancelled successfully");
		}
		toast.error("Error cancelling order");
	};

	const completeOrder = async (orderId: string) => {
		const response = await CompleteOrder(orderId);
		if (response === true) {
			toast.success("Order completed successfully");
		}
		toast.error("Error completing order");
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	async function deleteOrder(id: string) {
		const resp = await DeleteOrderById(id);
		if (resp === "deleted") {
			toast.success("Order deleted successfully");
		}
		toast.error("Error deleting order");
	}

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Order Management</h1>

			<div className={styles.tabs}>
				<button
					className={`${styles.tab} ${
						activeTab === "new" ? styles.activeTab : ""
					}`}
					onClick={() => setActiveTab("new")}
				>
					New Orders
				</button>

				<button
					className={`${styles.tab} ${
						activeTab === "pending" ? styles.activeTab : ""
					}`}
					onClick={() => setActiveTab("pending")}
				>
					Pending
				</button>

				<button
					className={`${styles.tab} ${
						activeTab === "completed" ? styles.activeTab : ""
					}`}
					onClick={() => setActiveTab("completed")}
				>
					Completed
				</button>

				<button
					className={`${styles.tab} ${
						activeTab === "cancelled" ? styles.activeTab : ""
					}`}
					onClick={() => setActiveTab("cancelled")}
				>
					Declined
				</button>
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
