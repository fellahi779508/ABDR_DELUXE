import CarManager from "@/components/admin/manager/cars_manager.component";
import ProtectedRoute from "@/utils/ProtectedRoute";

async function AdminCars() {
	await ProtectedRoute();

	return (
		<div>
			<CarManager />
		</div>
	);
}

export default AdminCars;
