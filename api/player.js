
export default async function handler(req, res) {

    // ==========================================
    // CONFIG
    // ==========================================

    const ALLOW_ORIGINS = [
        "quahai.com",
        "www.quahai.com",
              "www.dogs.quahai.com",
              "www.animals.quahai.com",
              "newssolor.com",
              "cats.newssolor.com",
        "www.cats.newssolor.com",
        ".quahai.com"
    ];

    // ==========================================
    // CORS
    // ==========================================

    res.removeHeader("X-Frame-Options");

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // ==========================================
    // Check Referer
    // ==========================================

    try {

        const referer = req.headers.referer || "";

        if (referer) {

            const host = new URL(referer).hostname.toLowerCase();

            let allow = false;

            for (const item of ALLOW_ORIGINS) {

                if (item.startsWith(".")) {

                    if (
                        host === item.substring(1) ||
                        host.endsWith(item)
                    ) {
                        allow = true;
                        break;
                    }

                } else {

                    if (host === item) {
                        allow = true;
                        break;
                    }

                }

            }

            if (!allow) {

                return res.status(403).send("Forbidden");

            }

        }

    } catch (e) {}

    // ==========================================
    // Token
    // ==========================================

    const token = req.query.url || "";

    if (!token) {

        return res.status(400).send("Missing token");

    }

    // ==========================================
    // HTML
    // ==========================================

    res.setHeader("Content-Type", "text/html; charset=utf-8");

    return res.send(`<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width,initial-scale=1">

<title>Player</title>

<style>

*{

margin:0;
padding:0;
box-sizing:border-box;

}

html,
body{

width:100%;
height:100%;
overflow:hidden;
background:#000;

}

video{

width:100%;
height:100%;
display:block;
background:#000;
object-fit:contain;

}

#error{

position:absolute;
inset:0;
display:none;
justify-content:center;
align-items:center;
color:#fff;
font-family:Arial;
font-size:15px;

}

</style>

</head>

<body>

<div id="error"></div>

<video

id="video"

controls

playsinline

preload="none"

controlsList="nodownload noremoteplayback"

disablePictureInPicture

></video>

<script>

(async()=>{

const token="${token}";

const video=document.getElementById("video");

const error=document.getElementById("error");

try{

const r=await fetch(

"/api/video?url="+encodeURIComponent(token),

{

cache:"no-store"

}

);

const d=await r.json();

if(!d.ok){

throw new Error(d.error);

}

if(d.imageUrl){

video.poster=d.imageUrl;

}

video.src=d.videoUrl;

}catch(e){

console.error(e);

error.style.display="flex";

error.innerHTML="Unable to load video.";

}

})();

</script>

<script>

document.addEventListener("contextmenu",e=>{

e.preventDefault();

});

document.addEventListener("keydown",e=>{

const k=e.key.toLowerCase();

if(

e.key==="F12" ||

(e.ctrlKey&&e.shiftKey&&k==="i") ||

(e.ctrlKey&&k==="u")

){

e.preventDefault();

}

});

</script>

<script>

(function(){

function detect(){

const t=performance.now();

debugger;

return performance.now()-t>100;

}

function loop(){

try{

if(detect()){

console.clear();

}

}catch(e){}

setTimeout(loop,2000);

}

loop();

})();

</script>

</body>
</html>`);

}
