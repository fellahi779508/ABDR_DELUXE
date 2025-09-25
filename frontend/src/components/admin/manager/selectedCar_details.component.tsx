/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import styles from "./selectedCar_details.module.css";
import {
	CreateNewColor,
	CreateNewOption,
	DeleteCarById,
	DeleteColorById,
	DeleteOptionById,
	UpdateCarById,
	UpdateColorName,
	UpdateOption,
} from "@/utils/Admin";
import { Car, UpdateCar, Color, Option } from "@/utils/Types";
import SelectedCarImages from "./selectedCar_images.component";
import { toast, ToastContainer } from "react-toastify";
import { redirect } from "next/navigation";
import { Plus, X, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { div } from "framer-motion/client";

type CarProps = {
	car: Car;
};

function SelectedCarDetails({ car }: CarProps) {
	async function updateCar(id: string, data: any) {
		try {
			const response = await UpdateCarById(id, data);
			if (response.id) {
				toast.success("Car updated successfully");
				setSelectedCar({ ...selectedCar, ...data });
			}
		} catch (error) {
			console.error(error);
			toast.error("Error updating car");
		}
	}
	const [selectedCar, setSelectedCar] = useState<Car>(car);
	const [updatedCar, setUpdatedCar] = useState<UpdateCar>({
		Année: car.Année,
		Boite: car.Boite,
		Energie: car.Energie,
		Kilométrage: car.Kilométrage,
		Moteur: car.Moteur,
		description: car.description,
		finition: car.finition,
		price: car.price,
		status: car.status,
	});

	const [openImages, setOpenImages] = useState(false);
	const [selectedColor, setSelectedColor] = useState<Color | null>(null);
	const [newColorName, setNewColorName] = useState("");
	const [newOption, setNewOption] = useState({ name: "", value: "" });
	const [expandedSections, setExpandedSections] = useState({
		colors: true,
		options: true,
	});

	useEffect(() => {
		setSelectedCar(car);
	}, [car]);

	const handleUpdateColorName = async (colorId: number, newName: string) => {
		try {
			await UpdateColorName(colorId, newName);
			toast.success("Color name updated");

			// Update local state
			setSelectedCar((prev) => ({
				...prev,
				colors: prev.colors.map((color) =>
					color.id === colorId ? { ...color, name: newName } : color
				),
			}));
		} catch (error) {
			console.error(error);
			toast.error("Error updating color name");
		}
	};

	const handleCreateNewColor = async () => {
		if (!newColorName.trim()) {
			toast.error("Color name cannot be empty");
			return;
		}

		try {
			const response = await CreateNewColor(newColorName, selectedCar.id);
			if (response.id) {
				toast.success("New color added");
				setNewColorName("");

				// In a real app, you would refetch the car data to get the updated colors
				// For now, we'll just add a placeholder

				setSelectedCar((prev) => ({
					...prev,
					colors: [...prev.colors, response],
				}));
			} else {
				toast.error("Error creating new color");
			}
		} catch (error) {
			console.error(error);
			toast.error("Error creating new color");
		}
	};

	const handleDeleteColor = async (colorId: number) => {
		if (!confirm("Are you sure you want to delete this color?")) return;

		try {
			// Assuming we have a function to delete color
			const response = await DeleteColorById(colorId);
			if (response === "deleted") {
				toast.success("Color deleted");
				setSelectedCar((prev) => ({
					...prev,
					colors: prev.colors.filter((color) => color.id !== colorId),
				}));

				if (selectedColor?.id === colorId) {
					setSelectedColor(null);
				}
			}
		} catch (error) {
			console.error(error);
			toast.error("Error deleting color");
		}
	};

	const handleUpdateOption = async (
		optionId: number,
		name: string,
		value: string
	) => {
		try {
			const response = await UpdateOption(optionId, name, value);
			if (response.id) {
				toast.success("Option updated");

				setSelectedCar((prev) => ({
					...prev,
					options: prev.options.map((option) =>
						option.id === optionId ? { ...option, response } : option
					),
				}));
			} else {
				toast.error("Error updating option");
			}
		} catch (error) {
			console.error(error);
			toast.error("Error updating option");
		}
	};

	const handleDeleteOption = async (optionId: number) => {
		console.log(optionId);
		if (!confirm("Are you sure you want to delete this option?")) return;

		try {
			const response = await DeleteOptionById(optionId);
			if (response === "deleted") {
				toast.success("Option deleted");

				setSelectedCar((prev) => ({
					...prev,
					options: prev.options.filter((option) => option.id !== optionId),
				}));
			} else {
				toast.error("Error deleting option");
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleCreateNewOption = async () => {
		console.log(newOption);
		if (!newOption.name.trim() || !newOption.value.trim()) {
			toast.error("Option name and value cannot be empty");
			return;
		}

		try {
			// Assuming we have a function to create new option
			const response = await CreateNewOption(
				newOption.name,
				newOption.value,
				selectedCar.id
			);
			toast.success("New option added");

			// Update local state

			setSelectedCar((prev) => ({
				...prev,
				options: [...prev.options, response],
			}));

			setNewOption({ name: "", value: "" });
		} catch (error) {
			console.error(error);
			toast.error("Error creating new option");
		}
	};

	const toggleSection = (section: keyof typeof expandedSections) => {
		setExpandedSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	const [selectedColorId, setSelectedColorId] = useState<number>();

	return openImages ? (
		<>
			<button className={styles.close_btn} onClick={() => setOpenImages(false)}>
				Close Images
			</button>
			<SelectedCarImages id={selectedColorId ?? 0} />
		</>
	) : (
		<div className={styles.overlay}>
			<div className={styles.container}>
				<h2 className={styles.title}>
					Editing: {selectedCar.serie.brand.name} {selectedCar.serie.name}
				</h2>

				<div className={styles.details}>
					{Object.entries(selectedCar).map(([key, value]) => {
						if (
							key === "images" ||
							key === "serie" ||
							key === "id" ||
							key === "slug" ||
							key === "colors" ||
							key === "options" ||
							key === "isVisible"
						)
							return null;
						if (key === "isShiped")
							return (
								<div key={key} className={styles.detail_item}>
									<span className={styles.detail_label}>Available ?</span>
									<input
										type="checkbox"
										className={styles.checkbox}
										defaultChecked={value}
										onChange={(e) =>
											setUpdatedCar({
												...updatedCar,
												[key]: e.target.checked,
											})
										}
									/>
								</div>
							);

						return (
							<div key={key} className={styles.detail_item}>
								<span className={styles.detail_label}>
									{key.charAt(0).toUpperCase() + key.slice(1)}:
								</span>
								<input
									type={
										key === "price" || key === "oldPrice" ? "number" : "text"
									}
									className={styles.detail_value}
									defaultValue={String(value)}
									onChange={(e) =>
										key === "price"
											? setUpdatedCar({
													...updatedCar,
													[key]: Number(e.target.value),
											  })
											: key === "oldPrice"
											? setUpdatedCar({
													...updatedCar,
													[key]: Number(e.target.value),
											  })
											: setUpdatedCar({
													...updatedCar,
													[key]: e.target.value,
											  })
									}
								/>
							</div>
						);
					})}
				</div>

				{/* Colors Section */}
				<div className={styles.section}>
					<div
						className={styles.section_header}
						onClick={() => toggleSection("colors")}
					>
						<h3>Colors ({selectedCar.colors.length})</h3>
						{expandedSections.colors ? (
							<ChevronUp size={20} />
						) : (
							<ChevronDown size={20} />
						)}
					</div>

					{expandedSections.colors && (
						<>
							<div className={styles.color_list}>
								{selectedCar.colors.map((color) => (
									<div key={color.id} className={styles.color_item}>
										<div className={styles.color_content}>
											<input
												type="text"
												value={color.name}
												onChange={(e) => {
													const updatedColors = selectedCar.colors.map((c) =>
														c.id === color.id
															? { ...c, name: e.target.value }
															: c
													);
													setSelectedCar((prev) => ({
														...prev,
														colors: updatedColors,
													}));
												}}
												onBlur={(e) =>
													handleUpdateColorName(color.id, e.target.value)
												}
												className={styles.color_input}
											/>
											<div className={styles.color_actions}>
												<button
													className={styles.image_btn}
													onClick={() => {
														setSelectedColor(color);
														setSelectedColorId(color.id);
														setOpenImages(true);
													}}
													title="View images"
												>
													Images ({color.images?.length ?? 0})
												</button>
												<button
													className={styles.delete_btn}
													onClick={() => handleDeleteColor(color.id)}
													title="Delete color"
												>
													<Trash2 size={16} />
												</button>
											</div>
										</div>
									</div>
								))}
							</div>

							<div className={styles.add_item}>
								<input
									type="text"
									value={newColorName}
									onChange={(e) => setNewColorName(e.target.value)}
									placeholder="New color name"
									className={styles.add_input}
								/>
								<button
									className={styles.add_btn}
									onClick={handleCreateNewColor}
								>
									<Plus size={16} /> Add Color
								</button>
							</div>
						</>
					)}
				</div>

				{/* Options Section */}
				<div className={styles.section}>
					<div
						className={styles.section_header}
						onClick={() => toggleSection("options")}
					>
						<h3>Custom Options ({selectedCar.options.length})</h3>
						{expandedSections.options ? (
							<ChevronUp size={20} />
						) : (
							<ChevronDown size={20} />
						)}
					</div>

					{expandedSections.options && (
						<>
							<div className={styles.options_list}>
								{selectedCar.options.map((option) => (
									<div key={option.id} className={styles.option_item}>
										<input
											type="text"
											value={option.title}
											onChange={(e) => {
												const updatedOptions = selectedCar.options.map((o) =>
													o.id === option.id
														? { ...o, title: e.target.value }
														: o
												);
												setSelectedCar((prev) => ({
													...prev,
													options: updatedOptions,
												}));
											}}
											onBlur={(e) =>
												handleUpdateOption(
													option.id,
													e.target.value,
													option.value
												)
											}
											className={styles.option_input}
											placeholder="Option name"
										/>
										<input
											type="text"
											value={option.value}
											onChange={(e) => {
												const updatedOptions = selectedCar.options.map((o) =>
													o.id === option.id
														? { ...o, value: e.target.value }
														: o
												);
												setSelectedCar((prev) => ({
													...prev,
													options: updatedOptions,
												}));
											}}
											onBlur={(e) =>
												handleUpdateOption(
													option.id,
													option.title,
													e.target.value
												)
											}
											className={styles.option_input}
											placeholder="Option value"
										/>
										<button
											className={styles.delete_btn}
											onClick={() => handleDeleteOption(option.id)}
											title="Delete option"
										>
											<Trash2 size={16} />
										</button>
									</div>
								))}
							</div>

							<div className={styles.add_item}>
								<input
									type="text"
									value={newOption.name}
									onChange={(e) =>
										setNewOption({ ...newOption, name: e.target.value })
									}
									placeholder="Option name"
									className={styles.add_input}
								/>
								<input
									type="text"
									value={newOption.value}
									onChange={(e) =>
										setNewOption({ ...newOption, value: e.target.value })
									}
									placeholder="Option value"
									className={styles.add_input}
								/>
								<button
									className={styles.add_btn}
									onClick={handleCreateNewOption}
								>
									<Plus size={16} /> Add Option
								</button>
							</div>
						</>
					)}
				</div>

				<div className={styles.actions}>
					<button
						className={styles.savebtn}
						onClick={() => {
							updateCar(car.id, updatedCar);
						}}
					>
						Save Changes
					</button>
				</div>
			</div>
			<ToastContainer />
		</div>
	);
}

export default SelectedCarDetails;
