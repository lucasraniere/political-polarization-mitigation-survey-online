// import React from 'react';
// import { useNavigate } from 'react-router-dom';

export default function SeguirButton() {
    // const navigate = useNavigate();
    function handleClick() {
        alert('Clicou no botão Seguir');
        // navigate('/survey');
    }
    return (
        <div className="next-button">
            <button onClick={handleClick}>Seguir &gt;</button>
        </div>
    )
}