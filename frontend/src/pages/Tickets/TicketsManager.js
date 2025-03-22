// Exemplo de uso em TicketsManager.js
import React, { useState, useEffect } from 'react';
import UserSelect from '../../components/UserSelect/UserSelect';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import styles from './TicketsManager.module.css';
import { CirclePlus, Ban, Edit } from 'lucide-react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function TicketsManager() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    user: '',
    search: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [observation, setObservation] = useState('');
  const [title, setTitle] = useState('');
  const [typeError, setTypeError] = useState('');
  const [solicitante, setSolicitante] = useState('');
  const [chamadoExterno, setChamadoExterno] = useState('');
  const [setor, setSetor] = useState('');

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editableObservation, setEditableObservation] = useState('');
  const [editableStatus, setEditableStatus] = useState('');


  const MySwal = withReactContent(Swal)

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
        console.log(data);
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
    // Constrói o payload com os dados do formulário.
    const payload = {
      title, // obrigatório
      type_error: typeError, // obrigatório
      solicitante, // obrigatório
      observation, // opcional
      chamado_externo: chamadoExterno, // opcional
      setor: setor // obrigatório
    };
    if (!title || !typeError || !solicitante) {
      // Aqui você pode exibir uma mensagem de erro para o usuário
      MySwal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Preencha todos os campos obrigatórios'
      });
      return;
    }
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        fetchTickets();
        setIsModalOpen(false);
        // Limpa os campos do modal
        setTitle('');
        setTypeError('');
        setSolicitante('');
        setChamadoExterno('');
        setObservation('');
        MySwal.fire({
          icon: 'success',
          title: 'Ticket criado!',
        });
      } else {
        // Aqui você pode exibir uma mensagem de erro para o usuário
        console.error('Erro ao criar ticket');
      }
    } catch (error) {
      console.error("Error creating ticket", error);
    }
  };

  // Filter tickets based on filter criteria
  const filteredTickets = tickets.filter(ticket => {
    const matchesUser = filters.user ? String(ticket.user_id) === String(filters.user) : true;
    const matchesSearch = filters.search
      ? ticket.id?.toLowerCase().includes(filters.search.toLowerCase()) || ticket.title?.toLowerCase().includes(filters.search.toLowerCase())
      : true;
    return matchesUser && matchesSearch;
  });

  // Group tickets by status (assumes statuses 'open', 'in progress', 'closed')
  const ticketsByStatus = filteredTickets.reduce((acc, ticket) => {
    const status = ticket.ticket_status;
    if (!acc[status]) acc[status] = [];
    acc[status].push(ticket);
    return acc;
  }, {});

  // Abre o modal de detalhe do ticket
  const openTicketDetail = (ticket) => {
    setSelectedTicket(ticket);
    setEditableObservation(ticket.observation);
    setEditableStatus(ticket.ticket_status);
  };

    // Função para enviar atualização (exemplo, você deve implementar o endpoint de update)
  const handleUpdateTicket = async () => {
    // Exemplo de payload para update
    const payload = {
      observation: editableObservation,
      ticket_status: editableStatus
    };
    try {
      const response = await fetch(`/api/tickets/${selectedTicket.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
      if(response.ok) {
        fetchTickets();
        setSelectedTicket(null);
        MySwal.fire({
          icon: 'success',
          title: 'Ticket atualizado!',
        });
      } else {
        console.error('Erro ao atualizar ticket');
      }
    } catch (error) {
      console.error("Error updating ticket", error);
    }
  };

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
          {/* <select 
            className={styles.select}
            value={filters.status} 
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">Todos Status</option>
            <option value="open">Aberto</option>
            <option value="in progress">Em Andamento</option>
            <option value="pending">Pendente</option>
            <option value="closed">Fechado</option>
          </select> */}
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
        {['open', 'in progress', 'pending', 'closed'].map(status => (
          <div key={status} className={styles.column}>
            <h3>
              {status === 'open' && 'ABERTO'}
              {status === 'in progress' && 'EM ANDAMENTO'}
              {status === 'pending' && 'PENDENTE'}
              {status === 'closed' && 'FECHADO'}
            </h3>
            {ticketsByStatus[status] && ticketsByStatus[status].map(ticket => {
              // Busca o usuário atribuído para mostrar a foto e nome
              console.log('ticket ', ticket);
              const assignedUser = users.find(u => String(u.id) === String(ticket.user_id));
              return (
                <div
                  key={ticket.id}
                  className={styles.ticketCard}
                  onClick={() => openTicketDetail(ticket)}
                >
                  <h4><span className={styles.ticketId}>#{ticket.id}</span> - {ticket.title}</h4>
                  {assignedUser && (
                    <div className={styles.assignedUser}>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/static/uploads/${assignedUser.profile_picture}`}
                        alt={assignedUser.username}
                        className={styles.avatar}
                      />
                      <span>{assignedUser.username}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Criar Ticket</h2>
            <form className={styles.form}>
              {/* Campo Título (Obrigatório) */}
              <div className={styles.field}>
                <label>
                  Título <span className={styles.required}>*</span>
                </label>
                <Input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Insira o título do ticket"
                />
              </div>
              {/* Campo Tipo de Erro (Obrigatório) - Select customizado */}
              <div className={styles.field}>
                <label>
                  Tipo de Erro <span className={styles.required}>*</span>
                </label>
                <select 
                  className={styles.customSelect}
                  value={typeError}
                  onChange={(e) => setTypeError(e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="Cadastros de fornecedores">Cadastros de fornecedores</option>
                  <option value="Correções de vendas">Correções de vendas</option>
                  <option value="Criação de logins">Criação de logins</option>
                  <option value="Dúvidas gerais">Dúvidas gerais</option>
                  <option value="Melhorias">Melhorias</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              {/* Campo Setor (Obrigatório) - Select customizado */}
              <div className={styles.field}>
                <label>
                  Setor <span className={styles.required}>*</span>
                </label>
                <select 
                  className={styles.customSelect}
                  value={setor}
                  onChange={(e) => setSetor(e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="PTS">PTS</option>
                  <option value="CENTURION">CENTURION</option>
                  <option value="LAZER">LAZER</option>
                  <option value="IC">IC</option>
                  <option value="BTG">BTG</option>
                  <option value="PROJETOS">PROJETOS</option>
                  <option value="PRODUTOS">PRODUTOS</option>
                  <option value="TI">TI</option>
                  <option value="EMERGENCIAL">EMERGENCIAL</option>
                  <option value="OPERADORA">OPERADORA</option>
                  <option value="EVENTOS">EVENTOS</option>
                </select>
              </div>
              {/* Campo Solicitante (Obrigatório) */}
              <div className={styles.field}>
                <label>
                  Solicitante <span className={styles.required}>*</span>
                </label>
                <Input 
                  type="email"
                  value={solicitante}
                  onChange={(e) => setSolicitante(e.target.value)}
                  placeholder="Email do solicitante"
                />
              </div>
              {/* Campo Chamado Externo (Opcional) */}
              <div className={styles.field}>
                <label>
                  Chamado Externo <span className={styles.optional}>(Opcional)</span>
                </label>
                <Input 
                  type="text"
                  value={chamadoExterno}
                  onChange={(e) => setChamadoExterno(e.target.value)}
                  placeholder="Número do chamado externo"
                />
              </div>
              {/* Campo Observação (Opcional) */}
              <div className={styles.field}>
                <label>
                  Observação <span className={styles.optional}>(Opcional)</span>
                </label>
                <textarea 
                  className={styles.textarea}
                  value={observation} 
                  onChange={(e) => setObservation(e.target.value)}
                  placeholder="Digite uma observação"
                />
              </div>
              <div className={styles.modalActions}>
                <Button onClick={handleCreateTicket}>
                  <CirclePlus /> Criar
                </Button>
                <Button color="danger" onClick={() => setIsModalOpen(false)}>
                  <Ban /> Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

{selectedTicket && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Detalhes do Ticket</h2>
            <div className={styles.detailGroup}>
              <p><strong>Título:</strong> {selectedTicket.title}</p>
              <p><strong>Tipo de Erro:</strong> {selectedTicket.type_error}</p>
              <p><strong>Setor:</strong> {selectedTicket.setor}</p>
              <p><strong>Solicitante:</strong> {selectedTicket.solicitante}</p>
              <p><strong>Chamado Externo:</strong> {selectedTicket.chamado_externo || 'N/A'}</p>
              <p><strong>Data:</strong> {new Date(selectedTicket.ticket_date).toLocaleString()}</p>
              <p><strong>Status:</strong> {selectedTicket.ticket_status}</p>
            </div>
            <hr/>
            <div className={styles.editGroup}>
              {/* UserSelect para atribuir um usuário ao ticket */}
              <div className={styles.field}>
                <div className={styles.center}>
                  <label>Atribuir a</label>
                  <UserSelect
                    users={users}
                    value={selectedTicket.user_id}
                    onChange={(newUserId) => console.log(newUserId)}
                    placeholder="Atribuir a"
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label>Observação</label>
                <textarea 
                  className={styles.textarea}
                  value={editableObservation}
                  onChange={(e) => setEditableObservation(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label>Status</label>
                <select 
                  className={styles.customSelect}
                  value={editableStatus}
                  onChange={(e) => setEditableStatus(e.target.value)}
                >
                  <option value="open">Aberto</option>
                  <option value="in progress">Em Andamento</option>
                  <option value="pending">Pendente</option>
                  <option value="closed">Fechado</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <Button onClick={handleUpdateTicket}>
                  <Edit /> Atualizar
                </Button>
                <Button color="danger" onClick={() => setSelectedTicket(null)}>
                  <Ban /> Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketsManager;