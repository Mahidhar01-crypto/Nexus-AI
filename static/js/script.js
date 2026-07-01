// =========================================
// NEXUS AI
// Main JavaScript
// =========================================


// ===============================
// Loader
// ===============================

window.addEventListener("load",()=>{

    const loader=document.getElementById("loader");

    if(loader){

        setTimeout(()=>{

            loader.style.opacity="0";

            loader.style.visibility="hidden";

        },1200);

    }

});


// ===============================
// Navbar Scroll
// ===============================

const navbar=document.querySelector(".navbar");

window.addEventListener("scroll",()=>{

    if(!navbar) return;

    if(window.scrollY>50){

        navbar.style.background="rgba(5,8,22,.92)";

        navbar.style.boxShadow="0 10px 30px rgba(0,0,0,.35)";

    }

    else{

        navbar.style.background="rgba(5,8,22,.65)";

        navbar.style.boxShadow="none";

    }

});


// ===============================
// Mobile Menu
// ===============================

const menu=document.querySelector(".menu-toggle");

const nav=document.querySelector(".nav-links");

if(menu && nav){

menu.addEventListener("click",()=>{

    nav.classList.toggle("active");

});

}


// ===============================
// Smooth Scroll
// ===============================

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

anchor.addEventListener("click",function(e){

const target=document.querySelector(this.getAttribute("href"));

if(target){

e.preventDefault();

target.scrollIntoView({

behavior:"smooth"

});

}

});

});


// ===============================
// Statistics Counter
// ===============================

const counters=document.querySelectorAll(".stat-box h2");

let started=false;

window.addEventListener("scroll",()=>{

const stats=document.querySelector(".stats");

if(!stats) return;

if(window.scrollY>stats.offsetTop-500 && !started){

started=true;

animateCounters();

}

});

function animateCounters(){

counters.forEach(counter=>{

const text=counter.innerText;

const number=parseFloat(text);

const suffix=text.replace(/[0-9.]/g,'');

let current=0;

const increment=number/60;

const timer=setInterval(()=>{

current+=increment;

if(current>=number){

counter.innerText=text;

clearInterval(timer);

}

else{

counter.innerText=Math.floor(current)+suffix;

}

},25);

});

}


// ===============================
// Fade Animation
// ===============================

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

},{threshold:0.2});

document.querySelectorAll(

".service-card,.feature-card,.timeline-item,.testimonial-card,.stat-box"

).forEach(el=>{

observer.observe(el);

});


// ===============================
// Contact Form
// ===============================

const form=document.querySelector(".contact-form");

if(form){

form.addEventListener("submit",(e)=>{

e.preventDefault();

alert("Thank you! Your message has been received.");

form.reset();

});

}


// ===============================
// Hero Buttons Hover
// ===============================

document.querySelectorAll("button").forEach(button=>{

button.addEventListener("mouseenter",()=>{

button.style.transform="translateY(-3px)";

});

button.addEventListener("mouseleave",()=>{

button.style.transform="translateY(0px)";

});

});


// ===============================
// Back To Top
// ===============================

const topButton=document.createElement("button");

topButton.innerHTML='<i class="fa-solid fa-arrow-up"></i>';

topButton.id="topBtn";

document.body.appendChild(topButton);

topButton.style.position="fixed";

topButton.style.bottom="30px";

topButton.style.right="30px";

topButton.style.width="55px";

topButton.style.height="55px";

topButton.style.borderRadius="50%";

topButton.style.border="none";

topButton.style.cursor="pointer";

topButton.style.display="none";

topButton.style.zIndex="999";

topButton.style.background="linear-gradient(135deg,#6C63FF,#00D4FF)";

topButton.style.color="white";

window.addEventListener("scroll",()=>{

if(window.scrollY>400){

topButton.style.display="block";

}

else{

topButton.style.display="none";

}

});

topButton.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};