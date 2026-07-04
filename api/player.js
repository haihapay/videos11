(function () {

    const params = new URLSearchParams(location.search);
    const token = params.get("url");

    const video = document.querySelector("video");

    if (!video) {
        document.body.innerHTML = "Video element not found";
        return;
    }

    if (!token) {
        document.body.innerHTML = "Missing token";
        return;
    }

    function decode(token) {
        try {
            const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
            const json = atob(base64);
            return JSON.parse(json);
        } catch (e) {
            return null;
        }
    }

    const data = decode(token);

    if (!data) {
        document.body.innerHTML = "Decode error";
        return;
    }

    const url = data.u || data.url;
    const image = data.img || data.image || "";

    if (!url) {
        document.body.innerHTML = "Missing video url";
        return;
    }

    console.log("VIDEO:", url);
    console.log("IMAGE:", image);

    // ===== SET VIDEO =====
    video.src = url;

    // ===== SET POSTER =====
    if (image) {
        video.poster = image;
    }

    // ===== ERROR HANDLING =====
    video.onerror = () => {
        document.body.innerHTML = `
            <h3>Unable to load video</h3>
            <p>Host may block direct playback or not allow embedding.</p>
            <p style="word-break:break-all">${url}</p>
        `;
    };

})();
