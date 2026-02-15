import { ingestHybridService } from "../services/ingestHybrid.service.js";

export async function ingestHybridController(req, res, next) {
    try {
        const { text, preprocessingOptions,debug} = req.body;

        if (!text) {
            return res.status(400).json({ error: "Text is required" });
        }

        const result = await ingestHybridService(text, preprocessingOptions,debug);

        res.status(200).json({
            message: "Hybrid-based ingestion successful",
            ...result
        });

    } catch (error) {
        next(error);
    }
}
