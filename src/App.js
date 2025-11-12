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
import React, {useEffect} from "react";
import Terms from "./pages/terms";
import ConvertPage from "./pages/convert";
import Privacy from "./pages/privacy";
import { GoogleOAuthProvider } from '@react-oauth/google';
import CookieBanner from "./components/cookie-banner";

function App() {
    // Auto-logout users with old auth (no JWT token)
    useEffect(() => {
        const oldData = localStorage.getItem('collector-data');
        const authData = localStorage.getItem('auth');
        
        // If user has old data but no JWT token, clear it
        if (oldData && !authData) {
            console.log('Clearing old authentication data...');
            localStorage.removeItem('collector-data');
        }
    }, []);

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
                            <Route path="/convert" element={<ConvertPage />}/>
                            <Route path="/privacy" element={<Privacy/>}/>
                        </Routes>
                    </main>
                    <Footer />
                    <CookieBanner />
                </div>
            </BrowserRouter>
        </GoogleOAuthProvider>
    );
}

export default App;
