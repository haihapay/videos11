module.exports = function (req, res) {

    try {

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");

        if (req.method === "OPTIONS") {
            return res.status(200).end();
        }

        const videoUrl = (req.query.url || "").trim();
        const image = (req.query.img || "").trim();

        if (!videoUrl) {
            return res.status(400).json({
                ok: false,
                error: "Missing video url"
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
            error: err.message
        });

    }
};
