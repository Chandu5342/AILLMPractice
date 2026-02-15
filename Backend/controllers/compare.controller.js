import { compareService } from "../services/compare.service.js";

export async function compareController(req, res, next) {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ error: "Query is required" });
        }

        const result = await compareService(query);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
}
