/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as adminApi from "./Admin";
import * as protectedApi from "./ProtectedRoute";
// ---------- Auth ----------
export async function loginWrapper(username: string, password: string) {
	return await adminApi.login(username, password);
}
export async function logoutWrapper() {
	return await adminApi.logout();
}

// ---------- Cars ----------
export async function getAllCarsWrapper() {
	return await adminApi.GetAllCars();
}
export async function updateCarWrapper(id: string, data: any) {
	return await adminApi.UpdateCarById(id, data);
}
export async function deleteCarWrapper(id: string) {
	return await adminApi.DeleteCarById(id);
}
export async function createCarWrapper(car: any) {
	return await adminApi.CreateCarDB(car);
}
export async function uploadPrimaryImageWrapper(id: string, file: File) {
	return await adminApi.UploadPrimaryImage(id, file);
}
export async function uploadImagesWrapper(id: string, files: File[]) {
	return await adminApi.UploadImages(id, files);
}
export async function fetchCarImagesWrapper(id: string) {
	return await adminApi.FetchCarImages(id);
}
export async function deleteImageWrapper(id: string) {
	return await adminApi.DeleteImageById(id);
}

// ---------- Brands & Series ----------
export async function fetchAllBrandsWrapper() {
	return await adminApi.FetchAllBrands();
}
export async function fetchAllSeriesWrapper() {
	return await adminApi.FetchAllSeries();
}
export async function createBrandWrapper(name: string) {
	return await adminApi.CreateBrand(name);
}
export async function createSerieWrapper(name: string, brandId: number) {
	return await adminApi.Createserie(name, brandId);
}
export async function fetchSeriesByBrandWrapper(brandId: number) {
	return await adminApi.FetchSeriesByBrand(brandId);
}
export async function deleteBrandWrapper(id: string) {
	return await adminApi.DeleteBrandById(id);
}
export async function deleteSerieWrapper(id: string) {
	return await adminApi.DeleteSerieById(id);
}

// ---------- Orders ----------
export async function createOrderWrapper(data: any) {
	return await adminApi.CreateNewOrder(data);
}
export async function getAllOrdersWrapper() {
	return await adminApi.GetAllOrders();
}

// ---------- Misc ----------
export async function setCarIdWrapper(id: string, price: number) {
	return await adminApi.SetCarIdCookie(id, price);
}

export async function ProtectedRouteWrapper() {
	return await protectedApi.default();
}
export async function ProtectedOrderWrapper() {
	return await protectedApi.OrderRoute();
}
