
export default async function handler(req, res) {

    res.removeHeader("X-Frame-Options");

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    try {

        const token = req.query.url || "";

        if (!token) {
            return res.status(400).json({
                ok: false,
                error: "Missing token"
            });
        }

        // Hỗ trợ Base64 URL-safe
        const base64 = token
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const decoded = Buffer
            .from(base64, "base64")
            .toString("utf8");

        let videoUrl = decoded;

        // Hỗ trợ token JSON
        if (decoded.trim().startsWith("{")) {

            const obj = JSON.parse(decoded);

            videoUrl = obj.u || obj.url || "";

        }

        if (!videoUrl) {

            return res.status(400).json({
                ok: false,
                error: "Invalid video url"
            });

        }

        // Tách poster
        let image = "";

        const pos = videoUrl.indexOf("&img=");

        if (pos !== -1) {

            image = videoUrl.substring(pos + 5);

            videoUrl = videoUrl.substring(0, pos);

        }

        return res.status(200).json({

            ok: true,

            url: videoUrl,

            image: image

        });

    } catch (e) {

        return res.status(500).json({

            ok: false,

            error: e.message

        });

    }

}
