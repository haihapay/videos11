const mp4 = document.getElementById("mp4");
const img = document.getElementById("img");
const output = document.getElementById("output");

const btnGen = document.getElementById("btnGen");
const btnCopy = document.getElementById("btnCopy");

// =======================
// GENERATE CLEAN URL
// =======================
btnGen.onclick = () => {

    const video = mp4.value.trim();
    const poster = img.value.trim();

    if (!video) {
        alert("Missing video URL");
        return;
    }

    // 👉 SIMPLE QUERY PARAM (NO BASE64, NO JSON)
    const params = new URLSearchParams();

    params.set("url", video);

    if (poster) {
        params.set("img", poster);
    }

    const apiUrl = "/api/tool?" + params.toString();

    const iframe = `
<iframe 
    src="/player?${params.toString()}"
    width="100%" 
    height="500"
    frameborder="0"
    allowfullscreen>
</iframe>`.trim();

    output.value = iframe;
};

// =======================
// COPY
// =======================
btnCopy.onclick = () => {
    output.select();
    document.execCommand("copy");
    alert("Copied!");
};
