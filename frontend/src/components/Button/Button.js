import React from 'react';
import styles from './Button.module.css';

function Button({ children, onClick, type = 'button', disabled = false, color = 'primary' }) {
  const colorMap = {
    primary: '#007bff', // azul padrão
    danger: '#dc3545'   // vermelho para cancelar
  };

  const hoverColorMap = {
    primary: '#0056b3', // azul escuro para hover
    danger: '#c82333'   // vermelho escuro para hover
  };

  const bg = colorMap[color] || color;
  const hoverBg = hoverColorMap[color] || color;

  return (
    <button
      className={styles.button}
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={{
        '--bg': bg,
        '--hover': hoverBg
      }}
    >
      {children}
    </button>
  );
}

export default Button;