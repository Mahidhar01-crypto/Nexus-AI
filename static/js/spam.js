// ======================================
// NEXUS AI SPAM DETECTOR
// ======================================


const spamForm = document.getElementById("spamForm");

const messageInput = document.getElementById("message");

const fileInput = document.getElementById("file");

const detectButton = document.getElementById("detectBtn");

const result = document.getElementById("result");

const confidence = document.getElementById("confidence");

const preview = document.getElementById("preview");

console.log(result);

console.log(confidence);

console.log(preview);

console.log(fileInput);

console.log(messageInput);
// ======================================
// Detect Spam
// ======================================

spamForm.addEventListener("submit", async function(e){

    e.preventDefault();

    detectButton.disabled = true;

    detectButton.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Detecting...';

    if(result){

    result.innerHTML = "Analyzing...";

     }


    if(confidence){

    confidence.innerHTML="";
     }

    if(preview){

    preview.innerHTML="";
    }

    const formData = new FormData();

    if(messageInput.value.trim() !== ""){

        formData.append("message", messageInput.value);

    }

    if(fileInput.files.length > 0){

        formData.append("file", fileInput.files[0]);

    }

    try{

        const response = await fetch("/predict_spam",{

            method:"POST",

            body:formData

        });

        const data = await response.json();

        if(data.error){

            result.innerHTML = data.error;

            confidence.innerHTML = "";

            preview.innerHTML = "";

        }

        else{

            showResult(data);

        }

    }

    catch(error){

        result.innerHTML =

        "Something went wrong.";

    }

    detectButton.disabled = false;

    detectButton.innerHTML =
'<i class="fa-solid fa-magnifying-glass"></i> Detect Spam';

});
// ======================================
// Show Result
// ======================================

function showResult(data){

    // Prediction

    if(data.prediction==="Spam"){

        result.innerHTML="🚨 SPAM MESSAGE";

        result.style.color="#ff4d4d";

    }

    else{

        result.innerHTML="✅ NOT SPAM";

        result.style.color="#2ecc71";

    }

    // Confidence

    confidence.innerHTML=data.confidence+" %";

    // Progress Bar

    document.getElementById("confidenceFill").style.width =
        data.confidence + "%";

    // Preview

    preview.textContent=data.text;

    // Risk Level

    let risk=document.getElementById("riskLevel");

    if(data.prediction==="Spam"){

        if(data.confidence>=90){

            risk.innerHTML="High";

            risk.style.color="#ff3b3b";

        }

        else if(data.confidence>=70){

            risk.innerHTML="Medium";

            risk.style.color="#ff9800";

        }

        else{

            risk.innerHTML="Low";

            risk.style.color="#ffd54f";

        }

    }

    else{

        risk.innerHTML="Safe";

        risk.style.color="#2ecc71";

    }

}

// ======================================
// File Name
// ======================================

fileInput.addEventListener("change",()=>{

    if(fileInput.files.length>0){

        document.querySelector(".upload").innerHTML=

        `<i class="fa-solid fa-file"></i>

        ${fileInput.files[0].name}`;

    }

});

// ======================================
// Auto Clear
// ======================================

messageInput.addEventListener("focus",()=>{

    result.innerHTML=

    "Waiting for analysis...";

    confidence.innerHTML="";

    preview.innerHTML="";

});

// ======================================
// Drag & Drop
// ======================================

const upload=document.querySelector(".upload");

upload.addEventListener("dragover",(e)=>{

    e.preventDefault();

    upload.style.borderColor="#00D4FF";

});

upload.addEventListener("dragleave",()=>{

    upload.style.borderColor="#444";

});

upload.addEventListener("drop",(e)=>{

    e.preventDefault();

    upload.style.borderColor="#444";

    fileInput.files=e.dataTransfer.files;

    upload.innerHTML=

    `<i class="fa-solid fa-file"></i>

    ${fileInput.files[0].name}`;

});