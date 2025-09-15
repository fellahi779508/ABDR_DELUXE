import CarBrowserComp from "@/components/browser-page/car-browser.component";
import styles from "@/styles/car-browser.module.css";
import { FetchAllBrands, GetAllVisibleCars } from "@/utils/Admin";
import { AxiosResponse } from "axios";
async function FetchAllCars() {
	try {
		const response = await GetAllVisibleCars();
		if (response[0].id) {
			return response;
		}
	} catch (error) {
		return [];
	}
	return {} as AxiosResponse;
}
async function fetchAllBrands() {
	try {
		const response = await FetchAllBrands();
		if (response.length > 0) {
			return response;
		} else {
			return [];
		}
	} catch (error) {
		return error;
	}
}
async function CarBrowser() {
	const cars = await FetchAllCars();
	const brands = await fetchAllBrands();
	return (
		<div className={styles.container}>
			<CarBrowserComp car={cars} brands={brands} />
		</div>
	);
}

export default CarBrowser;
