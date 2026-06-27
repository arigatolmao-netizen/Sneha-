/* =====================================
   FOR MY MAHARANI ❤️
   script.js (Part 3A)
===================================== */

// Get all pages
const pages = document.querySelectorAll(".page");

// Current page
let currentPage = 1;

// Change page
function nextPage(page){

    pages.forEach((p)=>{
        p.classList.remove("active");
    });

    document
        .getElementById("page"+page)
        .classList.add("active");

    currentPage = page;

}

// ----------------------------
// YES BUTTON
// ----------------------------

const yesButton = document.getElementById("yes");

if(yesButton){

yesButton.addEventListener("click",()=>{

    alert("❤️ Thank you, Maharani! ❤️");

    nextPage(7);

});

}

// ----------------------------
// RUNNING NO BUTTON
// ----------------------------

const noButton=document.getElementById("no");

if(noButton){

noButton.addEventListener("mouseover",()=>{

const maxX=220;
const maxY=180;

const randomX=Math.random()*maxX-maxX/2;
const randomY=Math.random()*maxY-maxY/2;

noButton.style.position="relative";

noButton.style.left=randomX+"px";

noButton.style.top=randomY+"px";

});

}

// ----------------------------
// ENTER KEY SUPPORT
// ----------------------------

document.addEventListener("keydown",(e)=>{

if(e.key==="Enter"){

if(currentPage<7){

nextPage(currentPage+1);

}

}

});

// ----------------------------
// SIMPLE PAGE FADE
// ----------------------------

pages.forEach(page=>{

page.style.transition=".6s";

});

// ----------------------------
// HEARTS WHEN CLICKING
// ----------------------------

document.addEventListener("click",(e)=>{

const heart=document.createElement("div");

heart.innerHTML="❤️";

heart.style.position="fixed";

heart.style.left=e.clientX+"px";

heart.style.top=e.clientY+"px";

heart.style.fontSize="22px";

heart.style.pointerEvents="none";

heart.style.animation="heartPop 1s linear forwards";

document.body.appendChild(heart);

setTimeout(()=>{

heart.remove();

},1000);

});

// ----------------------------
// HEART ANIMATION
// ----------------------------

const style=document.createElement("style");

style.innerHTML=`

@keyframes heartPop{

0%{

opacity:1;

transform:scale(.4);

}

100%{

opacity:0;

transform:

translateY(-100px)

scale(2);

}

}

`;

document.head.appendChild(style);