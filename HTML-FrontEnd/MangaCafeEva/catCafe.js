document.addEventListener("DOMContentLoaded", function () {

    const images = [
        "url('download.jpeg')",
        "url('images.jpeg')"
    ];

    const wordColor = [
        "purple",
        "#ed2323"
    ];

    const BordeColor = [
        "greenyellow",
        "#fbe6e5"
    ];

    const selectDia = document.getElementById("dia");

    selectDia.addEventListener("change", function () {
        cambiarMenu(this.value);
    });

    let index = 0;

    const button = document.getElementById("changeBtn");
    const header = document.querySelector(".Header"); 
    const body = document.querySelector(".Content")

    button.addEventListener("click", function () {
        document.body.style.backgroundImage = images[index];
        document.body.style.color = wordColor[index];
        header.style.color = wordColor[index];
        body.style.color = wordColor[index];
        body.style.borderColor = BordeColor[index];

        index = (index + 1) % images.length;
    });

});

function traducir() {
    document.getElementById("par1").innerHTML = `
        <p>Bienvenido al EVA cafe</p>
        <p>MENU</p>
        <p>Americano de Shinji: 45$</p>
        <p>Macchiato de Asuka: 55$</p>
        <p>Cerveza de Misato: 90$</p>
        <p>Expresso del Angel: 20$</p>
    `;
}

function cambiarMenu(dia) {
    const menu = document.getElementById("par1");

    if (dia == "lunes") {
        menu.innerHTML = `
            <p>Welcome to the EVA cafe</p>
        <p>MENU (Lunes - Descuento)</p>
        <div class="item">
            Shinji's Americano: 35$
            <img src="shinji.jpg" class="img-hover">
        </div>

        <div class="item">
            Asuka's Macchiato: 45$
            <img src="asuka.jpg" class="img-hover">
        </div>

        <div class="item">
            Misato's beer: 80$
            <img src="misato.jpg" class="img-hover">
        </div>

        <div class="item">
            Angels Expresso: 15$
            <img src="expreso.jpg" class="img-hover">
        </div>
        `;
    } 
    else if (dia == "martes") {
        menu.innerHTML = `
        <p>Welcome to the EVA cafe</p>
        <p>MENU (Martes - 2x1)</p>
        <div class="item">
            2x Shinji's Americano: 45$
            <img src="shinji.jpg" class="img-hover">
        </div>

        <div class="item">
            2x Asuka's Macchiato: 55$
            <img src="asuka.jpg" class="img-hover">
        </div>

        <div class="item">
            2x Misato's beer: 90$
            <img src="misato.jpg" class="img-hover">
        </div>

        <div class="item">
            2x Angels Expresso: 20$
            <img src="expreso.jpg" class="img-hover">
        </div>
        `;
    } 
    else if (dia == "miercoles") {
        menu.innerHTML = `
        <p>Welcome to the EVA cafe</p>
        <p>MENU (Miercoles - Combo)</p>
        <div class="item">
            Shinji's Americano +
            <img src="shinji.jpg" class="img-hover">
        </div>

        <div class="item">
            Asuka's Macchiato: 80$
            <img src="asuka.jpg" class="img-hover">
        </div>

        <div class="item">
            Misato's beer +
            <img src="misato.jpg" class="img-hover">
        </div>

        <div class="item">
            Angels Expresso: 90$
            <img src="expreso.jpg" class="img-hover">
        </div>
        `;
    } 
    else if (dia == "juebebes") {
        menu.innerHTML = `
        <p>Welcome to the EVA cafe</p>
        <p>MENU (Juebebes - DE ALCOHOL)</p>
        <div class="item">
            Misato's beer: 60$
            <img src="misato.jpg" class="img-hover">
        </div>

        <div class="item">
            10X Misato's beer: 500$
            <img src="misato.jpg" class="img-hover">
        </div>
        `;
    } 
    else if (dia == "viernes") {
        menu.innerHTML = `
        <p>Welcome to the EVA cafe</p>
        <p>MENU (Viernes - Premium)</p>
        <div class="item">
            Shinji's Americano: 50$
            <img src="shinji.jpg" class="img-hover">
        </div>

        <div class="item">
            Asuka's Macchiato: 65$
            <img src="asuka.jpg" class="img-hover">
        </div>

        <div class="item">
            Misato's beer: 100$
            <img src="misato.jpg" class="img-hover">
        </div>

        <div class="item">
            Angels Expresso: 30$
            <img src="expreso.jpg" class="img-hover">
        </div>
        `;
    } 
    else {
        menu.innerHTML = `
            <p>Welcome to the EVA cafe</p>
        <p>MENU (Fin de semana)</p>
        <div class="item">
            Shinji's Americano: 45$
            <img src="shinji.jpg" class="img-hover">
        </div>

        <div class="item">
            Asuka's Macchiato: 55$
            <img src="asuka.jpg" class="img-hover">
        </div>

        <div class="item">
            Misato's beer: 90$
            <img src="misato.jpg" class="img-hover">
        </div>

        <div class="item">
            Angels Expresso: 20$
            <img src="expreso.jpg" class="img-hover">
        </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", function () {

    const music = document.getElementById("Music");

    music.volume = 0.05;   
    });