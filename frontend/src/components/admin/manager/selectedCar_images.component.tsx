"use client";
import styles from "./selectedCar_images.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Trash2, Loader, Plus, Star, Check } from "lucide-react";
import {
	DeleteAllCarImages,
	DeleteImageById,
	FetchCarImages,
	UpdateImageToPrimary,
	UploadImages,
} from "@/utils/Admin";

type ImageProps = {
	id: string;
};

type ImageType = {
	id: string;
	url: string;
	isPrimary: boolean;
};

function SelectedCarImages({ id }: ImageProps) {
	const [images, setImages] = useState<ImageType[]>([]);
	const [loading, setLoading] = useState(true);
	const [deleting, setDeleting] = useState<string | null>(null);
	const [deletingAll, setDeletingAll] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [settingPrimary, setSettingPrimary] = useState<string | null>(null);

	async function fetchImages(id: string) {
		try {
			setLoading(true);
			const response = await FetchCarImages(id);
			setImages(response);
		} catch (error) {
			console.error("Error fetching images:", error);
		} finally {
			setLoading(false);
		}
	}

	async function handleDeleteImage(imageId: string) {
		try {
			setDeleting(imageId);
			await DeleteImageById(imageId);
			// Remove the image from state after successful deletion
			setImages((prev) => prev.filter((img) => img.id !== imageId));
		} catch (error) {
			console.error("Error deleting image:", error);
		} finally {
			setDeleting(null);
		}
	}

	async function handleDeleteAllImages() {
		try {
			setDeletingAll(true);
			await DeleteAllCarImages(id);
			// Clear all images from state after successful deletion
			setImages([]);
		} catch (error) {
			console.error("Error deleting all images:", error);
		} finally {
			setDeletingAll(false);
		}
	}

	// Function to handle image upload
	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) return;

		setUploading(true);
		try {
			const files = Array.from(e.target.files);
			const response = await UploadImages(id, files);

			if (response) {
				// Refresh the images after successful upload
				fetchImages(id);
			}
		} catch (error) {
			console.error("Error uploading images:", error);
		} finally {
			setUploading(false);
			// Reset the file input
			e.target.value = "";
		}
	};

	// Function to set an image as primary
	const handleSetPrimary = async (imageId: string) => {
		setSettingPrimary(imageId);
		try {
			const response = await UpdateImageToPrimary(imageId);
			if (response) {
				// Refresh the images after successful update
				fetchImages(id);
			}
			setImages((prev) =>
				prev.map((img) => ({
					...img,
					isPrimary: img.id === imageId,
				}))
			);
		} catch (error) {
			console.error("Error setting primary image:", error);
		} finally {
			setSettingPrimary(null);
		}
	};

	useEffect(() => {
		if (id) {
			fetchImages(id);
		}
	}, [id]);

	return (
		<div className={styles.overlay}>
			<div className={styles.container}>
				<div className={styles.header}>
					<h2>Car Images</h2>
				</div>

				{loading ? (
					<div className={styles.loading}>
						<Loader size={32} className={styles.spinner} />
						<p>Loading images...</p>
					</div>
				) : (
					<>
						<div className={styles.actions}>
							<label className={styles.uploadButton}>
								{uploading ? (
									<>
										<Loader size={16} className={styles.spinner} />
										Uploading...
									</>
								) : (
									<>
										<Plus size={16} />
										Add Images
									</>
								)}
								<input
									type="file"
									accept="image/*"
									multiple
									onChange={handleImageUpload}
									style={{ display: "none" }}
									disabled={uploading}
								/>
							</label>

							{images.length > 0 && (
								<button
									className={styles.deleteAllButton}
									onClick={handleDeleteAllImages}
									disabled={deletingAll}
								>
									{deletingAll ? (
										<>
											<Loader size={16} className={styles.spinner} />
											Deleting All...
										</>
									) : (
										<>
											<Trash2 size={16} />
											Delete All Images
										</>
									)}
								</button>
							)}
						</div>

						{images.length === 0 ? (
							<div className={styles.empty}>
								<p>No images found for this car</p>
								<p>Click "Add Images" to upload some</p>
							</div>
						) : (
							<div className={styles.gallery}>
								{images.map((image) => (
									<div key={image.id} className={styles.imageContainer}>
										{image.isPrimary && (
											<div className={styles.primaryBadge}>
												<Check size={12} />
												Primary
											</div>
										)}
										<div className={styles.imageWrapper}>
											<Image
												src={image.url}
												alt="Car image"
												fill
												className={styles.image}
												sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
											/>
										</div>
										<div className={styles.imageActions}>
											<button
												className={`${styles.primaryButton} ${
													image.isPrimary ? styles.primaryActive : ""
												}`}
												onClick={() => handleSetPrimary(image.id)}
												disabled={
													image.isPrimary || settingPrimary === image.id
												}
												title={
													image.isPrimary
														? "This is the primary image"
														: "Set as primary image"
												}
											>
												{settingPrimary === image.id ? (
													<Loader size={14} className={styles.spinner} />
												) : (
													<Star
														size={14}
														fill={image.isPrimary ? "currentColor" : "none"}
													/>
												)}
											</button>
											<button
												className={styles.deleteButton}
												onClick={() => handleDeleteImage(image.id)}
												disabled={deleting === image.id}
												title="Delete image"
											>
												{deleting === image.id ? (
													<Loader size={14} className={styles.spinner} />
												) : (
													<Trash2 size={14} />
												)}
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}

export default SelectedCarImages;
