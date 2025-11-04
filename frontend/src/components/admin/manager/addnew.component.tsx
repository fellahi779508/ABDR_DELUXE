/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Minus, Plus, X, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import styles from "./addNewCar.module.css";
import { Brand, Car, CreateCar, Serie, Color, Option } from "@/utils/Types";
import { use, useEffect, useState } from "react";
import {
	CreateBrand,
	CreateCarDB,
	CreateNewColor,
	CreateNewOption,
	Createserie,
	DeleteBrandById,
	DeleteColorById,
	DeleteOptionById,
	DeleteSerieById,
	FetchAllBrands,
	FetchSeriesByBrand,
	UpdateBrandLogo,
	UpdateColorName,
	UpdateOption,
	UploadBrandIcon,
	UploadImages,
	UploadPrimaryImage,
} from "@/utils/Admin";
import Select, { StylesConfig } from "react-select";
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
		description: "",
		isVisible: false,
		price: 0,
		serieId: 0,
		status: "",
		isShiped: false,
		oldPrice: 0,
	});

	type OptionType = {
		value: string | null;
		label: string | null;
	};

	const [createdCarId, setCreatedCarId] = useState("");
	const [brandOptions, setBrandOptions] = useState<OptionType>();
	const [serieOptions, setSerieOptions] = useState<OptionType>();

	// Colors and Options state
	const [colors, setColors] = useState<{ name: string; images: File[] }[]>([]);
	const [options, setOptions] = useState<{ title: string; value: string }[]>(
		[]
	);
	const [newColorName, setNewColorName] = useState("");
	const [newOption, setNewOption] = useState({ title: "", value: "" });
	const [expandedSections, setExpandedSections] = useState({
		colors: true,
		options: true,
	});

	const toggleSection = (section: keyof typeof expandedSections) => {
		setExpandedSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	const handleAddColor = () => {
		if (!newColorName.trim()) {
			toast.error("Color name cannot be empty");
			return;
		}
		setColors([...colors, { name: newColorName, images: [] }]);
		setNewColorName("");
	};

	const handleRemoveColor = (index: number) => {
		const newColors = [...colors];
		newColors.splice(index, 1);
		setColors(newColors);
	};

	const handleColorImageChange = (index: number, files: FileList | null) => {
		if (!files) return;

		const newColors = [...colors];
		newColors[index].images = Array.from(files);
		setColors(newColors);
	};

	const handleAddOption = () => {
		if (!newOption.title.trim() || !newOption.value.trim()) {
			toast.error("Option title and value cannot be empty");
			return;
		}
		setOptions([
			...options,
			{ title: newOption.title, value: newOption.value },
		]);
		setNewOption({ title: "", value: "" });
	};

	const handleRemoveOption = (index: number) => {
		const newOptions = [...options];
		newOptions.splice(index, 1);
		setOptions(newOptions);
	};

	async function addNewCar() {
		if (
			!car.finition ||
			!car.Année ||
			!car.Boite ||
			!car.Energie ||
			!car.Kilométrage ||
			!car.Moteur ||
			!car.description ||
			!car.price ||
			!car.serieId ||
			!car.status
		) {
			toast.error("Please fill in all fields");
			return;
		}

		if (colors.length === 0) {
			toast.error("Please add at least one color");
			return;
		}
		if (car.status !== "new" && car.status !== "used") {
			toast.error("Status must be either 'new' or 'used'");
			return;
		}

		setLoading((prev) => ({ ...prev, createCar: true }));

		try {
			const response = await CreateCarDB(car);
			if (response.id) {
				toast.success("Car created successfully");
				setCreatedCarId(response.id);

				// Create colors and upload their images
				for (const color of colors) {
					const colorResponse = await CreateNewColor(color.name, response.id);
					if (colorResponse.id && color.images.length > 0) {
						// Upload primary image (first image)
						if (color.images[0]) {
							await UploadPrimaryImage(colorResponse.id, color.images[0]);
						}

						// Upload remaining images if any
						if (color.images.length > 1) {
							await UploadImages(colorResponse.id, color.images.slice(1));
						}
					}
				}

				// Create options
				for (const option of options) {
					await CreateNewOption(option.title, option.value, response.id);
				}

				toast.success("Car with all colors and options created successfully");
			}
		} catch (error) {
			toast.error("Error creating car");
		} finally {
			setLoading((prev) => ({ ...prev, createCar: false }));
		}
	}

	// ... (rest of the existing functions like createNewBrand, createNewSerie, FetchBrands, etc.)

	async function createNewBrand(name: string) {
		if (!name) {
			toast.error("Please fill in all fields");
			return;
		}
		setLoading((prev) => ({ ...prev, createBrand: true }));

		try {
			const response = await CreateBrand(name);
			if (response.id) {
				if (!brandIcon) {
					toast.error("Please select a brand icon image");
					setLoading((prev) => ({ ...prev, createBrand: false }));
					return;
				}
				const icon = await UploadBrandIcon(response.id, brandIcon);
				if (icon.id) {
					toast.success("Brand created successfully");
					FetchBrands();
					setIsCreatingBrand(false);
					setNewBrandName("");
					setBrandIcon(undefined);
				} else {
					toast.error(icon);
				}
			} else {
				toast.error(response);
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
	const [brandIcon, setBrandIcon] = useState<File>();

	async function handleChangeIcon(id: number): Promise<void> {
		if (brandIcon) {
			const resp = await UpdateBrandLogo(id, brandIcon);
			if (resp) {
				toast.success("Icon updated successfully");
				setBrandIcon(undefined);
			}
		} else {
			toast.error("Please select a brand icon image");
		}
	}
	const dot = (color = "transparent") => ({
		alignItems: "center",
		display: "flex",

		":before": {
			backgroundColor: color,
			borderRadius: 10,
			content: '" "',
			display: "block",
			marginRight: 8,
			height: 10,
			width: 10,
		},
	});

	const colourStyles: StylesConfig<any> = {
		control: (styles: any) => ({
			...styles,
			backgroundColor: "var(--background)",
			color: "var(--text)",
		}),
		option: (styles, { data, isDisabled, isFocused, isSelected }) => {
			return {
				...styles,
				backgroundColor: isDisabled
					? undefined
					: isSelected
					? "var(--surface)"
					: isFocused
					? "var(--surface)"
					: "var(--background)",
				color: isDisabled ? "var(--text)" : isSelected,

				cursor: isDisabled ? "not-allowed" : "default",

				":active": {
					...styles[":active"],
					backgroundColor: !isDisabled
						? isSelected
							? "var(--surface)"
							: "var(--background)"
						: undefined,
				},
			};
		},
		input: (styles) => ({ ...styles, ...dot() }),
		placeholder: (styles) => ({ ...styles, color: "var(--text)" }),
		singleValue: (styles, { data }) => ({ ...styles, color: "var(--text)" }),
	};

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
									<>
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
										<div
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
											}}
										>
											<input
												type="file"
												onChange={(e) => setBrandIcon(e.target.files![0])}
												accept="image/*"
												disabled={loading.createBrand}
												placeholder="Change icon"
												style={{
													marginTop: "10px",
												}}
											/>
											<button
												className={styles.addButton}
												onClick={() => (
													handleChangeIcon(selectedBrand.id),
													setBrandIcon(undefined)
												)}
											>
												Change icon
											</button>
										</div>
									</>
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
								<input
									type="file"
									accept="image/*"
									onChange={(e) => setBrandIcon(e.target.files![0])}
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
								styles={colourStyles}
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
								styles={colourStyles}
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
								if (key === "isShiped")
									return (
										<div className={styles.inputGroup} key={key}>
											<label>Available in Store ?</label>
											<div className={styles.toggleGroup}>
												<button
													type="button"
													className={`${styles.toggleButton} ${
														value ? styles.active : ""
													}`}
													onClick={() => setCar({ ...car, isShiped: true })}
												>
													Yes
												</button>
												<button
													type="button"
													className={`${styles.toggleButton} ${
														!value ? styles.active : ""
													}`}
													onClick={() => setCar({ ...car, isShiped: false })}
												>
													No
												</button>
											</div>
										</div>
									);
								if (key === "oldPrice")
									return (
										<div className={styles.inputGroup} key={key}>
											<label>Old Price</label>
											<input
												type="number"
												value={value}
												onChange={(e) =>
													setCar({ ...car, [key]: Number(e.target.value) })
												}
												className={styles.textInput}
												required
											/>
										</div>
									);
								return (
									<div className={styles.inputGroup} key={key}>
										<label>
											{key === "status" ? "Status (new / used)" : key}
										</label>
										{key === "description" ? (
											<textarea
												style={{
													resize: "both",
													minHeight: "80px",
													maxWidth: "100%",
												}}
												value={value}
												onChange={(e) =>
													setCar({ ...car, [key]: e.target.value })
												}
												className={styles.textInput}
												required
											/>
										) : (
											<input
												type={
													key === "price" || key === "oldPrice"
														? "number"
														: "text"
												}
												value={value}
												onChange={(e) =>
													key === "price"
														? setCar({ ...car, [key]: Number(e.target.value) })
														: setCar({ ...car, [key]: e.target.value })
												}
												className={styles.textInput}
												required
											/>
										)}
									</div>
								);
							})}
						</div>
					</div>

					{/* Colors Section */}
					<div className={styles.section}>
						<div
							className={styles.sectionHeader}
							onClick={() => toggleSection("colors")}
							style={{ cursor: "pointer" }}
						>
							<h3>Colors ({colors.length})</h3>
							{expandedSections.colors ? (
								<ChevronUp size={20} />
							) : (
								<ChevronDown size={20} />
							)}
						</div>

						{expandedSections.colors && (
							<>
								<div className={styles.colorList}>
									{colors.map((color, index) => (
										<div key={index} className={styles.colorItem}>
											<div className={styles.colorContent}>
												<input
													type="text"
													value={color.name}
													onChange={(e) => {
														const newColors = [...colors];
														newColors[index].name = e.target.value;
														setColors(newColors);
													}}
													className={styles.textInput}
													placeholder="Color name"
												/>
												<div className={styles.colorActions}>
													<input
														type="file"
														accept="image/*"
														multiple
														onChange={(e) =>
															handleColorImageChange(index, e.target.files)
														}
														className={styles.fileInput}
													/>
													<span className={styles.imageCount}>
														{color.images.length} images
													</span>
													<button
														className={styles.deleteBtn}
														onClick={() => handleRemoveColor(index)}
														title="Delete color"
													>
														<Trash2 size={16} />
													</button>
												</div>
											</div>
										</div>
									))}
								</div>

								<div className={styles.addItem}>
									<input
										type="text"
										value={newColorName}
										onChange={(e) => setNewColorName(e.target.value)}
										placeholder="New color name"
										className={styles.textInput}
									/>
									<button className={styles.addButton} onClick={handleAddColor}>
										<Plus size={16} /> Add Color
									</button>
								</div>
							</>
						)}
					</div>

					{/* Options Section */}
					<div className={styles.section}>
						<div
							className={styles.sectionHeader}
							onClick={() => toggleSection("options")}
							style={{ cursor: "pointer" }}
						>
							<h3>Custom Options ({options.length})</h3>
							{expandedSections.options ? (
								<ChevronUp size={20} />
							) : (
								<ChevronDown size={20} />
							)}
						</div>

						{expandedSections.options && (
							<>
								<div className={styles.optionsList}>
									{options.map((option, index) => (
										<div key={index} className={styles.optionItem}>
											<input
												type="text"
												value={option.title}
												onChange={(e) => {
													const newOptions = [...options];
													newOptions[index].title = e.target.value;
													setOptions(newOptions);
												}}
												className={styles.textInput}
												placeholder="Option name"
											/>
											<input
												type="text"
												value={option.value}
												onChange={(e) => {
													const newOptions = [...options];
													newOptions[index].value = e.target.value;
													setOptions(newOptions);
												}}
												className={styles.textInput}
												placeholder="Option value"
											/>
											<button
												className={styles.deleteBtn}
												onClick={() => handleRemoveOption(index)}
												title="Delete option"
											>
												<Trash2 size={16} />
											</button>
										</div>
									))}
								</div>

								<div className={styles.addItem}>
									<input
										type="text"
										value={newOption.title}
										onChange={(e) =>
											setNewOption({ ...newOption, title: e.target.value })
										}
										placeholder="Option name"
										className={styles.textInput}
									/>
									<input
										type="text"
										value={newOption.value}
										onChange={(e) =>
											setNewOption({ ...newOption, value: e.target.value })
										}
										placeholder="Option value"
										className={styles.textInput}
									/>
									<button
										className={styles.addButton}
										onClick={handleAddOption}
									>
										<Plus size={16} /> Add Option
									</button>
								</div>
							</>
						)}
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
