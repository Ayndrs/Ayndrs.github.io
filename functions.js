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
    document.getElementById("mainStyleSheet").href = localStorage.getItem("cur");
}


