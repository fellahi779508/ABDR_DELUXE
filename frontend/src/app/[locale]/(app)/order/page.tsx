import OrderComponent from "@/components/order/order.component";
import { OrderRoute } from "@/utils/ProtectedRoute";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

// Server-side function to get cart from localStorage simulation
// Since we can't access localStorage directly on the server, we'll handle it client-side
// This function will be used to pass initial cart data if needed

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
