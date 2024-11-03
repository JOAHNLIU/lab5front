let selectedCell = null; // Зберігає обрану клітинку

function validateForm() {
    const pib = document.getElementById('pib').value.trim();
    const variant = document.getElementById('variant').value;
    const phone = document.getElementById('phone').value.trim();
    const faculty = document.getElementById('faculty').value.trim();
    const address = document.getElementById('address').value.trim();

    const pibRegex = /^[А-ЯЇЄІҐ]{3,}\s[А-ЯЇЄІҐ]\.[А-ЯЇЄІҐ]\.$/;
    const variantRegex = /^[0-9]+$/;
    const phoneRegex = /^\(\d{3}\)-\d{3}-\d{2}-\d{2}$/;
    const facultyRegex = /^[А-ЯЇЄІҐ]{4}$/;
    const addressRegex = /^м\.\s[А-ЯЇЄІҐ]{3,}$/;

    document.getElementById('pib').classList.remove('error');
    document.getElementById('variant').classList.remove('error');
    document.getElementById('phone').classList.remove('error');
    document.getElementById('faculty').classList.remove('error');
    document.getElementById('address').classList.remove('error');
    document.getElementById('output').innerHTML = "";

    let valid = true;
    let errorMessage = "Будь ласка, виправте помилки у формі:\n";

    if (!pibRegex.test(pib)) {
        document.getElementById('pib').classList.add('error');
        errorMessage += "- ПІБ має бути у форматі 'ТТТТТТ Т.Т.'\n";
        valid = false;
    }
    if (!variantRegex.test(variant)) {
        document.getElementById('variant').classList.add('error');
        errorMessage += "- Варіант повинен бути числом\n";
        valid = false;
    }
    if (!phoneRegex.test(phone)) {
        document.getElementById('phone').classList.add('error');
        errorMessage += "- Телефон повинен бути у форматі '(ЧЧЧ)-ЧЧЧ-ЧЧ-ЧЧ'\n";
        valid = false;
    }
    if (!facultyRegex.test(faculty)) {
        document.getElementById('faculty').classList.add('error');
        errorMessage += "- Факультет повинен складатись з чотирьох великих літер\n";
        valid = false;
    }
    if (!addressRegex.test(address)) {
        document.getElementById('address').classList.add('error');
        errorMessage += "- Адреса повинна бути у форматі 'м. ЧЧЧЧ'\n";
        valid = false;
    }

    if (valid) {
        displayOutput(pib, variant, phone, faculty, address);
        createTable(variant);
    } else {
        alert(errorMessage);
    }
}

function displayOutput(pib, variant, phone, faculty, address) {
    document.getElementById('output').innerHTML = `
        <p><strong>ПІБ:</strong> ${pib}</p>
        <p><strong>Варіант:</strong> ${variant}</p>
        <p><strong>Телефон:</strong> ${phone}</p>
        <p><strong>Факультет:</strong> ${faculty}</p>
        <p><strong>Адреса:</strong> ${address}</p>
    `;
}

function createTable(variant) {
    const table = document.getElementById('numberTable');
    table.innerHTML = '';

    let counter = 1;
    for (let i = 0; i < 6; i++) {
        const row = table.insertRow();
        for (let j = 0; j < 6; j++) {
            const cell = row.insertCell();
            cell.innerHTML = counter;
            cell.dataset.number = counter;
            if (counter == variant) {
                cell.addEventListener('mouseover', changeColorRandom);
                cell.addEventListener('click', () => openColorPicker(cell));
                cell.addEventListener('dblclick', () => changeRowColorsFrom(cell.parentNode.rowIndex));
            }
            counter++;
        }
    }
}

function changeColorRandom() {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    this.style.backgroundColor = randomColor;
}

function openColorPicker(cell) {
    selectedCell = cell;
    const colorPicker = document.getElementById('colorPicker');
    colorPicker.style.display = 'block'; // Показуємо палітру
    drawColorPicker(); // Викликаємо функцію для малювання палітри
}

function drawColorPicker() {
    const canvas = document.getElementById('colorCanvas');
    const ctx = canvas.getContext('2d');

    // Задаємо розміри канвасу
    canvas.width = 300;
    canvas.height = 300;

    // Створюємо градієнти для палітри
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            const r = Math.floor((x / canvas.width) * 255);
            const g = Math.floor((y / canvas.height) * 255);
            const b = 128; // постійна складова для кольору
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }

    // Додаємо обробник для вибору кольору
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Отримуємо колір пікселя, на який натиснули
        const color = ctx.getImageData(x, y, 1, 1).data;
        const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        
        // Переконатися, що ми отримали правильний колір
        if (color[3] > 0) { // перевіряємо альфа-канал
            selectedCell.style.backgroundColor = rgbColor; // Змінюємо колір клітинки
        }
        
        const colorPicker = document.getElementById('colorPicker');
        colorPicker.style.display = 'none'; // Сховати палітру
    });
}

function changeRowColorsFrom(startRow) {
    const table = document.getElementById('numberTable');
    for (let i = startRow; i < table.rows.length; i += 2) {
        for (let j = 0; j < table.rows[i].cells.length; j++) {
            const cell = table.rows[i].cells[j];
            cell.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createTable(17);
});
