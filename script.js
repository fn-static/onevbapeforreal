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
    const promoBanner = document.getElementById("promoBanner");

    let currentProductId = null;
    let currentPrice = 0;
    let currentLinks = {};

    // Obsługuje kliknięcia na produkty
    document.querySelectorAll(".product-item").forEach(item => {
        item.addEventListener('click', function() {
            const productId = this.getAttribute('data-product');
            currentPrice = parseFloat(this.getAttribute('data-price'));
            currentProductId = productId;
            currentLinks = {
                1: this.querySelector('.buyNowButton').getAttribute('data-link1'),
                2: this.querySelector('.buyNowButton').getAttribute('data-link2'),
                3: this.querySelector('.buyNowButton').getAttribute('data-link3')
            };

            // Ustaw odpowiednie dane w modalu
            if (modalImage && modalText) {
                modalImage.src = `product${currentProductId}.jpg`;
                modalText.textContent = `Produkt ${currentProductId}`;
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
        document.getElementById('totalAmount').value = currentPrice * selectedQuantity;

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

        // Przekierowanie do Stripe
        window.location.href = paymentLink;

        // Strona gratulacji - tylko po udanej płatności (przekierowanie może być realizowane przez Stripe)
    setTimeout(() => {
        window.location.href = 'https://twojastrona.pl/gratulacje'; // Zastąp tym URL strony gratulacji
    }, 10); // Opóźnienie, aby dać czas na zakończenie płatności
    });

    // Ograniczenie wartości w polu wejściowym
    quantityInput.addEventListener('input', function() {
        const maxQuantity = 10;
        if (this.value > maxQuantity) {
            this.value = maxQuantity;
        }
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
});


