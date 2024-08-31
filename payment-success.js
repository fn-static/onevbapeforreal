document.addEventListener('DOMContentLoaded', () => {
    const stripePayButton = document.getElementById('stripePayButton');
    const orderForm = document.getElementById('orderForm');
    
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

    // Funkcja obsługująca kliknięcie przycisku "Zapłać kartą"
    stripePayButton.addEventListener('click', () => {
        if (!isFormValid()) {
            return; // Jeśli formularz jest niepoprawny, nic nie rób
        }

        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const postalCode = document.getElementById('postalCode').value;
        const parcel = document.getElementById('parcel').value;
        const city = document.getElementById('city').value;
        const totalAmount = document.getElementById('totalAmount').value;

        // Formatowanie wiadomości
        const message = `
            **Nowe zamówienie**
            - Imię i nazwisko: ${name}
            - Nr telefonu: ${phone}
            - Email: ${email}
            - Adres: ${address}
            - Kod pocztowy: ${postalCode}
            - Nazwa/Adres paczkomatu: ${parcel}
            - Miejscowość: ${city}
            - Kwota całkowita: ${totalAmount} PLN
        `;

        // Wyślij dane do Telegrama
        sendToTelegram(message);

        // Przekierowanie do Stripe
        // Jeśli płatność się uda, użytkownik będzie przekierowany na stronę z gratulacjami
        const selectedQuantity = parseInt(quantityInput.value, 10);
        const paymentLink = currentLinks[selectedQuantity] || currentLinks[1];
        
        // Zmień URL na stronę gratulacyjną
        setTimeout(() => {
            window.location.href = paymentLink;
        }, 1000); // Opóźnienie, aby dać czas na wysłanie wiadomości do Telegrama
    });

    // Funkcja do sprawdzania poprawności formularza
    function isFormValid() {
        return orderForm.checkValidity(); // Sprawdza poprawność formularza
    }
});
