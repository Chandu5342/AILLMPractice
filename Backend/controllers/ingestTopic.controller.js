import { ingestTopicService } from "../services/ingestTopic.service.js";

export async function ingestTopicController(req, res, next) {
    try {
        const { text, preprocessingOptions,debug } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Text is required" });
        }

        const result = await ingestTopicService(text, preprocessingOptions,debug);

        res.status(200).json({
            message: "Topic-based ingestion successful",
            ...result
        });

    } catch (error) {
        next(error);
    }
}
