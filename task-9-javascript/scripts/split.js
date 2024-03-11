function handlesubmit(e) {
    e.preventDefault()
    let data = new FormData(e.target)
    let number = parseInt(data.get("number"));
    let split = parseInt(data.get("count"));
    let results = document.querySelector(".results_container");
    results.innerHTML = "";
    if(number > split && number >=0 && split >= 0) {
        let a = [];
        let x = parseInt(number/split);
        let y = number % split;
        while(a.length != split) {
            a.push(x);
        }
        let n = 0
        while(y != 0) {
            a[n] = a[n] + 1;
            n++;
            y--;
        }
        colors = ["#318CE7", "#FF69B4", "#FF4433", "#FFFF00", "#50C878", "#DDA0DD"]
        console.log(a);
        for(let i=0; i<a.length; i++) {
            console.log(colors[a[i]%colors.length], `${a[i]}0px`)
            results.innerHTML += `
                <div style="width: ${a[i]}0%; height: 70px; border: 2px solid black; background-color: ${colors[a[i]%colors.length]}; display: flex; align-items: center; justify-content: center;">${a[i]}</div>
            `
        }
    }
    else {
        results.innerHTML = (`
            <div style="width: 80%; height: 70px; border: 2px solid black; background-color: red; display: flex; align-items: center; justify-content: center; color: white">Invalid Input!! Number must be greater than split count!!</div>
        `)
        console.log("Invalid Input")
    }
    console.log(number, split)
    
}

document.addEventListener("DOMContentLoaded", (e) => {
    document.getElementsByClassName("form_data")[0].addEventListener("submit", handlesubmit)
})
