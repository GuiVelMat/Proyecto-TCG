import UserService from "../core/services/user.service.js";
import { getCurrentUser } from "./auth.controller.js";

const renderActiveCard = async () => {
    const username = getCurrentUser();
    const activeCard = await UserService.getActiveCardUser(username);

    const skin_1 = document.querySelector('#skin_1');
    const skin_2 = document.querySelector('#skin_2');
    const skin_3 = document.querySelector('#skin_3');
    const skin_4 = document.querySelector('#skin_4');
    skin_1.innerHTML = '';
    skin_2.innerHTML = '';
    skin_3.innerHTML = '';
    skin_4.innerHTML = '';

    const urlImg = `${window.location.origin}/src/assets/${activeCard.image}`;
    const backgroundColor = getCardColor(activeCard.type);

    // Base card HTML structure without skin class
    const renderedCard = document.createElement('div');
    renderedCard.innerHTML = `
        <div class="active-card-container">
            <div class="card" id="active-card" style="background-color: ${backgroundColor};">                
                <div class="card-title">
                    <p class="card-name">${activeCard.name}</p>
                </div>
                <div class="card-img">
                    <img src="${urlImg}" alt="${activeCard.name}" />
                </div>
                <div class="card-info">
                    <p class="power">${activeCard.power}</p>
                    <p class="rarity">${activeCard.rarity}</p>
                    <p class="health">${activeCard.health}</p>
                </div>
            </div>
        </div>
    `;

    // Append clones with different skin classes
    const cardSkin1 = renderedCard.cloneNode(true);
    cardSkin1.querySelector('#active-card').classList.add("default"); // Empty skin for skin_1
    skin_1.appendChild(cardSkin1);

    const cardSkin2 = renderedCard.cloneNode(true);
    cardSkin2.querySelector('#active-card').classList.add("skin-black"); // "skin-black" for skin_2
    skin_2.appendChild(cardSkin2);

    const cardSkin3 = renderedCard.cloneNode(true);
    cardSkin3.querySelector('#active-card').classList.add("skin-white"); // "skin-white" for skin_3
    skin_3.appendChild(cardSkin3);

    const cardSkin4 = renderedCard.cloneNode(true);
    cardSkin4.querySelector('#active-card').classList.add("skin-rainbow"); // "skin-rainbow" for skin_4
    skin_4.appendChild(cardSkin4);

    attachDeckCardClickEvents();
}


const getCardColor = (type) => {
    switch (type) {
        case 'fire': return 'tomato';
        case 'water': return 'skyblue';
        case 'grass': return 'lightgreen';
        case 'mana': return 'lightgrey';
        default: return 'white';
    }
};

const attachDeckCardClickEvents = () => {
    const username = getCurrentUser();

    document.querySelectorAll('.active-card-container').forEach((container) => {
        container.addEventListener('click', () => {
            const cardElement = container.querySelector('.card');
            const cardName = container.querySelector('.card-name').textContent;

            // Get the skin class (e.g., "default", "skin-black", etc.) 
            const skinClass = Array.from(cardElement.classList).find(cls =>
                cls.startsWith("skin-") || cls === "default"
            );

            Swal.fire({
                title: `Set this skin as active?`,
                showCancelButton: true,
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    console.log(`Setting ${cardName} with skin ${skinClass} as active`);

                    // Save the skin selection to localStorage
                    localStorage.setItem(`selectedSkin`, skinClass);

                    // Optionally, you can provide feedback to the user
                    Swal.fire({
                        icon: 'success',
                        title: `Skin set to ${skinClass}`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });

        });
    });
}


const onInitSkins = async () => {
    try {
        renderActiveCard();
    } catch (error) {
        console.error('Error initializing deck:', error);
    }
}

onInitSkins();