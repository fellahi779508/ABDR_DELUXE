"use client";
import { Lock, User } from "lucide-react";
import styles from "./login.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/utils/Admin";
function Login() {
	const router = useRouter();
	const [admin, setAdmin] = useState({
		username: "",
		password: "",
	});
	async function HandleSubmit() {
		const response = await login(admin.username, admin.password);
		if (response) {
			router.push("/0218213/dashboard");
		} else {
			alert("Invalid username or password");
		}
	}
	return (
		<div className={styles.form}>
			<div className={styles.container}>
				<span className={styles.title}>Login To Your Admin Account</span>
				<div className={styles.input_fields}>
					<div className={styles.field}>
						<div className={styles.label}>
							<User />
							<span className={styles.label_text}>Username</span>
						</div>
						<input
							type="text"
							required
							className={styles.input}
							onChange={(e) => setAdmin({ ...admin, username: e.target.value })}
							onKeyPress={(e) => e.key === "Enter" && HandleSubmit()}
						/>
					</div>
					<div className={styles.field}>
						<div className={styles.label}>
							<Lock />
							<span className={styles.label_text}>Password</span>
						</div>
						<input
							type="text"
							required
							className={styles.input}
							onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
							onKeyPress={(e) => e.key === "Enter" && HandleSubmit()}
						/>
					</div>
				</div>
				<button
					className={styles.button}
					aria-label="Login"
					type="submit"
					onClick={() => HandleSubmit()}
				>
					Login
				</button>
			</div>
		</div>
	);
}

export default Login;
