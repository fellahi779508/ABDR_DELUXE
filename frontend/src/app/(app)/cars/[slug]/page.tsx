/* eslint-disable @typescript-eslint/no-unused-vars */

import CarDetailsComponent from "@/components/car-details/car-details.component";
import styles from "@/styles/car-details.module.css";
import { api } from "@/utils/api";
import { AxiosResponse } from "axios";
import { notFound } from "next/navigation";

type CarDetailsProps = {
	params: { slug: string };
};
async function getCarData(slug: string) {
	try {
		const response = await api.get(`/car/slug/${slug}`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		return notFound();
	}
	return {} as AxiosResponse;
}

async function CarDetails({ params }: CarDetailsProps) {
	const { slug } = await params;
	const car = await getCarData(slug);
	return (
		<div className={styles.container}>
			<CarDetailsComponent slug={slug} data={car} />
		</div>
	);
}

export default CarDetails;
