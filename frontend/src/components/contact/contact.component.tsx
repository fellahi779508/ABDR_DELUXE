/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import style from "./contact.module.css";
import { Phone, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

const ContactList = () => {
	const [selectedLocation, setSelectedLocation] = useState("all");
	const t = useTranslations("contacts");

	const locations = [
		{
			id: 1,
			name: "Chlef",
			numbers: [
				"+213 553 74 72 61",
				"+213 772 27 81 02",
				"+213 540 82 28 98",
				"+213 553 67 97 58",
			],
			mapLink: "https://maps.app.goo.gl/eNhG4sJcpDcArbhv9?g_st=ipc",
			flag: "🇩🇿",
			country: "algeria",
		},
		{
			id: 2,
			name: "Jijel",
			numbers: ["+213 556 64 83 31", "+213 777 88 41 52"],
			mapLink: "https://maps.app.goo.gl/DdgPyHgVq6AtJX566?g_st=ipc",
			flag: "🇩🇿",
			country: "algeria",
		},
		{
			id: 3,
			name: "Qatar",
			numbers: ["+974 77005529", "+974 5583 4328", "+974 66584214"],
			mapLink: null,
			flag: "🇶🇦",
			country: "qatar",
		},
	];

	const filteredLocations = locations.filter((location) => {
		if (selectedLocation === "all") return true;
		return location.country === selectedLocation;
	});

	return (
		<div className={style["contact-container"]}>
			{/* Filter Section */}
			<div className={style["filter-section"]}>
				<button
					className={`${style["filter-btn"]} ${
						selectedLocation === "all" ? style["active"] : ""
					}`}
					onClick={() => setSelectedLocation("all")}
				>
					{t("filters.all")}
				</button>
				<button
					className={`${style["filter-btn"]} ${
						selectedLocation === "algeria" ? style["active"] : ""
					}`}
					onClick={() => setSelectedLocation("algeria")}
				>
					{t("filters.algeria")}
				</button>
				<button
					className={`${style["filter-btn"]} ${
						selectedLocation === "qatar" ? style["active"] : ""
					}`}
					onClick={() => setSelectedLocation("qatar")}
				>
					{t("filters.qatar")}
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
								<div className={style["country-label"]}>
									{t("labels.phoneNumbers")}
								</div>
								{location.numbers.map((number, index) => (
									<div key={index} className={style["phone-number"]}>
										<span>{number}</span>
										<div className={style["phone-actions"]}>
											{/* WhatsApp */}
											<a
												href={`https://wa.me/${number
													.replace(/\s/g, "")
													.replace("+", "")}`}
												target="_blank"
												rel="noopener noreferrer"
												className={style["whatsapp-icon"]}
												title={t("actions.chat")}
											>
												<MessageCircle size={20} color="#25D366" />
											</a>
											{/* Call */}
											<a
												href={`tel:${number.replace(/\s/g, "")}`}
												className={style["whatsapp-icon"]}
												title={t("actions.call")}
											>
												<Phone size={20} color="#007bff" />
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
										{t("labels.map")}
									</a>
								)}
							</div>
						</div>
					))
				) : (
					<div className={style["no-contacts"]}>{t("labels.noContacts")}</div>
				)}
			</div>
		</div>
	);
};

export default ContactList;
