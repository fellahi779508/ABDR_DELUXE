/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import styles from "./selectedCar_details.module.css";
import { DeleteCarById, UpdateCarById } from "@/utils/Admin";
import { Car, UpdateCar } from "@/utils/Types";
import SelectedCarImages from "./selectedCar_images.component";
import { Divide } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { redirect } from "next/navigation";

type CarProps = {
	car: Car;
};
async function updateCar(id: string, data: any) {
	try {
		const response = await UpdateCarById(id, data);
		if (response === "updated") {
			toast.success("Car updated successfully");
			redirect("/admin/dashboard/cars");
		}
	} catch (error) {
		console.error(error);
	}
}

function SelectedCarDetails({ car }: CarProps) {
	const [selectedCar, setSelectedCar] = useState<Car>(car);
	const [updatedCar, setUpdatedCar] = useState<UpdateCar>({
		Année: car.Année,
		Boite: car.Boite,
		Energie: car.Energie,
		Kilométrage: car.Kilométrage,
		Moteur: car.Moteur,
		color: car.color,
		description: car.description,
		finition: car.finition,
		price: car.price,
	});
	const [openImages, setOpenImages] = useState(false);
	return openImages ? (
		<>
			<button className={styles.close_btn} onClick={() => setOpenImages(false)}>
				Close Images
			</button>
			<SelectedCarImages id={selectedCar.id} />
		</>
	) : (
		<div className={styles.overlay}>
			<div className={styles.container}>
				<div className={styles.details}>
					{Object.entries(selectedCar).map(([key, value]) => {
						if (
							key === "images" ||
							key === "serie" ||
							key === "id" ||
							key === "slug"
						)
							return null;

						if (key === "isVisible") {
							return null;
						}
						return (
							<div key={key} className={styles.detail_item}>
								<span className={styles.detail_label}>
									{key.charAt(0).toUpperCase() + key.slice(1)}:
								</span>
								<input
									type={key === "price" ? "number" : "text"}
									className={styles.detail_value}
									defaultValue={String(value)}
									onChange={(e) =>
										key === "price"
											? setUpdatedCar({
													...updatedCar,
													[key]: Number(e.target.value),
											  })
											: setUpdatedCar({
													...updatedCar,
													[key]: e.target.value,
											  })
									}
								/>
							</div>
						);
					})}

					<div className={styles.detail_item}>
						<span className={styles.detail_label}> Images :</span>
						<button
							className={styles.savebtn}
							onClick={() => setOpenImages(true)}
						>
							View All
						</button>
					</div>
				</div>

				<button
					className={styles.savebtn}
					onClick={() => {
						updateCar(car.id, updatedCar);
					}}
				>
					Save
				</button>
			</div>
			<ToastContainer />s
		</div>
	);
}

export default SelectedCarDetails;
