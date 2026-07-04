// ======================================================
// Video Player Generator v3
// ======================================================

const mp4 = document.getElementById("mp4");
const img = document.getElementById("img");

const output = document.getElementById("output");
const previewFrame = document.getElementById("previewFrame");

const btnGen = document.getElementById("btnGen");
const btnCopy = document.getElementById("btnCopy");
const btnReset = document.getElementById("btnReset");

//======================================================
// UTF8 Base64URL Encode
//======================================================
function encodeToken(data){

    const json = JSON.stringify(data);

    const bytes = new TextEncoder().encode(json);

    let binary = "";

    bytes.forEach(b => binary += String.fromCharCode(b));

    return btoa(binary)
        .replace(/\+/g,"-")
        .replace(/\//g,"_")
        .replace(/=+$/,"");

}

//======================================================
// Build Payload
//======================================================
function buildPayload(){

    return{

        videoUrl:mp4.value.trim(),

        imageUrl:img.value.trim(),

        time:Date.now()

    };

}

//======================================================
// Generate
//======================================================
btnGen.addEventListener("click",()=>{

    const payload=buildPayload();

    if(payload.videoUrl===""){

        alert("Please enter MP4 URL.");

        mp4.focus();

        return;

    }

    const token=encodeToken(payload);

    //==========================
    // Player URL (VERCEL)
    //==========================

    const player=

    "https://videos-eight-gray.vercel.app/api/player?url="+token;

    output.value=
`<div class="player-wrapper">
<iframe
src="${player}"
width="100%"
height="400"
frameborder="0"
allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
allowfullscreen>
</iframe>
</div>`;

    if(previewFrame){

        previewFrame.src=player;

    }

});

//======================================================
// Copy
//======================================================
btnCopy.addEventListener("click",async()=>{

    if(output.value==="") return;

    try{

        await navigator.clipboard.writeText(output.value);

        const old=btnCopy.textContent;

        btnCopy.textContent="Copied ✓";

        setTimeout(()=>{

            btnCopy.textContent=old;

        },1500);

    }catch{

        alert("Copy failed.");

    }

});

//======================================================
// Reset
//======================================================
btnReset.addEventListener("click",()=>{

    mp4.value="";

    img.value="";

    output.value="";

    if(previewFrame){

        previewFrame.src="about:blank";

    }

    mp4.focus();

});

//======================================================
// Enter Generate
//======================================================
[mp4,img].forEach(el=>{

    el.addEventListener("keydown",e=>{

        if(e.key==="Enter"){

            btnGen.click();

        }

    });

});
