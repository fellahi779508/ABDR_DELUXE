"use client";
import Image from "next/image";
import style from "./main.module.css";
import Link from "next/link";
import { useTranslations } from "next-intl";

const Main = () => {
	const t = useTranslations("Main"); // 👈 scope = folder of JSON keys

	return (
		<div className={`landing-page ${style["landing-page"]}`}>
			{/* Main Content */}
			<main className={`main-content ${style["main-content"]}`}>
				<div className={`content-wrapper ${style["content-wrapper"]}`}>
					{/* Text Content */}
					<div className={`text-content ${style["text-content"]}`}>
						<div className={`badge ${style["badge"]}`}>
							<span>{t("badge")}</span>
						</div>

						<h1 className={`main-title ${style["main-title"]}`}>
							<span className={`title-line ${style["title-line"]}`}>
								{t("title.line1")}
							</span>
							<span
								className={`title-line accent ${style["title-line"]} ${style["accent"]}`}
							>
								{t("title.line2")}
							</span>
						</h1>

						<p className={`description ${style["description"]}`}>
							{t("description")}
						</p>

						<div className={`features-grid ${style["features-grid"]}`}>
							<div className={`feature ${style["feature"]}`}>
								<span>{t("features.global")}</span>
							</div>
							<div className={`feature ${style["feature"]}`}>
								<span>{t("features.delivery")}</span>
							</div>
							<div className={`feature ${style["feature"]}`}>
								<span>{t("features.quality")}</span>
							</div>
						</div>

						<div className={`button-group ${style["button-group"]}`}>
							<Link
								href="/buy"
								className={`btn btn-primary ${style["btn"]} ${style["btn-primary"]}`}
							>
								<span>{t("buttons.browse")}</span>
							</Link>
							<Link
								href="/contact"
								className={`btn btn-secondary ${style["btn"]} ${style["btn-secondary"]}`}
							>
								<span>{t("buttons.contact")}</span>
							</Link>
						</div>

						<div className={`stats ${style["stats"]}`}>
							<div className={`stat ${style["stat"]}`}>
								<div className={`stat-number ${style["stat-number"]}`}>
									{t("stats.vehicles.number")}
								</div>
								<div className={`stat-label ${style["stat-label"]}`}>
									{t("stats.vehicles.label")}
								</div>
							</div>
							<div className={`stat ${style["stat"]}`}>
								<div className={`stat-number ${style["stat-number"]}`}>
									{t("stats.countries.number")}
								</div>
								<div className={`stat-label ${style["stat-label"]}`}>
									{t("stats.countries.label")}
								</div>
							</div>
							<div className={`stat ${style["stat"]}`}>
								<div className={`stat-number ${style["stat-number"]}`}>
									{t("stats.support.number")}
								</div>
								<div className={`stat-label ${style["stat-label"]}`}>
									{t("stats.support.label")}
								</div>
							</div>
						</div>
					</div>

					{/* Image Content */}
					<div className={`image-content ${style["image-content"]}`}>
						<div className={`image-container ${style["image-container"]}`}>
							<Image
								src="/images/hero.png"
								alt="Premium Car"
								width={600}
								height={400}
								className={`car-image ${style["car-image"]}`}
								priority
							/>

							{/* Floating Cards */}
							<div
								className={`floating-card card-1 ${style["floating-card"]} ${style["card-1"]}`}
							>
								<div className={`card-icon ${style["card-icon"]}`}>🚙</div>
								<div className={`card-content ${style["card-content"]}`}>
									<div className={`card-title ${style["card-title"]}`}>
										{t("cards.china.title")}
									</div>
									<div className={`card-subtitle ${style["card-subtitle"]}`}>
										{t("cards.china.subtitle")}
									</div>
								</div>
							</div>

							<div
								className={`floating-card card-2 ${style["floating-card"]} ${style["card-2"]}`}
							>
								<div className={`card-icon ${style["card-icon"]}`}>🏎️</div>
								<div className={`card-content ${style["card-content"]}`}>
									<div className={`card-title ${style["card-title"]}`}>
										{t("cards.uae.title")}
									</div>
									<div className={`card-subtitle ${style["card-subtitle"]}`}>
										{t("cards.uae.subtitle")}
									</div>
								</div>
							</div>

							<div
								className={`floating-card card-3 ${style["floating-card"]} ${style["card-3"]}`}
							>
								<div className={`card-icon ${style["card-icon"]}`}>✨</div>
								<div className={`card-content ${style["card-content"]}`}>
									<div className={`card-title ${style["card-title"]}`}>
										{t("cards.qatar.title")}
									</div>
									<div className={`card-subtitle ${style["card-subtitle"]}`}>
										{t("cards.qatar.subtitle")}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Main;
