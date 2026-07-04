(function () {

    const params = new URLSearchParams(location.search);

    const url = params.get("url");
    const img = params.get("img");

    const video = document.querySelector("video");

    if (!video) return;

    if (!url) {
        document.body.innerHTML = "Missing video URL";
        return;
    }

    video.src = url;

    if (img) {
        video.poster = img;
    }

    video.onerror = () => {
        document.body.innerHTML = `
            <h3>Unable to load video</h3>
            <p>${url}</p>
        `;
    };

})();
