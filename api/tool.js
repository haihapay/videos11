module.exports = function (req, res) {

    try {

        const token = req.query.url || "";

        let decoded = "";

        try {
            const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
            decoded = Buffer.from(base64, "base64").toString("utf8");
        } catch (e) {
            decoded = token;
        }

        let data = {};
        let url = "";
        let image = "";

        // =========================
        // CASE 1: decoded is JSON
        // =========================
        if (decoded.trim().startsWith("{")) {

            try {
                data = JSON.parse(decoded);

                url = data.u || data.url || "";
                image = data.img || data.image || "";

                // 🔥 FIX NESTED STRING JSON (quan trọng)
                if (typeof url === "string" && url.startsWith("{")) {
                    const inner = JSON.parse(url);
                    url = inner.u || inner.url || url;
                    image = inner.image || image;
                }

            } catch (e) {
                return res.status(400).json({
                    ok: false,
                    error: "JSON parse failed"
                });
            }

        } else {

            // =========================
            // CASE 2: RAW URL
            // =========================

            const idx = decoded.indexOf("&img=");

            if (idx !== -1) {
                url = decoded.substring(0, idx);
                image = decoded.substring(idx + 5);
            } else {
                url = decoded;
                image = "";
            }
        }

        return res.status(200).json({
            ok: true,
            url: url,
            image: image
        });

    } catch (err) {

        return res.status(500).json({
            ok: false,
            error: err.message
        });

    }
};
