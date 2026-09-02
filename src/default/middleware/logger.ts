import type { ServerResponse } from "node:http";
import type { ArgumentedIncomingMessageInterface } from "../../interfaces/custom-request.js";
import { createLog } from "../../utils/logger.js";
import { timeTakedToResolve } from "../../helpers/date.js";

export const basicLogger = (
	req: ArgumentedIncomingMessageInterface,
	res: ServerResponse,
	next: (error?: Error) => void,
) => {
	const start: Date = new Date();
	req.on("end", () => {
		const statusCode: number | undefined = res.statusCode;
		const method: string | undefined = req.method;
		const url: string | undefined = req.url;
		const finalDate: Date = new Date();

		const timeTaked: number = timeTakedToResolve(start, finalDate);

		if (statusCode && method && url) {
			createLog(statusCode, method, url, timeTaked);
			return;
		}

		throw new Error("Error in the logger");
	});
	next();
};
