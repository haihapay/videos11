export default async function handler(req, res) {

    try {

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");

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

        try {
            if (decoded.trim().startsWith("{")) {
                const obj = JSON.parse(decoded);
                videoUrl = obj.u || obj.url || "";
            } else {
                videoUrl = decoded;
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

        let image = "";

        const pos = videoUrl.indexOf("&img=");

        if (pos !== -1) {
            image = videoUrl.substring(pos + 5);
            videoUrl = videoUrl.substring(0, pos);
        }

        return res.status(200).json({
            ok: true,
            url: videoUrl,
            image
        });

    } catch (err) {

        return res.status(500).json({
            ok: false,
            error: err.message || "Server crashed"
        });
    }
}
