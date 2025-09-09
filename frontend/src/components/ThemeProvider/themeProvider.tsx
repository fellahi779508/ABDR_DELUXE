"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
	const [theme, setTheme] = useState<"light" | "dark">("light");

	// Load from localStorage
	useEffect(() => {
		const saved = localStorage.getItem("theme") as "light" | "dark" | null;
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)"
		).matches;
		const initial = saved || (prefersDark ? "dark" : "light");
		setTheme(initial);
		document.documentElement.setAttribute("data-theme", initial);
	}, []);

	// Toggle theme
	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		document.documentElement.setAttribute("data-theme", newTheme);
		localStorage.setItem("theme", newTheme);
	};

	return (
		<button
			onClick={toggleTheme}
			className="theme-toggle"
			aria-label="Toggle Theme"
		>
			{theme === "light" ? (
				<Moon size={20} strokeWidth={2} />
			) : (
				<Sun size={20} strokeWidth={2} />
			)}
		</button>
	);
}
