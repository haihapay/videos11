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

        let decoded = "";

        try {
            const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
            decoded = Buffer.from(base64, "base64").toString("utf8");
        } catch (e) {
            return res.status(400).json({ ok: false, error: "decode fail" });
        }

        let url = "";
        let image = "";

        try {

            if (decoded && decoded[0] === "{") {

                const obj = JSON.parse(decoded);

                url = obj.u || obj.url || "";
                image = obj.img || obj.image || "";

            } else {

                const i = decoded.indexOf("&img=");

                if (i !== -1) {
                    image = decoded.substring(i + 5);
                    url = decoded.substring(0, i);
                } else {
                    url = decoded;
                }
            }

        } catch (e) {
            return res.status(400).json({ ok: false, error: "parse fail" });
        }

        if (!url) {
            return res.status(400).json({ ok: false, error: "empty url" });
        }

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
