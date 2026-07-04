export default function handler(req, res) {

    try {

        const token = req.query.url;

        if (!token) {
            return res.status(400).send("missing token");
        }

        let decoded = "";

        try {
            const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
            decoded = Buffer.from(base64, "base64").toString("utf8");
        } catch (e) {
            return res.status(400).send("decode error");
        }

        let url = decoded;

        try {
            if (decoded && decoded[0] === "{") {
                const obj = JSON.parse(decoded);
                url = obj.u || obj.url || "";
            }
        } catch (e) {
            return res.status(400).send("json error");
        }

        return res.status(200).json({
            ok: true,
            url
        });

    } catch (e) {
        return res.status(500).send("server crash: " + e.message);
    }
}
