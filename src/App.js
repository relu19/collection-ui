import {BrowserRouter, Routes, Route } from 'react-router-dom'
import HomeScreen from './pages/home'
import SetsScreen from './pages/sets'
import 'reset-css';
import './style/style.scss';
import './style/modal.scss';
import './style/button.scss';
import Header from "./components/header";
import React from "react";

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/sets" element={<SetsScreen />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
