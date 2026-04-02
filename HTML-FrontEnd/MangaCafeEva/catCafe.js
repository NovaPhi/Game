document.addEventListener("DOMContentLoaded", function () {

    const images = [
        "url('HTML-FrontEnd/MangaCafeEva/download.jpeg')",
        "url('HTML-FrontEnd/MangaCafeEva/images.jpeg')"
    ];

    const wordColor = [
        "purple",
        "#ed2323"
    ];

    const BordeColor = [
        "greenyellow",
        "#fbe6e5"
    ];

    const mangas = [
        {
            title: "One Piece",
            genre: "Adventure, Fantasy",
            author: "Eiichiro Oda",
            volumes: 108,
            description: "Monkey D. Luffy sets sail to find the legendary One Piece treasure and become King of the Pirates.",
            price: "$5 / week",
            cover: "one_piece.jpg"
        },
        {
            title: "Attack on Titan",
            genre: "Action, Dark Fantasy",
            author: "Hajime Isayama",
            volumes: 34,
            description: "Humanity fights for survival against giant humanoid creatures called Titans behind massive walls.",
            price: "$5 / week",
            cover: "aot.jpg"
        },
        {
            title: "One Punch Man",
            genre: "Action, Comedy",
            author: "ONE, Yusuke Murata",
            volumes: 30,
            description: "Saitama is a hero who can defeat any enemy with a single punch, but struggles to find a worthy challenge.",
            price: "$5 / week",
            cover: "opm.jpg"
        },
        {
            title: "Demon Slayer",
            genre: "Action, Supernatural",
            author: "Koyoharu Gotouge",
            volumes: 23,
            description: "Tanjiro becomes a demon slayer after his family is slaughtered and his sister is turned into a demon.",
            price: "$5 / week",
            cover: "demon_slayer.jpg"
        },
        {
            title: "Fullmetal Alchemist",
            genre: "Adventure, Fantasy",
            author: "Hiromu Arakawa",
            volumes: 27,
            description: "Two brothers search for the Philosopher's Stone after a failed alchemical ritual costs them dearly.",
            price: "$5 / week",
            cover: "fmab.jpg"
        }
    ]

    const selectDia = document.getElementById("dia");

    selectDia.addEventListener("change", function () {
        cambiarMenu(this.value);
    });

    let index = 0;
    let mangaIndex = 0;

    const button = document.getElementById("changeBtn");
    const header = document.querySelector(".Header"); 
    const body = document.querySelector(".Content");
    const mangaButton = document.getElementById("mangasBtn");
    const mangaSection = document.getElementById("mangaSection");
    const mangaNavDiv = document.getElementById("mangaNavDiv");
    const prevButton = document.getElementById("prevBtn");
    const nextButton = document.getElementById("nextBtn");

    //Change background function
    button.addEventListener("click", function () {
        document.body.style.backgroundImage = images[index];
        document.body.style.color = wordColor[index];
        header.style.color = wordColor[index];
        body.style.color = wordColor[index];
        body.style.borderColor = BordeColor[index];

        index = (index + 1) % images.length;
    });

    //Display manga function
    function renderManga(manga) {
        document.getElementById("mangaTitle").innerHTML = manga.title;
        document.getElementById("mangaGenre").innerHTML = manga.genre;
        document.getElementById("mangaAuthor").innerHTML = manga.author;
        document.getElementById("mangaVolumes").innerHTML = manga.volumes;
        document.getElementById("mangaDesc").innerHTML = manga.description;
        document.getElementById("mangaPrice").innerHTML = manga.price;
        document.getElementById("mangaCover").src = manga.cover;
    }


    //Manga button event listener
    mangaButton.addEventListener("click", function (){
        if (mangaSection.style.display === "none") {
            mangaSection.style.display = "block";
            mangaNavDiv.style.display = "flex";
            renderManga(mangas[mangaIndex]);
        } else {
            mangaSection.style.display = "none";
            mangaNavDiv.style.display = "none";
        }
    });

    nextButton.addEventListener("click", function (){
        console.log("Antes: ", mangaIndex);
        if (mangaIndex < 4){
            mangaIndex ++;
            renderManga(mangas[mangaIndex]);
        }
        else{
            mangaIndex = 0;
            renderManga(mangas[mangaIndex]);
        }
        console.log("Después: ", mangaIndex);
    })

    prevButton.addEventListener("click", function (){
        console.log("Antes: ", mangaIndex);
        if (mangaIndex > 0){
            mangaIndex --;
            renderManga(mangas[mangaIndex]);
        }
        else{
            mangaIndex = 4;
            renderManga(mangas[mangaIndex]);
        }
        console.log("Después: ", mangaIndex);
    })

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