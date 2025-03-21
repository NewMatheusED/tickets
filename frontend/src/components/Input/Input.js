import React from 'react';
import styles from './Input.module.css';

function Input({ label, type = 'text', value, onChange, placeholder, margin = { marginBottom: '15px' } }) {
    return (
        <div className={styles.inputContainer} style={margin}>
            {label && <label className={styles.label}>{label}</label>}
            <input
                className={styles.input}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
}

export default Input;