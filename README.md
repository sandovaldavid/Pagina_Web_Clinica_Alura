# 🏥 Buona Vita Nutrición - Patient Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A web-based patient management system for nutritionists to track patient data and calculate BMI (Body Mass Index).

## 📋 Features

- Add new patients with their details
- Calculate BMI automatically
- Filter patients by name
- Remove patients with double-click
- Import patients from external API
- Validate input data
- Responsive design

## 🚀 Demo

Visit the live demo: [Buona Vita Nutrición](https://clinica-alura.devprojects.tech)

## 💻 Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- REST API

## 📦 Project Structure

``` note
├── css/
│   ├── index.css              # Main styles
│   └── reset.css              # CSS reset
├── js/
│   ├── buscar_pacientes.js    # API integration
│   ├── calcular-imc.js        # BMI calculations
│   ├── eliminar-paciente.js   # Patient removal
│   ├── filtrar.js             # Search functionality
│   └── form.js                # Form handling
├── index.html                 # Main page
└── README.md
```

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/sandovaldavid/Pagina_Web_Clinica_Alura.git
```

1. Open `index.html` in your browser or use a local server:

```bash
python -m http.server 8000
# or
php -S localhost:8000
```

## 💡 Usage

| Action | Description |
|--------|-------------|
| Add Patient | Fill the form and click "Adicionar" |
| Remove Patient | Double-click on patient row |
| Search Patient | Type in the search box |
| Import Patients | Click "Buscar Pacientes" button |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Validation Rules

- Weight: 0-1000 kg
- Height: 0-3.00 m
- All fields are required
- Data format validation

## 📝 Notes

The project uses:

- RESTful API for patient import
- Regular expressions for search
- CSS animations for deletion
- Responsive layout

---
<p align="center">
Made by <a href="https://github.com/sandovaldavid">@sandovaldavid</a>
</p>
