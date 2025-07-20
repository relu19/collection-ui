import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomeScreen from './pages/home'
import SetsScreen from './pages/sets'
import 'reset-css';
import './style/style.scss';
import './style/modal.scss';
import './style/button.scss';
import './style/spinner.scss';
import Header from "./components/header";
import Footer from "./components/footer";
import React from "react";
import Terms from "./pages/terms";
import Privacy from "./pages/privacy";
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <BrowserRouter>
                <div className="app-container">
                    <Header/>
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<HomeScreen/>}/>
                            <Route path="/sets" element={<SetsScreen/>}/>
                            <Route path="/terms" element={<Terms/>}/>
                            <Route path="/privacy" element={<Privacy/>}/>
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
        </GoogleOAuthProvider>
    );
}

export default App;
