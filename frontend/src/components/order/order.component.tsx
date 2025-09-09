"use client";
import { useState } from "react";
import styles from "./order.module.css";
import { CreateNewOrder } from "@/utils/Admin";
import { CreateOrder } from "@/utils/Types";
type Props = {
	price: number;
};
function OrderComponent({ price }: Props) {
	const [order, setOrder] = useState({
		name: "",
		phone: "",
		address: "",
	});
	const [address, setAddress] = useState("");
	const [wilaya, SetWilaya] = useState("");
	async function HandleSubmit() {
		const MainAddress = address.concat("-").concat(wilaya);

		const newOrder = { ...order, address: MainAddress };

		setOrder(newOrder); // updates React state
		const response = await CreateNewOrder(newOrder); // use the fresh object directly
		console.log(response);
	}

	return (
		<div className={styles.container}>
			<div className={styles.orderForm}>
				<h2 className={styles.title}>Place Your Order</h2>

				<div className={styles.inputFields}>
					<div className={styles.field}>
						<label htmlFor="fullName">Full Name</label>
						<input
							type="text"
							id="fullName"
							required
							placeholder="Enter your full name"
							onChange={(e) => setOrder({ ...order, name: e.target.value })}
						/>
					</div>

					<div className={styles.field}>
						<label htmlFor="email"> wilaya : </label>
						<input
							type="email"
							id="email"
							placeholder="Enter your wilaya"
							onChange={(e) => SetWilaya(e.target.value)}
						/>
					</div>
					<div className={styles.field}>
						<label htmlFor="address"> Address : </label>
						<input
							type="email"
							id="email"
							placeholder="Enter your address"
							onChange={(e) => setAddress(e.target.value)}
						/>
					</div>

					<div className={styles.field}>
						<label htmlFor="phone">Phone Number</label>
						<input
							type="tel"
							id="phone"
							required
							placeholder="Enter your phone number"
							onChange={(e) => setOrder({ ...order, phone: e.target.value })}
						/>
					</div>

					<div className={styles.totalField}>
						<span className={styles.totalLabel}>Total Amount:</span>
						<span className={styles.totalAmount}>{price} DZD</span>
					</div>
				</div>

				<button
					className={styles.submitButton}
					onClick={() => {
						HandleSubmit();
					}}
				>
					Place Order
				</button>
			</div>
		</div>
	);
}

export default OrderComponent;
