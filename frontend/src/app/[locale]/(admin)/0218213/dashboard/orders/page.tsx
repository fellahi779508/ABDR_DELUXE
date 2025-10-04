import OrderManger from "@/components/admin/manager/order.manager";
export const dynamic = "force-dynamic";
async function Orders() {
	return (
		<div>
			<OrderManger />
		</div>
	);
}

export default Orders;
