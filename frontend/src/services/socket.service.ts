"use server";
import { io, Socket } from "socket.io-client";

class SocketService {
	private socket: Socket | null = null;
	private listeners: Map<string, (...args: any[]) => void> = new Map();
	private isConnecting = false;

	connect() {
		if (this.socket?.connected || this.isConnecting) return;

		this.isConnecting = true;

		const backendUrl =
			process.env.MAIN_API_URL || process.env.NEXT_PUBLIC_API_URL;
		console.log("🔌 Connecting to socket server:", backendUrl);

		this.socket = io(backendUrl, {
			transports: ["websocket", "polling"],
			timeout: 10000,
		});

		this.socket.on("connect", () => {
			console.log("✅ Connected to server with ID:", this.socket?.id);
			this.isConnecting = false;
		});

		this.socket.on("disconnect", (reason) => {
			console.log("❌ Disconnected from server:", reason);
			this.isConnecting = false;
		});

		this.socket.on("connect_error", (error) => {
			console.error("🔥 Connection error:", error.message);
			this.isConnecting = false;
		});

		this.socket.on("orderCreated", (data) => {
			console.log("📦 Received orderCreated event:", data);
		});

		this.socket.on("orderUpdated", (data) => {
			console.log("🔄 Received orderUpdated event:", data);
		});

		this.socket.on("orderDeleted", (data) => {
			console.log("🗑️ Received orderDeleted event:", data);
		});

		// Set up existing listeners
		this.listeners.forEach((callback, event) => {
			this.socket?.on(event, callback);
		});
	}

	disconnect() {
		if (this.socket) {
			console.log("🔌 Disconnecting socket");
			this.socket.disconnect();
			this.socket = null;
		}
	}

	on(event: string, callback: (...args: any[]) => void) {
		console.log(`👂 Registering listener for event: ${event}`);
		this.listeners.set(event, callback);
		if (this.socket) {
			this.socket.on(event, callback);
		}
	}

	off(event: string, handleEvent?: (data: any) => void) {
		console.log(`🙉 Removing listener for event: ${event}`);
		this.listeners.delete(event);
		if (this.socket) {
			this.socket.off(event);
		}
	}

	emit(event: string, data?: any) {
		console.log(`📤 Emitting event: ${event}`, data);
		if (this.socket) {
			this.socket.emit(event, data);
		}
	}

	isConnected(): boolean {
		return this.socket?.connected || false;
	}

	// Add this method for debugging
	getSocketId(): string | undefined {
		return this.socket?.id;
	}
}

export const socketService = new SocketService();
