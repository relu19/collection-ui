import {BrowserRouter, Routes, Route } from 'react-router-dom'
import HomeScreen from './pages/home'
import 'reset-css';
import './style/style.scss';
import './style/modal.scss';
import './style/button.scss';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeScreen />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
