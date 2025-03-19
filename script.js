const girls = JSON.parse(localStorage.getItem('girls')) || [
    { name: 'OTÁVIO', items: [] },
    { name: 'MANU', items: [] },
    { name: 'JÉSSICA', items: [] },
    { name: 'JÚLIA', items: [] },
    { name: 'LIZA', items: [] },
    { name: 'GEOVANA', items: [] },
];

function saveToLocalStorage() {
    localStorage.setItem('girls', JSON.stringify(girls));
}

function render() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    girls.forEach((girl, girlIndex) => {
        const card = document.createElement('div');
        card.className = 'card';

        const title = document.createElement('h2');
        title.textContent = girl.name;
        card.appendChild(title);

        girl.items.forEach((item, itemIndex) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            if (item.paid) itemDiv.classList.add('paid');

            const itemName = document.createElement('span');
            let itemText = `${item.name}`;
            if (item.quantity > 1) {
                itemText += ` (x${item.quantity})`;
            }
            itemText += ` - R$ ${item.price.toFixed(2)}`;
            if (item.quantity > 1) {
                const subtotal = item.price * item.quantity;
                itemText += ` (Subtotal: R$ ${subtotal.toFixed(2)})`;
            }
            itemName.textContent = itemText;
            itemDiv.appendChild(itemName);

            if (!item.paid) {
                const payButton = document.createElement('button');
                payButton.textContent = 'Marcar como pago';
                payButton.onclick = () => markAsPaid(girlIndex, itemIndex);
                itemDiv.appendChild(payButton);

                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remover';
                removeButton.onclick = () => removeItem(girlIndex, itemIndex);
                itemDiv.appendChild(removeButton);

                const subtractButton = document.createElement('button');
                subtractButton.textContent = 'Subtrair';
                subtractButton.onclick = () => {
                    const subtractValue = prompt(`Digite o valor a ser subtraído de "${item.name}":`);
                    if (subtractValue !== null && !isNaN(parseFloat(subtractValue))) {
                        subtractFromItem(girlIndex, itemIndex, parseFloat(subtractValue));
                    } else if (subtractValue !== null) {
                        alert('Por favor, digite um valor numérico válido.');
                    }
                };
                itemDiv.appendChild(subtractButton);
            }

            card.appendChild(itemDiv);
        });

        const totalDiv = document.createElement('div');
        totalDiv.className = 'total';
        const total = girl.items.reduce((sum, item) => item.paid ? sum : sum + item.price * item.quantity, 0);
        totalDiv.textContent = `Total: R$ ${total.toFixed(2)}`;
        card.appendChild(totalDiv);

        const itemNameInput = document.createElement('input');
        itemNameInput.placeholder = 'Nome do item';

        const itemQuantityInput = document.createElement('input');
        itemQuantityInput.type = 'number';
        itemQuantityInput.placeholder = 'Quantidade';

        const itemPriceInput = document.createElement('input');
        itemPriceInput.type = 'number';
        itemPriceInput.placeholder = 'Preço';

        itemNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                itemQuantityInput.focus();
            }
        });

        itemQuantityInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                itemPriceInput.focus();
            }
        });

        itemPriceInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && itemNameInput.value && itemQuantityInput.value && itemPriceInput.value) {
                addItem(girlIndex, itemNameInput.value, parseInt(itemQuantityInput.value), parseFloat(itemPriceInput.value));
                itemNameInput.value = '';
                itemQuantityInput.value = '';
                itemPriceInput.value = '';
            }
        });

        card.appendChild(itemNameInput);
        card.appendChild(itemQuantityInput);
        card.appendChild(itemPriceInput);

        app.appendChild(card);
    });
}

function addItem(girlIndex, name, quantity, price) {
    girls[girlIndex].items.push({ name, quantity, price, paid: false });
    saveToLocalStorage();
    render();
}

function markAsPaid(girlIndex, itemIndex) {
    girls[girlIndex].items[itemIndex].paid = true;
    saveToLocalStorage();
    render();
}

function removeItem(girlIndex, itemIndex) {
    girls[girlIndex].items.splice(itemIndex, 1);
    saveToLocalStorage();
    render();
}

function subtractFromItem(girlIndex, itemIndex, value) {
    if (girls[girlIndex].items[itemIndex].price - value >= 0) {
        girls[girlIndex].items[itemIndex].price -= value;
        saveToLocalStorage();
        render();
    } else {
        alert('O valor a ser subtraído é maior que o preço atual do item.');
    }
}

document.addEventListener('DOMContentLoaded', render);