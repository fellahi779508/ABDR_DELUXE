/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import styles from "./car-details.component.module.css";
import { useState } from "react";
import {
	MoveLeft,
	MoveRight,
	Heart,
	Share2,
	Clock,
	MapPin,
	Shield,
	Zap,
} from "lucide-react";
import Link from "next/link";

type CarDetailsProps = {
	slug: string;
	data: any;
};

function CarDetailsComponent(param: CarDetailsProps) {
	const { data } = param;
	const images = data.images;
	const [mainImage, setMainImage] = useState<any>(
		images.find((img: any) => img.isPrimary === true) || images[0]
	);
	const [startIndex, setStartIndex] = useState(0);
	const [selectedImageIndex, setSelectedImageIndex] = useState(
		images[0].sortOrder + 1
	);
	const [isFavorite, setIsFavorite] = useState(false);

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

	return (
		<div className={styles.main}>
			<div className={styles.header}>
				<div className={styles.breadcrumb}>
					<Link href="/" className={styles.link}>
						Home
					</Link>{" "}
					/
					<Link href="/cars" className={styles.link}>
						{" "}
						Cars
					</Link>{" "}
					/ <span> {data.serie.brand.name}</span> <span>{data.serie.name}</span>
				</div>
				<div className={styles.header_actions}>
					<button
						className={`${styles.icon_btn} ${
							isFavorite ? styles.favorite : ""
						}`}
						onClick={() => setIsFavorite(!isFavorite)}
						aria-label="Favorite"
					>
						<Heart size={20} />
					</button>
					<button className={styles.icon_btn} aria-label="Share">
						<Share2 size={20} />
					</button>
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
						<MapPin size={16} /> Chlef
					</span>
					<span className={styles.meta_item}>
						<Shield size={16} /> Verified
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
						<div className={styles.price}>{formatPrice(data.price)} DZD</div>
						<div className={styles.price_note}>Price negotiable</div>
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
							<span>{data.Boite}</span>
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
								<circle cx="12" cy="12" r="10"></circle>
								<polyline points="12 6 12 12 16 14"></polyline>
							</svg>
							<span>{data.Kilométrage} </span>
						</div>
					</div>

					<div className={styles.details_card}>
						<h3 className={styles.details_title}>Vehicle Details</h3>
						<div className={styles.details}>
							<div className={styles.detail_item}>
								<span className={styles.detail_label}>Brand:</span>
								<span className={styles.detail_value}>
									{data.serie.brand.name}
								</span>
							</div>
							<div className={styles.detail_item}>
								<span className={styles.detail_label}>Model:</span>
								<span className={styles.detail_value}>{data.serie.name}</span>
							</div>
							<div className={styles.detail_item}>
								<span className={styles.detail_label}>Trim:</span>
								<span className={styles.detail_value}>{data.finition}</span>
							</div>
							<div className={styles.detail_item}>
								<span className={styles.detail_label}>Year:</span>
								<span className={styles.detail_value}>{data.Année}</span>
							</div>
							<div className={styles.detail_item}>
								<span className={styles.detail_label}>Color:</span>
								<span className={styles.detail_value}>{data.color}</span>
							</div>
						</div>
					</div>

					<div className={styles.actions}>
						<button className={`${styles.btn} ${styles.primary_btn}`}>
							Contact Seller
						</button>
						<button className={`${styles.btn} ${styles.secondary_btn}`}>
							Make an Offer
						</button>
					</div>
				</div>
			</div>

			<div className={styles.specs_section}>
				<h2 className={styles.section_title}>Technical Specifications</h2>
				<div className={styles.specs_grid}>
					<div className={styles.spec_item}>
						<span className={styles.spec_label}>Engine</span>
						<span className={styles.spec_value}>{data.Moteur}</span>
					</div>
					<div className={styles.spec_item}>
						<span className={styles.spec_label}>Transmission</span>
						<span className={styles.spec_value}>{data.Boite}</span>
					</div>
					<div className={styles.spec_item}>
						<span className={styles.spec_label}>Fuel Type</span>
						<span className={styles.spec_value}>{data.Energie}</span>
					</div>
					<div className={styles.spec_item}>
						<span className={styles.spec_label}>Mileage</span>
						<span className={styles.spec_value}>{data.Kilométrage} </span>
					</div>
					<div className={styles.spec_item}>
						<span className={styles.spec_label}>Year</span>
						<span className={styles.spec_value}>{data.Année}</span>
					</div>
					<div className={styles.spec_item}>
						<span className={styles.spec_label}>Color</span>
						<span className={styles.spec_value}>{data.color}</span>
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
