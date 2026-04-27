document.addEventListener("DOMContentLoaded", function () {

    const images = [
        "url('../Assets/download.jpeg')",
        "url('../Assets/images.jpeg')"
    ];

    const wordColor = [
        "purple",
        "#ed2323"
    ];

    const BordeColor = [
        "greenyellow",
        "#fbe6e5"
    ];

    let mangaIndex = 0;
    let mangas = [];
    async function fetchMangas() {
        try {
            const res = await fetch('http://localhost:8081/Mangas');
            mangas = await res.json();
        } catch (err) {
            console.error('Error fetching mangas:', err);
        }
    }
    fetchMangas();


    const selectDia = document.getElementById("dia");

    selectDia.addEventListener("change", function () {
        cambiarMenu(this.value);
    });

    let index = 0;


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
        document.getElementById("mangaPrice").innerHTML = `$${manga.price} / week`;
        document.getElementById("mangaCover").src = manga.coverSrc;
    }


    //Manga button event listener
    mangaButton.addEventListener("click", function (){
        if (mangas.length === 0) return;
        if (mangaSection.style.display === "none") {
            mangaSection.style.display = "block";
            mangaNavDiv.style.display = "flex";
            renderManga(mangas[mangaIndex]);
        } else {
            mangaSection.style.display = "none";
            mangaNavDiv.style.display = "none";
        }
    });

    nextButton.addEventListener("click", function () {
        mangaIndex = (mangaIndex + 1) % mangas.length;
        renderManga(mangas[mangaIndex]);
    });

    prevButton.addEventListener("click", function () {
        mangaIndex = (mangaIndex - 1 + mangas.length) % mangas.length;
        renderManga(mangas[mangaIndex]);
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

async function cambiarMenu(dia) {
    const menu = document.getElementById("par1");
    try {
        const res = await fetch(`http://localhost:8081/Menu?day=${dia}`);
        const items = await res.json();
        const dayLabel = items.length > 0 ? items[0].promotion_type : '';
        let html = `
            <p>Welcome to the EVA cafe</p>
            <p>MENU (${dia.charAt(0).toUpperCase() + dia.slice(1)} - ${dayLabel})</p>
        `;
        items.forEach(item => {
            const priceLabel = item.price !== null ? `${item.item_name}: ${item.price}$` : `${item.item_name} +`;
            html += `
                <div class="item">
                    ${priceLabel}
                    <img src="${item.imageSrc}" class="img-hover">
                </div>
            `;
        });
        menu.innerHTML = html;
    } catch (err) {
        console.error('Error fetching menu:', err);
        menu.innerHTML = '<p>Error loading menu. Please try again.</p>';
    }
}



document.addEventListener("DOMContentLoaded", function () {

    const music = document.getElementById("Music");

    music.volume = 0.05;   
    });