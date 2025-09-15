import OrderComponent from "@/components/order/order.component";
import { OrderRoute } from "@/utils/ProtectedRoute";
import { cookies } from "next/headers";

async function Order() {
	await OrderRoute();
	const price = (await cookies()).get("price")?.value;
	return (
		<div>
			<OrderComponent price={Number(price)} />
		</div>
	);
}

export default Order;
