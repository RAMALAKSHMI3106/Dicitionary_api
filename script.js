const search = document.querySelector("#search");
const button = document.querySelector(".btn");
const result = document.querySelector(".meanings");

button.addEventListener("click", find);

search.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        find();
    }
});

async function find() {

    const word = search.value.trim();

    if (word === "") {
        alert("Please enter any word");
        return;
    }

    try {

        const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );

        if (!response.ok) {
            result.innerHTML = "<h3>Word Not Found</h3>";
            return;
        }

        const data = await response.json();

        console.log(data);

        const phonetic = data[0].phonetics[0]?.text || "No phonetic";

        const meaning =
            data[0].meanings[0].definitions[0].definition;

        const example =
            data[0].meanings[0].definitions[0].example ||
            "No example available";

        const part =
            data[0].meanings[0].partOfSpeech;

        let audio = "";

        for (let p of data[0].phonetics) {

            if (p.audio) {

                audio = p.audio;

                break;
            }
        }

        result.innerHTML = `
           <div class="top">
            <h2 style="color:black;">${word}</h2>
             ${
                audio
                ?
                `<button class="audio-btn">
                    <i class="fas fa-volume-up"></i>
                </button>`
                :
                "No audio available"
            }
            </div>
            <h4 style="color:red;">${phonetic}</h4>

            <div class="card">

                <h3>Part of Speech</h3>

                <p>${part}</p>

            </div>

            <div class="card">

                <h3>Meaning</h3>

                <p>${meaning}</p>

            </div>

            <div class="card">

                <h3>Example</h3>

                <p>${example}</p>

            </div>

           
        `;

        if (audio) {

            document.querySelector(".audio-btn")
            .addEventListener("click", () => {

                new Audio(audio).play();

            });

        }

    } catch {

        result.innerHTML = "<h3>Something went wrong.</h3>";

    }

}