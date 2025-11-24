# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Cork City Pharmacy & Clinic Locator App
Helping new & international students access healthcare in Cork City
📍 Overview

This is an interactive web application built with React, Leaflet Maps, and Vite that helps users quickly locate:

Pharmacies in Cork City

Doctor365 Walk-In Clinics

UCC Student Health Centre (free GP visits for UCC students)

Originally built as a Python Kivy/BeeWare mobile app, this project was later transformed into a modern responsive web app so it can be used on any mobile browser.

🎯 Target Audience

New students living in Cork

International students unfamiliar with Irish healthcare

Anyone needing quick access to local pharmacies or walk-in GP clinics

🚀 Features
🔎 Interactive Map

Displays 12 pharmacies and 3 clinics in Cork

Leaflet-based map with zoom and markers

Click markers to view name, address, phone, type

🔍 Location Filters

Filter by:

All

Pharmacies

Walk-In Clinics

UCC Health Centre

📞 Quick Actions

Each card shows:

Address

Eircode

Phone number

“Call Now” button

“Open in Google Maps” button

📡 Nearest Location Detection

App calculates distance using Haversine formula.

🎓 Educational Information

Explains:

Difference between pharmacies and walk-in clinics

Benefits for UCC students (free GP support)

🛠 Tech Stack
Area	Tools
Frontend	React, Vite, JavaScript
Map	Leaflet.js
Styling	CSS3
Deployment	GitHub Pages / Netlify / Vercel
Original Project	Python + Kivy/BeeWare
