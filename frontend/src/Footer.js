import React from 'react';
import './Footer.css';
import logoEpl from './images/logepl.jpg';
import logoUcl from './images/logoucl.png';
import logoMuseum from './images/logo_museum.jpg';
import logoIdLab from './images/idlab_logo.jpg';

const Footer = () => {
    return (
        <footer className="footer">
            <p>&copy; 2025 Marc Bejjani, Augusto Barbosa Villar Silva.</p>
            <p>Université Catholique de Louvain, EPL</p>
            <p>Thesis Supervisor: Benoît Macq</p>
            <p><a href="mailto:[marc.bejjani@student.uclouvain.be]">marc.bejjani@student.uclouvain.be</a></p>
            <p><a href="mailto:[augusto.silva@student.uclouvain.be]">augusto.silva@student.uclouvain.be</a></p>
            <div className="footer-logos">
                <img src={logoUcl} alt='UCL' className="footer-logo"></img>
                <img src={logoEpl} alt='EPL' className="footer-logo"></img>
                <img src={logoMuseum} alt='Museum' className="footer-logo"></img>
                <img src={logoIdLab} alt='IDLAB' className="footer-logo"></img>
            </div>
        </footer>
    );
};

export default Footer;