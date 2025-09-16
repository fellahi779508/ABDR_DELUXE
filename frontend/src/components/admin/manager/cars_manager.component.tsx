/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import {
	Plus,
	Eye,
	EyeOff,
	Edit3,
	Trash2,
	Search,
	ChevronDown,
	Filter,
	X,
	Save,
} from "lucide-react";
import styles from "./car_manager.component.module.css";
import { DeleteCarById, GetAllCars, UpdateCarVisibility } from "@/utils/Admin";
import Image from "next/image";
import SelectedCarDetails from "./selectedCar_details.component";
import AddNewCar from "./addnew.component";
import { Car } from "@/utils/Types";
import { redirect } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

function CarManager() {
	const [cars, setCars] = useState<Car[] | []>([]);
	const [filteredCars, setFilteredCars] = useState<Car[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<
		"all" | "visible" | "hidden"
	>("all");
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [addnew, setAddNew] = useState(false);
	useEffect(() => {
		async function fetchCars() {
			try {
				const data = await GetAllCars();
				setCars(data);
				setFilteredCars(data);
			} catch (err) {
				console.error(err);
			}
		}
		fetchCars();
	}, []);

	useEffect(() => {
		let results = cars;

		// Apply search filter
		if (searchQuery) {
			results = results.filter(
				(car) =>
					car.serie.brand.name
						.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					car.serie.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					car.finition.toLowerCase().includes(searchQuery.toLowerCase()) ||
					car.Année.includes(searchQuery)
			);
		}

		// Apply status filter
		if (statusFilter !== "all") {
			results = results.filter((car) =>
				statusFilter === "visible" ? car.isVisible : !car.isVisible
			);
		}

		setFilteredCars(results);
	}, [searchQuery, statusFilter, cars]);

	const handleToggleVisibility = (index: number) => {
		setCars((prevCars) =>
			prevCars.map((c, i) =>
				i === index ? { ...c, isVisible: !c.isVisible } : c
			)
		);
		UpdateCarVisibility(cars[index].id, !cars[index].isVisible);
	};

	const clearFilters = () => {
		setSearchQuery("");
		setStatusFilter("all");
	};
	const [selectedCar, setSelectedCar] = useState({
		isSelected: false,
		car: {} as Car,
	});
	const [initialCars, setInitialCars] = useState<Car[]>([]);

	// Store initial cars on first fetch
	useEffect(() => {
		if (cars.length && initialCars.length === 0) {
			setInitialCars(cars);
		}
	}, [cars, initialCars.length]);

	async function deleteCar(id: string) {
		const response = await DeleteCarById(id);
		if (response === "deleted") {
			toast.success("Car deleted successfully");
			setTimeout(() => redirect("/admin/dashboard/cars"), 1000);
		} else {
			toast.error("Error deleting car");
		}
	}
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.header_content}>
					<div className={styles.title_section}>
						<h1>Car Inventory</h1>
						<p>Manage your vehicle listings</p>
					</div>

					<button
						className={styles.add_car_btn}
						onClick={() => setAddNew(true)}
					>
						<Plus size={18} />
						<span>Add New Car</span>
					</button>
				</div>
			</div>

			<div className={styles.toolbar}>
				<div className={styles.search_container}>
					<Search size={18} className={styles.search_icon} />
					<input
						type="text"
						placeholder="Search by brand, model, finition or year..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className={styles.search_input}
					/>
					{searchQuery && (
						<X
							size={16}
							className={styles.clear_icon}
							onClick={() => setSearchQuery("")}
						/>
					)}
				</div>

				<div className={styles.filter_section}>
					<button
						className={styles.filter_toggle}
						onClick={() => setIsFilterOpen(!isFilterOpen)}
					>
						<Filter size={16} />
						<span>Filters</span>
						<ChevronDown
							size={16}
							className={isFilterOpen ? styles.rotate : ""}
						/>
					</button>

					{isFilterOpen && (
						<div className={styles.filter_dropdown}>
							<div className={styles.filter_group}>
								<label>Status</label>
								<div className={styles.filter_options}>
									<button
										className={
											statusFilter === "all" ? styles.active_filter : ""
										}
										onClick={() => setStatusFilter("all")}
									>
										All
									</button>
									<button
										className={
											statusFilter === "visible" ? styles.active_filter : ""
										}
										onClick={() => setStatusFilter("visible")}
									>
										Visible
									</button>
									<button
										className={
											statusFilter === "hidden" ? styles.active_filter : ""
										}
										onClick={() => setStatusFilter("hidden")}
									>
										Hidden
									</button>
								</div>
							</div>
							{(searchQuery || statusFilter !== "all") && (
								<button className={styles.clear_filters} onClick={clearFilters}>
									Clear Filters
								</button>
							)}
						</div>
					)}
				</div>
			</div>

			<div className={styles.content}>
				<div className={styles.stats_bar}>
					<div className={styles.stat_item}>
						<span className={styles.stat_number}>{cars.length}</span>
						<span className={styles.stat_label}>Total Cars</span>
					</div>
					<div className={styles.stat_item}>
						<span className={styles.stat_number}>
							{cars.filter((c) => c.isVisible).length}
						</span>
						<span className={styles.stat_label}>Visible</span>
					</div>
					<div className={styles.stat_item}>
						<span className={styles.stat_number}>
							{cars.filter((c) => !c.isVisible).length}
						</span>
						<span className={styles.stat_label}>Hidden</span>
					</div>
				</div>

				{filteredCars.length === 0 ? (
					<div className={styles.no_cars}>
						<h3>No cars found</h3>
						<p>Try adjusting your search or filters</p>
						{(searchQuery || statusFilter !== "all") && (
							<button
								className={styles.clear_filters_btn}
								onClick={clearFilters}
							>
								Clear Filters
							</button>
						)}
					</div>
				) : (
					<div className={styles.cars_grid}>
						{filteredCars.map((car, index) => (
							<div
								className={`${styles.car_card} ${
									car.isVisible ? "" : styles.hidden_card
								}`}
								key={car.id}
							>
								<div className={styles.card_header}>
									<span className={styles.car_year}>{car.Année}</span>
									<div className={styles.visibility_badge}>
										{car.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
										<span>{car.isVisible ? "Visible" : "Hidden"}</span>
									</div>
								</div>

								<div className={styles.car_image}>
									<Image
										src={
											car.images.find((img) => img.isPrimary === true)?.url ??
											car.images[0]?.url ??
											"/images/placeholder.png"
										}
										alt={`${car.serie.brand.name} ${car.serie.name}`}
										width={300}
										height={200}
										className={styles.image}
									/>
								</div>

								<div className={styles.car_info}>
									<h3 className={styles.car_brand}>{car.serie.brand.name}</h3>
									<h4 className={styles.car_model}>{car.serie.name}</h4>
									<p className={styles.car_finition}>{car.finition}</p>

									<div className={styles.car_details}>
										<div className={styles.detail_item}>
											<span className={styles.detail_label}>Mileage</span>
											<span className={styles.detail_value}>
												{car.Kilométrage}
											</span>
										</div>
										<div className={styles.detail_item}>
											<span className={styles.detail_label}>Energy</span>
											<span className={styles.detail_value}>{car.Energie}</span>
										</div>
										<div className={styles.detail_item}>
											<span className={styles.detail_label}>Gearbox</span>
											<span className={styles.detail_value}>{car.Boite}</span>
										</div>
									</div>

									<div className={styles.price_section}>
										<span className={styles.price}>
											{car.price.toLocaleString()} DZD
										</span>
									</div>
								</div>

								<div className={styles.card_footer}>
									<button
										className={
											car.isVisible
												? styles.visibility_btn_visible
												: styles.visibility_btn_hidden
										}
										onClick={() => handleToggleVisibility(index)}
									>
										{car.isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
										<span>{car.isVisible ? "Hide" : "Show"}</span>
									</button>

									<div className={styles.action_buttons}>
										<button
											className={styles.edit_btn}
											onClick={() =>
												setSelectedCar({
													car: car,
													isSelected: true,
												})
											}
										>
											<Edit3 size={16} />
										</button>
										<button
											className={styles.delete_btn}
											onClick={() => deleteCar(car.id)}
										>
											<Trash2 size={16} />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
			{selectedCar.isSelected === true ? (
				<>
					<button
						onClick={() =>
							setSelectedCar({ ...selectedCar, isSelected: false })
						}
						className={styles.close_btn}
					>
						Close
					</button>
					<SelectedCarDetails car={selectedCar.car} />
				</>
			) : null}
			{addnew === true ? (
				<>
					<button onClick={() => setAddNew(false)} className={styles.close_btn}>
						Close
					</button>
					<AddNewCar />
				</>
			) : null}
			<ToastContainer />
		</div>
	);
}

export default CarManager;
