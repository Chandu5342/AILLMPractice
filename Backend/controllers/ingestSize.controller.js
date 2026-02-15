import { ingestSizeService } from "../services/ingestSize.service.js";

export async function ingestSizeController(req, res, next) {
    try {
        const { text, preprocessingOptions,debug } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Text is required" });
        }

        const result = await ingestSizeService(text, preprocessingOptions,debug );

        res.status(200).json({
            message: "Size-based ingestion successful",
            ...result
        });

    } catch (error) {
        next(error);
    }
}
