import OrderManger from "@/components/admin/manager/order.manager";
import { GetAllOrders } from "@/utils/Admin";

async function Orders() {
	const orders = await GetAllOrders();
	console.log(orders);
	return (
		<div>
			<OrderManger />
		</div>
	);
}

export default Orders;
