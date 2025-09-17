import Dashboard_Component from "@/components/admin/dashboard/dashboard.component";
import styles from "@/styles/admin.module.css";
import ProtectedRoute from "@/utils/ProtectedRoute";
export const dynamic = "force-dynamic";
async function Dashboard() {
	await ProtectedRoute();
	return (
		<div className={styles.container}>
			<Dashboard_Component />
		</div>
	);
}

export default Dashboard;
