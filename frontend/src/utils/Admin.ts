/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";
import { cookies } from "next/headers";
import { api } from "./api";
import { CreateCar, UpdateCar } from "./Types";
type Car = {
	Année: string;
	Boite: string;
	Energie: string;
	Kilométrage: string;
	Moteur: string;
	color: string;
	description: string;
	finition: string;
	price: number;
};

export async function logout() {
	try {
		const response = await api.post(`/admin/logout`);
		if (response) {
			(await cookies()).delete("access_token");
			return true;
		}
	} catch (error) {
		return false;
	}
}
export async function login(username: string, password: string) {
	try {
		const response = await api.post(`/admin/login`, {
			username,
			password,
		});
		const token = response.data;

		if (token) {
			// ✅ store token in secure httpOnly cookie (Next.js side)
			(
				await // ✅ store token in secure httpOnly cookie (Next.js side)
				cookies()
			).set("access_token", token, {
				httpOnly: true,
				sameSite: "lax",
				secure: process.env.NODE_ENV === "production",
				path: "/",
				maxAge: 7 * 24 * 60 * 60, // 7 days
			});
			return true;
		}
		return false;
	} catch {
		return false;
	}
}
export async function GetAllCars() {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.get(`/car?page=0&limit=0`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return response.data;
		}
	} catch (error) {
		return error;
	}
}
export async function UpdateGroupCarById(id: string, data: Car[]) {
	console.log(data);
	const token = (await cookies()).get("access_token")?.value;
	try {
		for (const car of data) {
			car.price = Number(car.price);
			const response = await api.put(
				`/car/update/${id}`,
				{ data: car },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (response) {
				return response.data;
			}
		}
	} catch (error) {
		return error;
	}
}
export async function DeleteCarById(id: string) {
	console.log(id);
	try {
		const response = await api.delete(`/car/${id}`);
		if (response) {
			return "deleted";
		}
	} catch (error) {
		console.error(error);
		return "error";
	}
}
export async function UpdateCarById(id: string, data: UpdateCar) {
	const token = (await cookies()).get("access_token")?.value;
	try {
		const response = await api.put(`/car/update/${id}`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response) {
			return "updated";
		}
	} catch (error) {
		return "error";
	}
}

export async function FetchAllBrands() {
	try {
		const response = await api.get(`/brand?page=0&limit=0`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		return error;
	}
}
export async function FetchAllSeries() {
	try {
		const response = await api.get(`/serie?page=0&limit=0`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		return error;
	}
}
export async function CreateBrand(name: string) {
	try {
		const response = await api.post(`/brand`, { name: name });
		if (response) {
			return response.data;
		}
	} catch (error) {
		return error;
	}
}
export async function FetchSeriesByBrand(id: number) {
	try {
		const response = await api.get(`/serie/brand/${id}`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		return error;
	}
}
export async function Createserie(name: string, brandId: number) {
	try {
		const response = await api.post(`/serie`, { name: name, brandId: brandId });
		if (response) {
			return response.data;
		}
	} catch (error) {
		return error;
	}
}
export async function CreateCarDB(car: CreateCar) {
	try {
		const response = await api.post(`/car`, car);
		if (response) {
			return response.data;
		}
	} catch (error) {
		return error;
	}
}
export async function UploadPrimaryImage(id: string, image: File) {
	const formData = new FormData();
	formData.append("files", image);

	try {
		const response = await api.post(
			`/car/${id}/images?isPrimary=true`,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);

		return response.data;
	} catch (error) {
		console.error("Upload error:", error);
		return null;
	}
}
export async function UploadImages(id: string, image: File[]) {
	const formData = new FormData();
	for (const file of image) {
		formData.append("files", file);
	}
	try {
		const response = await api.post(
			`/car/${id}/images?isPrimary=false`,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
		if (response) {
			console.log(response.data);
			return response.data;
		}
	} catch (error) {
		console.error("Upload error:", error);
		return null;
	}
}
export async function FetchCarImages(id: string) {
	try {
		const response = await api.get(`/image/${id}`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		return error;
	}
}
export async function DeleteImageById(id: string) {
	try {
		const response = await api.delete(`/image/${id}`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		return error;
	}
}
export async function UpdateImageToPrimary(id: string) {
	try {
		const response = await api.put(`/image/MakePrimary/${id}`);
		if (response) {
			return "updated";
		}
	} catch (error) {
		return "error";
	}
}
export async function DeleteAllCarImages(imageId: string) {
	try {
		const response = await api.delete(`/image/DeleteAll/${imageId}`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		return error;
	}
}
export async function UpdateCarVisibility(id: string, isVisible: boolean) {
	try {
		const response = await api.put(`/car/visibility/${id}/${isVisible}`);
		if (response) {
			console.log(response.data);
			return "updated";
		}
	} catch (error) {
		console.error(error);
		return "error";
	}
}
export async function GetAllVisibleCars() {
	try {
		const response = await api.get(`/car/visible`);
		if (response) {
			return response.data;
		}
	} catch (error) {
		return error;
	}
}
export async function GetCarsOfSerie(SerieId: number) {
	console.log(SerieId);
	try {
		const response = await api.get(`/car/serie/${SerieId}`);
		if (response) {
			console.log(response.data);
			return response.data;
		}
	} catch (error) {
		console.error(error);
		return error;
	}
}
