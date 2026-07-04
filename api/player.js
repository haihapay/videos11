function decode(token) {
    try {
        const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
        const json = atob(base64);
        return JSON.parse(json);
    } catch (e) {
        return null;
    }
}

const params = new URLSearchParams(location.search);
const token = params.get("url");

const video = document.querySelector("video");

if (!token) {
    document.body.innerHTML = "Missing token";
} else {

    const data = decode(token);

    if (!data) {
        document.body.innerHTML = "Decode error";
    } else {

        const url = data.u || data.url;

        if (!url) {
            document.body.innerHTML = "No video URL";
        } else {

            console.log("VIDEO URL:", url);

            video.src = url;

            video.onerror = () => {
                document.body.innerHTML = "Unable to load video (host blocked or invalid mp4)";
            };

        }
    }
}
