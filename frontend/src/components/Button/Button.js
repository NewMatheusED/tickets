import React from 'react';
import styles from './Button.module.css';

function Button({ label, onClick, type = 'button', disabled = false }) {
    return (
        <button
            className={styles.button}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {label}
        </button>
    );
}

export default Button;