import aj from '../lib/arcjet.js';
import { isSpoofedBot } from "@arcjet/inspect";



export const arcjetProtection = async (req, resizeBy, next) => {
    try {
        const decision = await aj.protect(req);

        if(decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return resizeBy.status(429).json({ message: "Too many requests — the rate limit has been exceeded. Please try again later." });
            }

            if(decision.reason.isBot()) {
                return resizeBy.status(403).json({ message: "Bot access denied." });
            }
        }

        if (decision.results.some(isSpoofedBot)) {
            return resizeBy.status(403).json({ 
                error: "Spoofed bot detected",
                message: "Malicious bot activity detected. Request denied." });
        }

        next();

    } catch (error) {
        console.error("Arcjet protection error:", error);
        next();  // Arcjet failing will not block your site — it will just skip protection.
    }
}