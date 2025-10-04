"use client";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useState, useRef, useEffect } from "react";
import "./languageSwitcher.css";

const locales = [
	{ code: "en", label: "🇺🇸 English" },
	{ code: "fr", label: "🇫🇷 Français" },
	{ code: "ar", label: "🇸🇦 العربية" },
];

export default function LanguageSwitcher() {
	const router = useRouter();
	const pathname = usePathname();
	const currentLocale = useLocale();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Find the current locale object
	const currentLocaleObj =
		locales.find((locale) => locale.code === currentLocale) || locales[0];

	const handleChange = (newLocale: string) => {
		const segments = pathname.split("/");
		segments[1] = newLocale;
		const newPath = segments.join("/");
		router.replace(newPath);
		setIsOpen(false);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="language-switcher" ref={dropdownRef}>
			<div
				className={`selector ${isOpen ? "open" : ""}`}
				onClick={() => setIsOpen(!isOpen)}
			>
				<div className="current-locale">
					<span className="flag">{currentLocaleObj.label.split(" ")[0]}</span>
					<span className="label">
						{currentLocaleObj.label.split(" ").slice(1).join(" ")}
					</span>
				</div>
				<svg
					className={`chevron ${isOpen ? "open" : ""}`}
					width="16"
					height="16"
					viewBox="0 0 24 24"
				>
					<path d="M7 10l5 5 5-5z" />
				</svg>
			</div>

			<div className={`dropdown ${isOpen ? "open" : ""}`}>
				{locales.map(({ code, label }) => (
					<div
						key={code}
						className={`option ${currentLocale === code ? "active" : ""}`}
						onClick={() => handleChange(code)}
					>
						<span className="flag">{label.split(" ")[0]}</span>
						<span className="label">{label.split(" ").slice(1).join(" ")}</span>
					</div>
				))}
			</div>
		</div>
	);
}
