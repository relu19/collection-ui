import React, { useState } from 'react';

const ForgotPasswordForm = ({ onSubmit }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            setMessage('Please provide your email address.');
            return;
        }
        onSubmit(email);
        setMessage('Check your email for the reset link.');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            {message && <p>{message}</p>}
            <button type="submit">Reset Password</button>
        </form>
    );
};

export default ForgotPasswordForm;
