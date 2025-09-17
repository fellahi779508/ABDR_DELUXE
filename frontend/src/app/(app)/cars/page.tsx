import CarBrowserComp from "@/components/browser-page/car-browser.component";
import styles from "@/styles/car-browser.module.css";
import { FetchAllBrands, GetAllVisibleCars } from "@/utils/Admin";

async function CarBrowser() {
	const cars = await GetAllVisibleCars();
	const brands = await FetchAllBrands();
	return (
		<div className={styles.container}>
			<CarBrowserComp car={cars} brands={brands} />
		</div>
	);
}

export default CarBrowser;
