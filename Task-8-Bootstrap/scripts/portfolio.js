document.addEventListener("DOMContentLoaded", function() {
    let backgroundColors = ["#F4BB44", "#e6d7ff", "#ADD8E6", "#FFB6C1", "#86e9e4", "#CF9FFF"];
    let colors = ["#F28500", "#A020F0", "#0080FF", "#FF00FF", "#50C878", "#7F00FF"];
    let cards = document.querySelectorAll('.card')
    let i = 0;
    let k = 0;

    cards.forEach(function(card, index) {
        card.style.backgroundColor = backgroundColors[i++];
        card.querySelector('.card-footer .color_text').style.color = colors[k++];
    }) 
})

let body_container = document.querySelector('.body_container');
let toggle = document.querySelector(".navbar-toggle");
let navContent = document.getElementById('navNavContent');

const callback = (mutationlist, observer) => {
    console.log(mutationlist)
    for(let mutation of mutationlist) {
        if(mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if(navContent.classList.contains('show')) {
                body_container.style.transform = "translateX(6.25rem)";
                body_container.style.width = "90%";
                body_container.style.marginLeft = "10px";
            }
            else {
                body_container.style.transform = "translateX(0rem)";
                body_container.style.width = "98%";
            }
            break;
        }
    }
}

const observer = new MutationObserver(callback);
observer.observe(navContent, {
    attributes: true, 
    attributeFilter: ['class'],
    childList: false, 
    characterData: false
})