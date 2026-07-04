module.exports = function (req, res) {

    try {

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "*");

        if (req.method === "OPTIONS") {
            return res.status(200).end();
        }

        const token = req.query.url;

        if (!token) {
            return res.status(400).json({ ok: false, error: "missing token" });
        }

        let decoded;

        try {
            const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
            decoded = Buffer.from(base64, "base64").toString("utf8");
        } catch (e) {
            return res.status(400).json({ ok: false, error: "decode fail" });
        }

        let url = "";
        let image = "";

        // ===== FORCE RAW CHECK =====
        if (decoded && decoded[0] === "{") {

            try {
                const obj = JSON.parse(decoded);
                url = obj.u || obj.url || "";
                image = obj.img || obj.image || "";
            } catch (e) {
                return res.status(400).json({ ok: false, error: "json fail" });
            }

        } else {

            // 🔥 IMPORTANT: ALWAYS RUN THIS
            const idx = decoded.indexOf("&img=");

            if (idx !== -1) {
                url = decoded.substring(0, idx);
                image = decoded.substring(idx + 5);
            } else {
                url = decoded;
                image = "";
            }
        }

        // CLEAN
        url = (url || "").trim();
        image = (image || "").trim();

        return res.status(200).json({
            ok: true,
            url,
            image
        });

    } catch (err) {

        return res.status(500).json({
            ok: false,
            error: err.message
        });

    }
};
