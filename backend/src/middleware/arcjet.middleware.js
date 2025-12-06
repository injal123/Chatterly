import aj from '../lib/arcjet.js';
import { isSpoofedBot } from "@arcjet/inspect";



export const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await aj.protect(req);

        if(decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ message: "Too many requests — the rate limit has been exceeded. Please try again later." });
            }

            else if(decision.reason.isBot()) {
                return res.status(403).json({ message: "Bot access denied." });
            }

            else {
                return res.status(403).json({ message: "Access denied by security policy.", reason: decision.reason.toString() });
            }

        }

        if (decision.results.some(isSpoofedBot)) {
            return res.status(403).json({ 
                error: "Spoofed bot detected",
                message: "Malicious bot activity detected. Request denied." });
        }

        next();

    } catch (error) {
        console.error("Arcjet protection error:", error);
        next();  // Arcjet failing will not block your site — it will just skip protection.
    }
}