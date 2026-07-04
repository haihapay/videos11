module.exports = function (req, res) {

    console.log("HIT TOOL API");

    const token = req.query.url || "";

    let decoded = "";

    try {
        const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
        decoded = Buffer.from(base64, "base64").toString("utf8");
    } catch (e) {
        decoded = token;
    }

    let url = decoded;
    let image = "";

    console.log("DECODED:", decoded);

    const idx = decoded.indexOf("&img=");

    if (idx !== -1) {
        url = decoded.substring(0, idx);
        image = decoded.substring(idx + 5);
    }

    console.log("FINAL URL:", url);
    console.log("FINAL IMG:", image);

    return res.json({
        ok: true,
        url,
        image
    });
};
