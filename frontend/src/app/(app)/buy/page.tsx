import CarBrowserComp from "@/components/browser-page/car-browser.component";
import styles from "@/styles/car-browser.module.css";
import { FetchAllBrands, GetAllVisibleCars } from "@/utils/Admin";

export const dynamic = "force-dynamic";

async function CarBrowser() {
	const allCars = await GetAllVisibleCars();
	const brands = await FetchAllBrands();
	return (
		<div className={styles.container}>
			<CarBrowserComp SVbrands={brands} AllCars={allCars} />
		</div>
	);
}

export default CarBrowser;
