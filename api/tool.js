module.exports = async (req, res) => {

    try {

        res.setHeader("Access-Control-Allow-Origin", "*");

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

        try {
            if (decoded && decoded[0] === "{") {
                const obj = JSON.parse(decoded);
                url = obj.u || obj.url || "";
            } else {
                url = decoded;
            }
        } catch (e) {
            return res.status(400).json({ ok: false, error: "json fail" });
        }

        return res.status(200).json({
            ok: true,
            url
        });

    } catch (err) {
        return res.status(500).json({
            ok: false,
            error: err.message || "crash"
        });
    }
};
