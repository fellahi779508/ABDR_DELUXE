/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ContactList.js
"use client";
import { useState } from "react";
import style from "./contact.module.css";

const ContactList = () => {
	const [selectedLocation, setSelectedLocation] = useState("all");

	const locations = [
		{
			id: 1,
			name: "Chlef",
			numbers: ["0553747261", "0772278102", "0540822898", "0553679758"],
			mapLink: "https://maps.app.goo.gl/eNhG4sJcpDcArbhv9?g_st=ipc",
			flag: "🇩🇿",
			country: "algeria",
		},
		{
			id: 2,
			name: "Jijel",
			numbers: ["0556648331", "0777884152"],
			mapLink: "https://maps.app.goo.gl/DdgPyHgVq6AtJX566?g_st=ipc",
			flag: "🇩🇿",
			country: "algeria",
		},
		{
			id: 3,
			name: "Qatar",
			numbers: ["0097477005529", "+974 5583 4328", "00974 66584214"],
			mapLink: null,
			flag: "🇶🇦",
			country: "qatar",
		},
	];

	const filteredLocations = locations.filter((location) => {
		if (selectedLocation === "all") return true;
		if (selectedLocation === "algeria") return location.country === "algeria";
		if (selectedLocation === "qatar") return location.country === "qatar";
		return true;
	});

	const copyToClipboard = (text: any) => {
		navigator.clipboard.writeText(text.replace(/\s/g, "").replace("+", ""));
	};

	return (
		<div className={style["contact-container"]}>
			{/* Brand Header */}
			<div className={style["brand-header"]}>
				<h1 className={style["brand-name"]}>ABR_DELUXE Auto</h1>
				<p className={style["brand-subtitle"]}>Premium Automotive Services</p>
			</div>

			{/* Filter Section */}
			<div className={style["filter-section"]}>
				<button
					className={`${style["filter-btn"]} ${
						selectedLocation === "all" ? style["active"] : ""
					}`}
					onClick={() => setSelectedLocation("all")}
				>
					All Locations
				</button>
				<button
					className={`${style["filter-btn"]} ${
						selectedLocation === "algeria" ? style["active"] : ""
					}`}
					onClick={() => setSelectedLocation("algeria")}
				>
					Algeria
				</button>
				<button
					className={`${style["filter-btn"]} ${
						selectedLocation === "qatar" ? style["active"] : ""
					}`}
					onClick={() => setSelectedLocation("qatar")}
				>
					Qatar
				</button>
			</div>

			{/* Locations Grid */}
			<div className={style["contacts-grid"]}>
				{filteredLocations.length > 0 ? (
					filteredLocations.map((location) => (
						<div key={location.id} className={style["contact-card"]}>
							<h2 className={style["contact-name"]}>
								<span className={style["country-flag"]}>{location.flag}</span>
								{location.name}
							</h2>

							{/* Phone Numbers */}
							<div className={style["phone-section"]}>
								<div className={style["country-label"]}>Phone Numbers</div>
								{location.numbers.map((number, index) => (
									<div
										key={index}
										className={style["phone-number"]}
										onClick={() => copyToClipboard(number)}
										title="Click to copy"
									>
										{number}
										<div className={style["phone-actions"]}>
											<a
												href={`https://wa.me/${number
													.replace(/\s/g, "")
													.replace("+", "")}`}
												className={style["whatsapp-icon"]}
												target="_blank"
												rel="noopener noreferrer"
												title="Chat on WhatsApp"
												onClick={(e) => e.stopPropagation()}
											>
												💬
											</a>
										</div>
									</div>
								))}
							</div>

							{/* Action Buttons */}
							<div className={style["action-buttons"]}>
								{location.mapLink && (
									<a
										href={location.mapLink}
										className={`${style["btn"]} ${style["btn-primary"]}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										Map
									</a>
								)}
								{location.numbers[0] && (
									<a
										href={`https://wa.me/${location.numbers[0]
											.replace(/\s/g, "")
											.replace("+", "")}`}
										className={`${style["btn"]} ${style["btn-whatsapp"]}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										WhatsApp
									</a>
								)}
							</div>
						</div>
					))
				) : (
					<div className={style["no-contacts"]}>
						No locations found for the selected filter.
					</div>
				)}
			</div>
		</div>
	);
};

export default ContactList;
