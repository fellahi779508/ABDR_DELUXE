import CarManager from "@/components/admin/manager/cars_manager.component";
import ProtectedRoute from "@/utils/ProtectedRoute";
export const dynamic = "force-dynamic";
async function AdminCars() {
	await ProtectedRoute();

	return (
		<div>
			<CarManager />
		</div>
	);
}

export default AdminCars;
