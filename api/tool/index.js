module.exports = (req, res) => {
    return res.json({
        debug: "THIS FILE IS RUNNING",
        url: req.query.url
    });
};
