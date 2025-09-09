import CarBrowserComp from "@/components/browser-page/car-browser.component";
import styles from "@/styles/car-browser.module.css";
import { GetAllVisibleCars } from "@/utils/Admin";
import { AxiosResponse } from "axios";
import { notFound } from "next/navigation";
async function FetchAllCars() {
	try {
		const response = await GetAllVisibleCars();
		console.log(response);
		if (response[0].id) {
			return response;
		}
	} catch (error) {
		return notFound();
	}
	return {} as AxiosResponse;
}
async function CarBrowser() {
	const cars = await FetchAllCars();
	return (
		<div className={styles.container}>
			<CarBrowserComp car={cars} />
		</div>
	);
}

export default CarBrowser;
