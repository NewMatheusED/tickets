// Exemplo de uso em TicketsManager.js
import React, { useState, useEffect } from 'react';
import UserSelect from '../../components/UserSelect/UserSelect';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import styles from './TicketsManager.module.css';
import { CirclePlus, Ban } from 'lucide-react';

function TicketsManager() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    user: '',
    search: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [observation, setObservation] = useState('');


  useEffect(() => {
    // Carrega os usuários cadastrados
    fetchUsers();
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    }
  };

  const fetchUsers = async () => {
    const response = await fetch('/api/users', { credentials: 'include' });
    if (response.ok) {
      const data = await response.json();
      setUsers(data);
    }
  };

  const handleCreateTicket = async () => {
    const formData = new FormData();
    formData.append('user_id', selectedUser);
    if (observation) formData.append('observation', observation);
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (response.ok) {
        fetchTickets();
        setIsModalOpen(false);
        setSelectedUser('');
        setObservation('');
      }
    } catch (error) {
      console.error("Error creating ticket", error);
    }
  };

  // Filter tickets based on filter criteria
  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filters.status ? ticket.ticket_status === filters.status : true;
    const matchesUser = filters.user ? ticket.user_id === parseInt(filters.user) : true;
    const matchesSearch = filters.search
      ? ticket.observation?.toLowerCase().includes(filters.search.toLowerCase())
      : true;
    return matchesStatus && matchesUser && matchesSearch;
  });

  // Group tickets by status (assumes statuses 'open', 'in progress', 'closed')
  const ticketsByStatus = filteredTickets.reduce((acc, ticket) => {
    const status = ticket.ticket_status;
    if (!acc[status]) acc[status] = [];
    acc[status].push(ticket);
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <div className={styles.topMenu}>
        <Button onClick={() => setIsModalOpen(true)}>
          <CirclePlus /> Criar Ticket
        </Button>
        <div className={styles.filters}>
          <Input 
            label=""
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Pesquisar ticket..."
            margin={{ marginBottom: '0' }}
          />
          <select 
            className={styles.select}
            value={filters.status} 
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">Todos Status</option>
            <option value="open">Aberto</option>
            <option value="in progress">Em Andamento</option>
            <option value="closed">Fechado</option>
          </select>
          <UserSelect 
            users={users} 
            value={filters.user} 
            onChange={(newUserId) => setFilters({ ...filters, user: newUserId })}
            placeholder="Todos Usuários"
          />
          <Button onClick={() => setFilters({ status: '', user: '', search: '' })}>
            Limpar Filtros
          </Button>
        </div>
      </div>
      <div className={styles.board}>
        {['open', 'in progress', 'closed'].map(status => (
          <div key={status} className={styles.column}>
            <h3>
              {status === 'open' && 'ABERTO'}
              {status === 'in progress' && 'EM ANDAMENTO'}
              {status === 'closed' && 'FECHADO'}
            </h3>
            {ticketsByStatus[status] && ticketsByStatus[status].map(ticket => (
              <div key={ticket.id} className={styles.ticketCard}>
                <p><strong>ID:</strong> {ticket.ticket_id_hash}</p>
                <p><strong>Observação:</strong> {ticket.observation || 'N/A'}</p>
                <p><strong>Data:</strong> {new Date(ticket.ticket_date).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Criar Ticket</h2>
            <div className={styles.field}>
              <label>Observação (Opcional)</label>
              <textarea 
                value={observation} 
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Digite uma observação" />
            </div>
            <div className={styles.modalActions}>
              <Button onClick={handleCreateTicket}>
                <CirclePlus />
                Criar
              </Button>
              <Button label="Cancelar" color='danger' onClick={() => setIsModalOpen(false)}>
                <Ban />
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketsManager;