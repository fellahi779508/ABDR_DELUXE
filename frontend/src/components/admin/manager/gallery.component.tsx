"use client";
import { useEffect, useState } from "react";
import styles from "./gallery.comp.module.css";
import {
	DeleteAllGallery,
	DeleteGalleryPic,
	GetAllGallery,
	UploadGalleryPic,
} from "@/utils/Admin";
import Image from "next/image";

type GalleryImg = {
	id: number;
	url: string;
	publicId: string;
};

function GalleryComp() {
	const [images, setImages] = useState<GalleryImg[]>([]);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [isDeleting, setIsDeleting] = useState<number | null>(null);

	useEffect(() => {
		const fetchImages = async () => {
			try {
				const response = await GetAllGallery();
				setImages(response);
			} catch (error) {
				console.error("Error fetching images:", error);
			}
		};
		fetchImages();
	}, []);

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			setSelectedFiles(Array.from(files));
		}
	};

	const handleUpload = async () => {
		if (selectedFiles.length === 0) return;

		setIsUploading(true);
		try {
			const response = await UploadGalleryPic(selectedFiles);
			if (!response) return alert("Failed to upload images");
			alert("Images uploaded successfully");
			const updatedImages = await GetAllGallery();
			setImages(updatedImages);
			setSelectedFiles([]);
			// Clear file input
			const fileInput = document.getElementById(
				"file-input"
			) as HTMLInputElement;
			if (fileInput) fileInput.value = "";
		} catch (error) {
			console.error("Error uploading images:", error);
		} finally {
			setIsUploading(false);
		}
	};

	const handleDeleteOne = async (image: GalleryImg) => {
		if (!confirm("Are you sure you want to delete this image?")) return;
		setIsDeleting(image.id);
		try {
			await DeleteGalleryPic(image.id);
			setImages(images.filter((img) => img.id !== image.id));
		} catch (error) {
			console.error("Error deleting image:", error);
		} finally {
			setIsDeleting(null);
		}
	};

	const handleDeleteAll = async () => {
		if (
			!confirm(
				"Are you sure you want to delete ALL images? This action cannot be undone."
			)
		)
			return;

		try {
			await DeleteAllGallery();
			setImages([]);
		} catch (error) {
			console.error("Error deleting all images:", error);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1 className={styles.title}>Gallery Management</h1>
				<p className={styles.subtitle}>
					{images.length} image{images.length !== 1 ? "s" : ""} in gallery
				</p>
			</div>

			{/* Upload Section */}
			<div className={styles.uploadSection}>
				<div className={styles.uploadCard}>
					<div className={styles.uploadHeader}>
						<h2>Upload Images</h2>
						<span className={styles.fileCount}>
							{selectedFiles.length} file{selectedFiles.length !== 1 ? "s" : ""}{" "}
							selected
						</span>
					</div>

					<div className={styles.uploadArea}>
						<input
							type="file"
							id="file-input"
							multiple
							accept="image/*"
							onChange={handleFileSelect}
							className={styles.fileInput}
						/>
						<label htmlFor="file-input" className={styles.fileLabel}>
							<div className={styles.uploadIcon}>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
									<path
										d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
										stroke="currentColor"
										strokeWidth="2"
									/>
									<polyline
										points="14,2 14,8 20,8"
										stroke="currentColor"
										strokeWidth="2"
									/>
									<line
										x1="16"
										y1="13"
										x2="8"
										y2="13"
										stroke="currentColor"
										strokeWidth="2"
									/>
									<line
										x1="12"
										y1="17"
										x2="12"
										y2="9"
										stroke="currentColor"
										strokeWidth="2"
									/>
								</svg>
							</div>
							<p>Click to select images or drag and drop</p>
							<span>Supports JPG, PNG, WEBP (Max 10MB each)</span>
						</label>
					</div>

					{selectedFiles.length > 0 && (
						<div className={styles.selectedFiles}>
							<h4>Selected Files:</h4>
							<div className={styles.fileList}>
								{selectedFiles.map((file, index) => (
									<div key={index} className={styles.fileItem}>
										<span className={styles.fileName}>{file.name}</span>
										<span className={styles.fileSize}>
											({(file.size / 1024 / 1024).toFixed(2)} MB)
										</span>
									</div>
								))}
							</div>
						</div>
					)}

					<button
						onClick={handleUpload}
						disabled={selectedFiles.length === 0 || isUploading}
						className={`${styles.uploadButton} ${
							isUploading ? styles.loading : ""
						}`}
					>
						{isUploading ? (
							<>
								<div className={styles.spinner}></div>
								Uploading...
							</>
						) : (
							`Upload ${selectedFiles.length} Image${
								selectedFiles.length !== 1 ? "s" : ""
							}`
						)}
					</button>
				</div>
			</div>

			{/* Gallery Section */}
			<div className={styles.gallerySection}>
				<div className={styles.galleryHeader}>
					<h2>Gallery Images</h2>
					{images.length > 0 && (
						<button
							onClick={handleDeleteAll}
							className={styles.deleteAllButton}
						>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
								<path
									d="M3 6h18l-2 14H5L3 6z"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<path
									d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="10"
									y1="11"
									x2="10"
									y2="17"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<line
									x1="14"
									y1="11"
									x2="14"
									y2="17"
									stroke="currentColor"
									strokeWidth="2"
								/>
							</svg>
							Delete All
						</button>
					)}
				</div>

				{images.length === 0 ? (
					<div className={styles.emptyState}>
						<div className={styles.emptyIcon}>
							<svg width="48" height="48" viewBox="0 0 24 24" fill="none">
								<rect
									x="3"
									y="3"
									width="18"
									height="18"
									rx="2"
									stroke="currentColor"
									strokeWidth="2"
								/>
								<circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
								<path
									d="m21 15-5-5L5 21"
									stroke="currentColor"
									strokeWidth="2"
								/>
							</svg>
						</div>
						<h3>No images in gallery</h3>
						<p>Upload some images to get started</p>
					</div>
				) : (
					<div className={styles.galleryGrid}>
						{images.map((image) => (
							<div key={image.id} className={styles.galleryItem}>
								<div className={styles.imageContainer}>
									<Image
										src={image.url}
										alt={`Gallery image ${image.id}`}
										className={styles.image}
										width={200}
										height={200}
										priority
									/>
									<div className={styles.imageOverlay}>
										<button
											onClick={() => handleDeleteOne(image)}
											disabled={isDeleting === image.id}
											className={`${styles.deleteButton} ${
												isDeleting === image.id ? styles.deleting : ""
											}`}
										>
											{isDeleting === image.id ? (
												<div className={styles.spinner}></div>
											) : (
												<svg
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
												>
													<path
														d="M18 6L6 18M6 6l12 12"
														stroke="currentColor"
														strokeWidth="2"
													/>
												</svg>
											)}
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default GalleryComp;
