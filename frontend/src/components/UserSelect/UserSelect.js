import React, { useState, useRef, useEffect } from 'react';
import styles from './UserSelect.module.css';

function UserSelect({ users = [], value, onChange, placeholder = "Selecione um usuário" }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedUser = users.find(user => String(user.email) === String(value));

  const handleSelect = (user) => {
    console.log('user', user);
    onChange(user.email);
    setDropdownOpen(false);
  };

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.selected} onClick={() => setDropdownOpen(!dropdownOpen)}>
        {selectedUser ? (
          <>
            <img
              src={`${process.env.REACT_APP_API_URL}/static/uploads/${selectedUser.profile_picture}`}
              alt={selectedUser.username}
              className={styles.avatar}
            />
            <span>{selectedUser.username}</span>
          </>
        ) : (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
        <span className={styles.arrow}>{dropdownOpen ? '▲' : '▼'}</span>
      </div>
      {dropdownOpen && (
        <div className={styles.dropdown}>
          {users.map((user, index) => (
            <div
              key={user.email || index}
              className={styles.option}
              onClick={() => handleSelect(user)}
            >
              <img
                src={`${process.env.REACT_APP_API_URL}/static/uploads/${user.profile_picture}`}
                alt={user.username}
                className={styles.avatar}
              />
              <span>{user.username}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserSelect;