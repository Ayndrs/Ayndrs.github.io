function toggleStyleSheet(){
    let m = document.getElementById("mainStyleSheet");
    let mhref = m.getAttribute("href");
    let mName = "styles.css";

    if (mhref === "styles.css"){
        mName = "styles_two.css";
    }

    

    m.setAttribute("href", mName);
    localStorage.setItem("cur", mName);
}


window.onload = function(){
    let a = document.getElementById("mainStyleSheet").href;
    if (a == NULL){
        document.getElementById("mainStyleSheet").href = localStorage.getItem("cur"); 
    }
    document.getElementById("mainStyleSheet").href = localStorage.getItem("cur");
}


