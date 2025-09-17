/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Minus, Plus, X } from "lucide-react";
import styles from "./addNewCar.module.css";
import { Brand, Car, CreateCar, Serie } from "@/utils/Types";
import { use, useEffect, useState } from "react";
import {
	CreateBrand,
	CreateCarDB,
	Createserie,
	DeleteBrandById,
	DeleteSerieById,
	FetchAllBrands,
	FetchSeriesByBrand,
	UploadImages,
	UploadPrimaryImage,
} from "@/utils/Admin";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import { redirect } from "next/navigation";

function AddNewCar() {
	const [availableBrands, setAvailableBrands] = useState<Brand[]>([]);
	const [availableSeries, setAvailableSeries] = useState<Serie[]>([]);
	const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
	const [selectedSerie, setSelectedSerie] = useState<Serie | null>(null);
	const [isCreatingBrand, setIsCreatingBrand] = useState(false);
	const [isCreatingSerie, setIsCreatingSerie] = useState(false);
	const [newBrandName, setNewBrandName] = useState("");
	const [newSerieName, setNewSerieName] = useState("");
	const [loading, setLoading] = useState({
		brands: false,
		series: false,
		createBrand: false,
		createSerie: false,
		createCar: false,
		uploadImages: false,
		deleteBrand: false,
		deleteSerie: false,
	});

	const [car, setCar] = useState<CreateCar>({
		finition: "",
		Année: "",
		Boite: "",
		Energie: "",
		Kilométrage: "",
		Moteur: "",
		color: "",
		description: "",
		isVisible: false,
		price: 0,
		serieId: 0,
	});
	type Option = {
		value: string | null;
		label: string | null;
	};
	const [createdCarId, setCreatedCarId] = useState("");
	const [brandOptions, setBrandOptions] = useState<Option>();
	const [serieOptions, setSerieOptions] = useState<Option>();
	const [primaryImage, setPrimaryImage] = useState<File>(new File([], ""));
	const [images, setImages] = useState<File[]>([]);

	async function addNewCar() {
		if (
			!car.finition ||
			!car.Année ||
			!car.Boite ||
			!car.Energie ||
			!car.Kilométrage ||
			!car.Moteur ||
			!car.color ||
			!car.description ||
			!car.price ||
			!car.serieId
		) {
			toast.error("Please fill in all fields");
			return;
		}

		setLoading((prev) => ({ ...prev, createCar: true }));

		try {
			const response = await CreateCarDB(car);
			if (response.id) {
				setCar({
					finition: "",
					Année: "",
					Boite: "",
					Energie: "",
					Kilométrage: "",
					Moteur: "",
					color: "",
					description: "",
					isVisible: false,
					price: 0,
					serieId: 0,
				});
				toast.success("Car created successfully");
				setCreatedCarId(response.id);
				if (primaryImage || images) await CreateImages(response.id);
			}
		} catch (error) {
			toast.error("Error creating car");
		} finally {
			setTimeout(() => redirect("/admin/dashboard/cars"), 2000);
			setLoading((prev) => ({ ...prev, createCar: false }));
		}
	}

	async function CreateImages(id: string) {
		setLoading((prev) => ({ ...prev, uploadImages: true }));

		try {
			// Upload primary image first
			const primaryResponse = await UploadPrimaryImage(id, primaryImage);

			if (primaryResponse && primaryResponse.length > 0) {
				toast.success("Primary Image uploaded successfully");
			}
			await CreateResImages(id);
		} catch (error) {
			toast.error("Error uploading images");
		} finally {
			setLoading((prev) => ({ ...prev, uploadImages: false }));
		}
	}
	async function CreateResImages(id: string) {
		try {
			const secondaryResponse = await UploadImages(id, images);

			if (secondaryResponse && secondaryResponse.length > 0) {
				toast.success("Secondary Images uploaded successfully");
			}
		} catch (error) {
			toast.error("Error uploading images");
		}
	}
	async function createNewBrand(name: string) {
		if (!name) {
			toast.error("Please fill in all fields");
			return;
		}
		setLoading((prev) => ({ ...prev, createBrand: true }));

		try {
			const response = await CreateBrand(name);
			if (response) {
				toast.success("Brand created successfully");
				FetchBrands();
				setIsCreatingBrand(false);
				setNewBrandName("");
			} else {
				toast.error("Error creating brand");
			}
		} catch (error) {
			toast.error("Error creating brand");
		} finally {
			setLoading((prev) => ({ ...prev, createBrand: false }));
		}
	}

	async function createNewSerie() {
		if (!newSerieName || !selectedBrand) {
			toast.error("Please fill in all fields");
			return;
		}
		setLoading((prev) => ({ ...prev, createSerie: true }));

		try {
			const response = await Createserie(newSerieName, selectedBrand?.id || 0);
			if (response) {
				toast.success("Serie created successfully");
				FetchSeries(selectedBrand?.id || 0);
				setIsCreatingSerie(false);
				setNewSerieName("");
			} else {
				toast.error("Error creating serie");
			}
		} catch (error) {
			toast.error("Error creating serie");
		} finally {
			setLoading((prev) => ({ ...prev, createSerie: false }));
		}
	}

	async function FetchBrands() {
		setLoading((prev) => ({ ...prev, brands: true }));

		try {
			const response = await FetchAllBrands();
			if (response) {
				setAvailableBrands(response);
				setBrandOptions(
					response.map((brand: Brand) => ({
						value: brand.id,
						label: brand.name,
					}))
				);
			}
		} catch (error) {
			console.error("Error fetching brands:", error);
			toast.error("Error fetching brands");
		} finally {
			setLoading((prev) => ({ ...prev, brands: false }));
		}
	}

	async function FetchSeries(brandId: number) {
		setLoading((prev) => ({ ...prev, series: true }));

		try {
			const response = await FetchSeriesByBrand(brandId);
			if (response) {
				setAvailableSeries(response);
				setSerieOptions(
					response.map((serie: { id: any; name: any }) => ({
						value: serie.id,
						label: serie.name,
					}))
				);
			}
		} catch (error) {
			console.error("Error fetching series:", error);
			toast.error("Error fetching series");
		} finally {
			setLoading((prev) => ({ ...prev, series: false }));
		}
	}

	async function handlePrimaryImageUpload(
		e: React.ChangeEvent<HTMLInputElement>
	) {
		if (e.target.files && e.target.files.length > 0) {
			setPrimaryImage(e.target.files[0]);
		}
	}
	async function handleDeleteBrand(id: number) {
		const response = await DeleteBrandById(id);
		if (response === "deleted") {
			toast.success("Brand deleted successfully");
			setBrandOptions({
				value: null,
				label: null,
			});
			setSelectedBrand(null);
			FetchBrands();
		} else {
			toast.error("Error deleting brand");
		}
	}
	async function handleDeleteSerie(id: number) {
		const response = await DeleteSerieById(id);
		if (response === "deleted") {
			toast.success("Brand deleted successfully");

			setSerieOptions({
				value: null,
				label: null,
			});
			setSelectedSerie(null);
		} else {
			toast.error("Error deleting brand");
		}
	}
	useEffect(() => {
		FetchBrands();
	}, []);

	useEffect(() => {
		if (selectedBrand) {
			setSerieOptions({
				value: null,
				label: null,
			});
			setSelectedSerie(null);
			FetchSeries(selectedBrand.id);
		}
	}, [selectedBrand]);

	return (
		<div className={styles.overlay}>
			<div className={styles.container}>
				<div className={styles.header}>
					<Plus size={24} />
					<h2>Add New Car</h2>
				</div>

				<div className={styles.formSection}>
					{/* Brand Selection */}
					<div className={styles.section}>
						<div className={styles.sectionHeader}>
							<h3>Brand</h3>
							<div>
								<button
									className={styles.addButton}
									onClick={() => setIsCreatingBrand(true)}
									disabled={loading.createBrand}
								>
									{loading.createBrand ? (
										"Creating..."
									) : (
										<>
											<Plus size={16} />
											Create New Brand
										</>
									)}
								</button>
								{selectedBrand && (
									<button
										className={styles.addButton}
										style={{
											marginTop: "10px",
											backgroundColor: "rgba(255, 0, 10, 0.8)",
										}}
										onClick={() => handleDeleteBrand(selectedBrand.id)}
										disabled={loading.createBrand}
									>
										{loading.deleteBrand ? (
											"Deleteing..."
										) : (
											<>
												<Minus size={16} />
												Delete Brand
											</>
										)}
									</button>
								)}
							</div>
						</div>

						{isCreatingBrand ? (
							<div className={styles.createNew}>
								<input
									type="text"
									placeholder="Enter brand name"
									value={newBrandName}
									onChange={(e) => setNewBrandName(e.target.value)}
									className={styles.textInput}
									disabled={loading.createBrand}
								/>
								<div className={styles.createActions}>
									<button
										className={styles.confirmButton}
										onClick={() => createNewBrand(newBrandName)}
										disabled={loading.createBrand}
									>
										{loading.createBrand ? "Creating..." : "Create"}
									</button>
									<button
										className={styles.cancelButton}
										onClick={() => setIsCreatingBrand(false)}
										disabled={loading.createBrand}
									>
										Cancel
									</button>
								</div>
							</div>
						) : (
							<Select
								className={styles.select}
								options={brandOptions}
								isLoading={loading.brands}
								onChange={(selected) => {
									const brand = availableBrands.find(
										(b) => b.id === selected?.value
									);
									setSelectedBrand(brand || null);
								}}
								placeholder="Select a brand"
							/>
						)}
					</div>

					{/* Serie Selection */}
					<div className={styles.section}>
						<div className={styles.sectionHeader}>
							<h3>Serie</h3>
							<div>
								<button
									className={styles.addButton}
									onClick={() => setIsCreatingSerie(true)}
									disabled={!selectedBrand || loading.createSerie}
								>
									{loading.createSerie ? (
										"Creating..."
									) : (
										<>
											<Plus size={16} />
											Create New Serie
										</>
									)}
								</button>
								{selectedSerie && (
									<button
										className={styles.addButton}
										style={{
											marginTop: "10px",
											backgroundColor: "rgba(255, 0, 10, 0.8)",
										}}
										onClick={() => handleDeleteSerie(selectedSerie.id)}
										disabled={!selectedBrand || loading.createSerie}
									>
										{loading.deleteSerie ? (
											"Deleting..."
										) : (
											<>
												<Minus size={16} />
												Delete Serie
											</>
										)}
									</button>
								)}
							</div>
						</div>

						{isCreatingSerie ? (
							<div className={styles.createNew}>
								<input
									type="text"
									placeholder="Enter serie name"
									value={newSerieName}
									onChange={(e) => setNewSerieName(e.target.value)}
									className={styles.textInput}
									required
									disabled={loading.createSerie}
								/>
								<div className={styles.createActions}>
									<button
										className={styles.confirmButton}
										onClick={createNewSerie}
										disabled={loading.createSerie}
									>
										{loading.createSerie ? "Creating..." : "Create"}
									</button>
									<button
										className={styles.cancelButton}
										onClick={() => setIsCreatingSerie(false)}
										disabled={loading.createSerie}
									>
										Cancel
									</button>
								</div>
							</div>
						) : (
							<Select
								className={styles.select}
								options={serieOptions}
								isLoading={loading.series}
								onChange={(selected) => {
									const serie = availableSeries.find(
										(s) => s.id === selected?.value
									);
									setSelectedSerie(serie || null);
									setCar({ ...car, serieId: selected?.value || 0 });
								}}
								placeholder={
									selectedBrand ? "Select a serie" : "First select a brand"
								}
								isDisabled={!selectedBrand}
							/>
						)}
					</div>

					{/* Car Details */}
					<div className={styles.section}>
						<h3>Car Details</h3>
						<div className={styles.inputGrid}>
							{Object.entries(car).map(([key, value]) => {
								if (key === "serieId" || key === "Images") return null;
								if (key === "isVisible")
									return (
										<div className={styles.inputGroup} key={key}>
											<label>Show in Store ?</label>
											<div className={styles.toggleGroup}>
												<button
													type="button"
													className={`${styles.toggleButton} ${
														value ? styles.active : ""
													}`}
													onClick={() => setCar({ ...car, isVisible: true })}
												>
													Yes
												</button>
												<button
													type="button"
													className={`${styles.toggleButton} ${
														!value ? styles.active : ""
													}`}
													onClick={() => setCar({ ...car, isVisible: false })}
												>
													No
												</button>
											</div>
										</div>
									);
								return (
									<div className={styles.inputGroup} key={key}>
										<label>{key}</label>
										<input
											type={key === "price" ? "number" : "text"}
											value={value}
											onChange={(e) =>
												key === "price"
													? setCar({ ...car, [key]: Number(e.target.value) })
													: setCar({ ...car, [key]: e.target.value })
											}
											className={styles.textInput}
											required
										/>
									</div>
								);
							})}
						</div>
					</div>

					<div className={styles.section}>
						<div className={styles.sectionHeader}>
							<h3>Car Images</h3>
						</div>
						<div className={styles.inputGroup} style={{ marginBottom: "20px" }}>
							<label>Primary Image :</label>
							<input
								type="file"
								accept="image/*"
								onChange={handlePrimaryImageUpload}
								className={styles.textInput}
								required
							/>
						</div>
						<div className={styles.inputGroup}>
							<label>Secondary Images :</label>
							<input
								type="file"
								accept="image/*"
								multiple
								onChange={(e) => {
									if (e.target.files) {
										const files = Array.from(e.target.files);
										setImages(files);
									}
								}}
								required
								className={styles.textInput}
							/>
						</div>
					</div>
				</div>

				<div className={styles.footer}>
					<button
						className={styles.submitButton}
						onClick={addNewCar}
						disabled={loading.createCar || loading.uploadImages}
					>
						{loading.createCar || loading.uploadImages
							? loading.uploadImages
								? "Uploading Images..."
								: "Creating Car..."
							: "Add Car"}
					</button>
				</div>
			</div>
			<ToastContainer />
		</div>
	);
}

export default AddNewCar;
