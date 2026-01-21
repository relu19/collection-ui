import React from "react";
import './style.scss';
import { closeMobileMenu } from "../../utils/closeMobileMenu";


const Footer = () => {

    return (
        <div className='cl-footer'>
            <div className='footer-links'>
                <a href='/terms' onClick={closeMobileMenu}>Terms and Conditions</a>
                <a href='/privacy' onClick={closeMobileMenu}>Privacy Policy</a>
            </div>
            <p>Copyright © {new Date().getFullYear()} Relu Plesciuc</p>
        </div>
    )
}
export default Footer