/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { socketService } from "../services/socket.service";

export const useSocket = (event: string, callback: (data: any) => void) => {
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		console.log(`🎯 useSocket hook setup for event: ${event}`);

		const handleEvent = (data: any) => {
			console.log(`🎯 useSocket received event: ${event}`, data);
			callbackRef.current(data);
		};

		// Connect socket when hook is used
		socketService.connect();

		// Listen for the event
		socketService.on(event, handleEvent);

		return () => {
			console.log(`🎯 useSocket cleanup for event: ${event}`);
			socketService.off(event, handleEvent);
		};
	}, [event]);
};
