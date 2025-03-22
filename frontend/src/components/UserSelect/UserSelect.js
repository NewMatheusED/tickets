import React, { useState, useRef, useEffect } from 'react';
import styles from './UserSelect.module.css';

function UserSelect({ users = [], value, onChange, placeholder = "Selecione um usuário" }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  const selectedUser = users.find(user => String(user.id) === String(value));
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (user) => {
    onChange(user.id);
    setDropdownOpen(false);
    setSearchTerm('');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setSearchTerm('');
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
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar..."
            className={styles.searchInput}
          />
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <div
                key={user.id || index}
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
            ))
          ) : (
            <div className={styles.noResults}>Nenhum usuário encontrado</div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserSelect;