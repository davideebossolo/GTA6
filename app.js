const express = require('express');
const path = require('path');
const xlsx = require('xlsx');

const app = express();
const PORT = 3000;

// Servire gta.html come pagina principale

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'GTA.html'));
});



// Endpoint per ottenere i dati dal file Excel
app.get('/api/excel-data', (req, res) => {
    const workbook = xlsx.readFile(path.join(__dirname, 'Piano_Caricamento_Instagram.xlsx'));
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    res.json(jsonData); // Invia i dati come JSON al frontend
});

// Servire programma.html all'endpoint /programma
app.get('/programma', (req, res) => {
    res.sendFile(path.join(__dirname, 'programma.html'));
});

app.get('/api/post-today', (req, res) => {
    const workbook = xlsx.readFile(path.join(__dirname, 'Piano_Caricamento_Instagram.xlsx'));
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    const today = new Date().toISOString().split('T')[0]; // formato "YYYY-MM-DD"

    // Filtra i dati per trovare il record del giorno corrente
    const postToday = jsonData.find(row => {
        const dateInExcel = new Date(row.Data).toISOString().split('T')[0];
        return dateInExcel === today;
    });

    if (postToday) {
        res.json({
            tipo_video: postToday['Tipo di Video'],
            orario_pubblicazione: postToday['Orario di Pubblicazione']
        });
    } else {
        res.json({ message: "Nessun post programmato per oggi." });
    }
});

// Avvio del server
app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});
