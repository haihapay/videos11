module.exports = function (req, res) {

    try {

        // ===== CORS =====
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

        // ===== BASE64 DECODE =====
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

            // =========================
            // CASE 1: JSON TOKEN
            // =========================
            if (decoded && decoded.trim().startsWith("{")) {

                const obj = JSON.parse(decoded);

                videoUrl = obj.u || obj.url || "";
                image = obj.img || obj.image || "";

            }

            // =========================
            // CASE 2: RAW URL + &img=
            // =========================
            else {

                const imgIndex = decoded.indexOf("&img=");

                if (imgIndex !== -1) {

                    videoUrl = decoded.substring(0, imgIndex);
                    image = decoded.substring(imgIndex + 5);

                } else {

                    videoUrl = decoded;
                    image = "";

                }
            }

        } catch (e) {
            return res.status(400).json({
                ok: false,
                error: "Parse error"
            });
        }

        // ===== VALIDATION =====
        if (!videoUrl) {
            return res.status(400).json({
                ok: false,
                error: "Empty video url"
            });
        }

        // ===== CLEANUP =====
        videoUrl = videoUrl.trim();
        image = image.trim();

        return res.status(200).json({
            ok: true,
            url: videoUrl,
            image: image
        });

    } catch (err) {

        return res.status(500).json({
            ok: false,
            error: err.message || "Server crash"
        });

    }
};
