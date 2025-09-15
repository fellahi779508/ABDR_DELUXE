"use client";
import { useState } from "react";
import styles from "./order.module.css";
import { CreateNewOrder } from "@/utils/Admin";
import { toast, ToastContainer } from "react-toastify";
import { redirect } from "next/navigation";

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
		if (!order.name || !order.phone || !address || !wilaya) {
			toast.error("Veuillez remplir tous les champs");
			return;
		}
		const MainAddress = address.concat("-").concat(wilaya);

		const newOrder = { ...order, address: MainAddress };

		setOrder(newOrder);
		const result = await CreateNewOrder(newOrder);
		if (result) {
			redirect("/order/completed");
		}
		redirect("/order/error");
	}

	return (
		<div className={styles.container}>
			<div className={styles.orderForm}>
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
						<label htmlFor="wilaya">Wilaya :</label>
						<input
							type="text"
							id="wilaya"
							placeholder="Entrez votre wilaya"
							onChange={(e) => SetWilaya(e.target.value)}
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

					<div className={styles.totalField}>
						<span className={styles.totalLabel}>Montant total :</span>
						<span className={styles.totalAmount}>{price} DZD</span>
					</div>
				</div>

				<button
					className={styles.submitButton}
					onClick={() => {
						HandleSubmit();
					}}
				>
					Commander
				</button>
			</div>
			<ToastContainer />
		</div>
	);
}

export default OrderComponent;
