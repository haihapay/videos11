export default function handler(req, res) {
    try {

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "*");

        if (req.method === "OPTIONS") {
            return res.status(200).end();
        }

        const token = req.query.url;

        if (!token || typeof token !== "string") {
            return res.status(400).json({
                ok: false,
                error: "Missing token"
            });
        }

        // ===== Decode Base64 URL-safe =====
        let decoded = "";

        try {
            const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
            decoded = Buffer.from(base64, "base64").toString("utf8");
        } catch (e) {
            return res.status(400).json({
                ok: false,
                error: "Decode failed"
            });
        }

        let videoUrl = "";
        let image = "";

        try {

            // ===== CASE 1: JSON TOKEN =====
            if (decoded.trim().startsWith("{")) {

                const obj = JSON.parse(decoded);

                videoUrl = obj.u || obj.url || "";
                image = obj.img || obj.image || "";

            } else {

                // ===== CASE 2: RAW URL + &img =====
                const imgIndex = decoded.indexOf("&img=");

                if (imgIndex !== -1) {

                    image = decoded.substring(imgIndex + 5);
                    videoUrl = decoded.substring(0, imgIndex);

                } else {
                   let videoUrl = decoded;
let image = "";

// 🔥 MUST: tách img trước khi return
const imgIndex = videoUrl.indexOf("&img=");

if (imgIndex !== -1) {

    image = videoUrl.substring(imgIndex + 5);
    videoUrl = videoUrl.substring(0, imgIndex);

}
                }
            }

        } catch (e) {
            return res.status(400).json({
                ok: false,
                error: "Invalid JSON"
            });
        }

        if (!videoUrl) {
            return res.status(400).json({
                ok: false,
                error: "Empty video url"
            });
        }

        return res.status(200).json({
            ok: true,
            url: videoUrl,
            image: image
        });

    } catch (err) {
        return res.status(500).json({
            ok: false,
            error: err.message || "Server error"
        });
    }
}
