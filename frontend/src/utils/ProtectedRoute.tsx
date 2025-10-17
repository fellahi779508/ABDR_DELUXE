/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function ProtectedRoute() {
	const token = (await cookies()).get("access_token")?.value;
	if (!token) {
		redirect("/0218213");
	}
	try {
		const { payload } = await jwtVerify(
			token,
			new TextEncoder().encode(process.env.JWT_SECRET!)
		);
		if (payload.username !== process.env.ADMIN_USERNAME) {
			redirect("/0218213");
		}
	} catch (error) {
		redirect("/0218213");
	}
	return true;
}
export async function OrderRoute() {
	const today = new Date().toISOString().split("T")[0];
	const oldOrderDate = (await cookies()).get("orderDate")?.value.split("T")[0];
	if (oldOrderDate === today) {
		return redirect("/order/oneTime");
	}
}
