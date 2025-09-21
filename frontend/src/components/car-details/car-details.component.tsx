/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import styles from "./car-details.component.module.css";
import { useState } from "react";
import {
	MoveLeft,
	MoveRight,
	Clock,
	Shield,
	Zap,
	Milestone,
	ParkingMeter,
} from "lucide-react";
import Link from "next/link";
import { SetCarIdCookie } from "@/utils/Admin";
import { useRouter } from "next/navigation";

type CarDetailsProps = {
	slug: string;
	data: Car;
};
type Car = {
	finition: string;
	id: string;
	price: number;
	Moteur: string;
	Energie: string;
	Boite: string;
	Kilométrage: string;
	Année: string;
	description?: string;
	colors: {
		id: number;
		name: string;
		images: { isPrimary?: boolean; url: string; sortOrder: number }[];
	}[];
	slug: string;
	status: string;
	serie: { id: number; name: string; brand: { id: number; name: string } };
};
function CarDetailsComponent(param: CarDetailsProps) {
	const { data } = param;
	const [images, setImages] = useState<any>(data.colors[0].images);
	const [mainImage, setMainImage] = useState<any>({
		url: data.colors[0].images[0].url,
		sortOrder: 0,
	});
	const [startIndex, setStartIndex] = useState(0);
	const [selectedImageIndex, setSelectedImageIndex] = useState(
		images[0]?.sortOrder + 1 || 0
	);

	function rightArrowClick() {
		if (images.length < startIndex + 5) return;
		setStartIndex(startIndex + 5);
	}

	function leftArrowClick() {
		if (startIndex === 0) return;
		setStartIndex(startIndex - 5);
	}

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("fr-DZ", {
			style: "decimal",
			minimumFractionDigits: 0,
		}).format(price);
	};
	const router = useRouter();
	async function handleBuy() {
		await SetCarIdCookie(data.id, data.price);
		router.push("/order");
	}

	return (
		<div className={styles.main}>
			<div className={styles.header}>
				<div className={styles.breadcrumb}>
					<Link href="/" className={styles.link}>
						Accueil
					</Link>{" "}
					/
					<Link href="/cars" className={styles.link}>
						{" "}
						Voitures
					</Link>{" "}
					/ <span> {data.serie.brand.name}</span> <span>{data.serie.name}</span>
				</div>
			</div>

			<div className={styles.title_container}>
				<h1 className={styles.title}>
					{data.serie.brand.name} {data.serie.name} {data.finition}
				</h1>
				<div className={styles.car_meta}>
					<span className={styles.meta_item}>
						<Clock size={16} /> {data.Année}
					</span>
					<span className={styles.meta_item}>
						<Shield size={16} /> Vérifié
					</span>
				</div>
			</div>

			<div className={styles.details_container}>
				<div className={styles.section}>
					<div className={styles.main_image_container}>
						<div className={styles.main_image}>
							<span className={styles.image_index}>
								{selectedImageIndex} / {images.length}
							</span>
							<Image
								src={mainImage?.url ?? "/images/placeholder.png"}
								width={2000}
								height={2000}
								alt={`${data.serie.brand.name} ${data.serie.name}`}
								priority
							/>
						</div>
					</div>
					<div className={styles.mini_images_container}>
						{startIndex === 0 ? null : (
							<MoveLeft
								onClick={() => leftArrowClick()}
								className={styles.left_arrow}
							/>
						)}

						{images
							.slice(startIndex, startIndex + 5)
							.map((image: any, index: number) => {
								return (
									<div
										className={`${styles.mini_image} ${
											mainImage.url === image.url ? styles.active : ""
										}`}
										key={index}
										onClick={() => (
											setMainImage(image),
											setSelectedImageIndex(image.sortOrder + 1)
										)}
									>
										<Image
											src={image.url ?? "/images/placeholder.png"}
											width={2000}
											height={2000}
											alt=""
											priority
										/>
									</div>
								);
							})}

						{startIndex + 5 < images.length ? (
							<MoveRight
								onClick={() => rightArrowClick()}
								className={styles.right_arrow}
							/>
						) : null}
					</div>
				</div>

				<div className={styles.section}>
					<div className={styles.price_section}>
						<div className={styles.price}>
							<span>Promo : </span>
							{formatPrice(data.price)} DZD
						</div>
						<div className={styles.OldPrice}>
							<span>Prix : </span> {formatPrice(data.price)} DZD
						</div>
					</div>
					<div className={styles.car_colors}>
						<div
							style={{
								fontWeight: "bold",
								fontSize: "20px",
								color: "var(--primary)",
							}}
						>
							Couleurs Disponible :
						</div>
						<div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
							{data.colors.map((color: any, index: number) => {
								return (
									<div
										className={styles.color}
										key={index}
										onClick={() => (
											setMainImage(
												color.images.find(
													(image: any) => image.isPrimary === true
												)
											),
											setImages(color.images)
										)}
									>
										{color.name}
									</div>
								);
							})}
						</div>
					</div>

					<div className={styles.feature_highlights}>
						<div className={styles.feature}>
							<Zap size={20} />
							<span>{data.Energie}</span>
						</div>
						<div className={styles.feature}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M14 7h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"></path>
								<path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
								<line x1="10" y1="7" x2="10" y2="15"></line>
								<line x1="10" y1="11" x2="10" y2="11"></line>
							</svg>
							<span>Boite </span>
							<span>{data.Boite}</span>
						</div>
						<div className={styles.feature}>
							<ParkingMeter size={20} />
							<span>{data.Kilométrage} </span>
						</div>
					</div>

					<div className={styles.details_card}>
						<h3 className={styles.details_title}>Détails du véhicule</h3>
						<div className={styles.details}>
							<div className={styles.detail_item}>
								<span className={styles.detail_label}>Marque :</span>
								<span className={styles.detail_value}>
									{data.serie.brand.name}
								</span>
							</div>
							<div className={styles.detail_item}>
								<span className={styles.detail_label}>Modèle :</span>
								<span className={styles.detail_value}>{data.serie.name}</span>
							</div>
							<div className={styles.detail_item}>
								<span className={styles.detail_label}>Finition :</span>
								<span className={styles.detail_value}>{data.finition}</span>
							</div>
							<div className={styles.detail_item}>
								<span className={styles.detail_label}>Année :</span>
								<span className={styles.detail_value}>{data.Année}</span>
							</div>
						</div>
					</div>

					<div className={styles.actions}>
						<button
							className={`${styles.btn} ${styles.primary_btn}`}
							onClick={async () => {
								handleBuy();
							}}
						>
							Contacter le vendeur
						</button>
					</div>
				</div>
			</div>

			<div className={styles.specs_section}>
				<h2 className={styles.section_title}>Caractéristiques techniques</h2>
				<div className={styles.specs_grid}>
					<div className={styles.spec_item}>
						<span className={styles.spec_label}>Moteur</span>
						<span className={styles.spec_value}>{data.Moteur}</span>
					</div>
					<div className={styles.spec_item}>
						<span className={styles.spec_label}>Transmission</span>
						<span className={styles.spec_value}>{data.Boite}</span>
					</div>
					<div className={styles.spec_item}>
						<span className={styles.spec_label}>Type de carburant</span>
						<span className={styles.spec_value}>{data.Energie}</span>
					</div>
					<div className={styles.spec_item}>
						<span className={styles.spec_label}>Kilométrage</span>
						<span className={styles.spec_value}>{data.Kilométrage} </span>
					</div>
					<div className={styles.spec_item}>
						<span className={styles.spec_label}>Année</span>
						<span className={styles.spec_value}>{data.Année}</span>
					</div>
					<div className={styles.spec_item}>
						<span className={styles.spec_label}>Couleur</span>
						<span className={styles.spec_value}>{data.colors[0].name}</span>
					</div>
				</div>
			</div>

			{data.description && (
				<div className={styles.description_section}>
					<h2 className={styles.section_title}>Description</h2>
					<p className={styles.description}>{data.description}</p>
				</div>
			)}
		</div>
	);
}

export default CarDetailsComponent;
