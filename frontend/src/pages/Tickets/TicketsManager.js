import React, { useState, useEffect } from 'react';
import UserSelect from '../../components/UserSelect/UserSelect';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import styles from './TicketsManager.module.css';
import { CirclePlus, Ban, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

function TicketsManager() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    user: '',
    search: '',
    delay: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState([]);

  // Campos para criação do ticket
  const [title, setTitle] = useState('');
  const [typeError, setTypeError] = useState('');
  const [solicitante, setSolicitante] = useState('');
  const [chamadoExterno, setChamadoExterno] = useState('');
  const [observation, setObservation] = useState('');
  const [setor, setSetor] = useState('');

  // Para modal de detalhe do ticket
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editableObservation, setEditableObservation] = useState('');
  const [editableStatus, setEditableStatus] = useState('');

  const MySwal = withReactContent(Swal);

  useEffect(() => {
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

  const getDelayInfo = (ticket) => {
    if (!ticket.ticket_date) return null;
    const ticketDate = new Date(ticket.ticket_date);
    const diffHours = (Date.now() - ticketDate.getTime()) / 3600000; // diferença em horas
    let color = null;
    // Para status open
    if(ticket.ticket_status === 'open'){
      if(diffHours > 48) color = '#dc3545'; // vermelho
      else if(diffHours > 24) color = '#ffc107'; // amarelo
    }
    // Para status pending e in progress (considerando "em espera" como in progress)
    if(ticket.ticket_status === 'pending' || ticket.ticket_status === 'in progress'){
      if(diffHours > 72) color = '#dc3545';
      else if(diffHours > 48) color = '#ffc107';
    }
    return color ? { color, delay: diffHours } : null;
  };

  const handleCreateTicket = async () => {
    const payload = {
      title, // obrigatório
      type_error: typeError, // obrigatório
      solicitante, // obrigatório
      observation, // opcional
      chamado_externo: chamadoExterno, // opcional
      setor: setor // obrigatório
    };
    if (!title || !typeError || !solicitante) {
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
        setSetor('');
        MySwal.fire({
          icon: 'success',
          title: 'Ticket criado!',
        });
      } else {
        console.error('Erro ao criar ticket');
        MySwal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao criar ticket'
        })
      }
    } catch (error) {
      console.error("Error creating ticket", error);
    }
  };

  // Filtra os tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesUser = filters.user ? String(ticket.user_id) === String(filters.user) : true;
    const matchesSearch = filters.search
      ? ticket.id?.toString().toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket.title?.toLowerCase().includes(filters.search.toLowerCase())
      : true;
    const delayInfo = getDelayInfo(ticket);
    const matchesDelay = filters.delay === ''
      ? true
      : filters.delay === 'no'
        ? !delayInfo
        : filters.delay === 'yellow'
          ? delayInfo && delayInfo.color === '#ffc107'
          : filters.delay === 'red'
            ? delayInfo && delayInfo.color === '#dc3545'
            : true;
    return matchesUser && matchesSearch && matchesDelay;
  });

  // Agrupa tickets por status
  const ticketsByStatus = filteredTickets.reduce((acc, ticket) => {
    const status = ticket.ticket_status;
    if (!acc[status]) acc[status] = [];
    acc[status].push(ticket);
    return acc;
  }, {});

  // Abre modal de detalhe
  const openTicketDetail = (ticket) => {
    setSelectedTicket(ticket);
    setEditableObservation(ticket.observation);
    setEditableStatus(ticket.ticket_status);
  };

  // Toggle seleção de ticket para deleção
  const toggleSelectTicket = (ticketId) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId)
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  async function deleteTickets(selectedTickets) {
    for (const id of selectedTickets) {
      await fetch(`/api/tickets/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
    }
  }

  // Função para deletar os tickets selecionados
  const handleDeleteTickets = async (singleId) => {
    if (singleId) {
      const confirm = await MySwal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: `Deseja realmente deletar o ticket?`,
        showCancelButton: true
      });
      if (confirm.isConfirmed) {
        await deleteTickets([singleId]);
        fetchTickets();
        MySwal.fire({
          icon: 'success',
          title: 'Ticket deletado!'
        })
        setSelectedTicket(null)
        return;
      }
    }
    if (selectedTickets.length === 0) return;
    const confirm = await MySwal.fire({
      icon: 'warning',
      title: 'Atenção',
      text: `Deseja realmente deletar ${selectedTickets.length} ticket(s)?`,
      showCancelButton: true
    });
    if (confirm.isConfirmed) {
      try {
        await deleteTickets(selectedTickets);
        // Envia DELETE para cada ticket
        setSelectedTickets([]);
        fetchTickets();
        MySwal.fire({
          icon: 'success',
          title: 'Tickets deletados!'
        });
      } catch (error) {
        MySwal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao deletar tickets'
        })
      }
    }
  };

  // Atualiza ticket (modal de detalhe)
  const handleUpdateTicket = async () => {
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
        MySwal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao atualizar ticket'
        })
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
        <div className={selectedTickets.length > 0 ? styles.deleteContainerExpanded : styles.deleteContainer}>
        <Button 
          color="danger" 
          onClick={handleDeleteTickets}
        >
          <Ban /> Deletar Selecionados ({selectedTickets.length})
        </Button>
      </div>
        <div className={styles.filters}>
          <Input 
            label=""
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Pesquisar ticket..."
            margin={{ marginBottom: '0' }}
          />
          <UserSelect 
            users={users} 
            value={filters.user} 
            onChange={(newUserId) => setFilters({ ...filters, user: newUserId })}
            placeholder="Todos Usuários"
          />
          <select
            className={styles.customSelect}
            value={filters.delay}
            onChange={(e) => setFilters({ ...filters, delay: e.target.value })}
          >
            <option value="">Todos</option>
            <option value="no">Sem Atraso</option>
            <option value="yellow">Atraso Amarelo</option>
            <option value="red">Atraso Vermelho</option>
          </select>
          <Button onClick={() => setFilters({ status: '', user: '', search: '', delay: '' })}>
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
              const assignedUser = users.find(u => String(u.id) === String(ticket.user_id));
              const delayInfo = getDelayInfo(ticket);
              return (
                <div
                  key={ticket.id}
                  className={`${styles.ticketCard} ${selectedTickets.includes(ticket.id) ? styles.selected : ''} ${delayInfo ? styles.delayed : ''}`}
                  style={ delayInfo ? { boxShadow: `0 0 8px 2px ${delayInfo.color}40` } : {} }
                >
                  {delayInfo && (
                    <div className={styles.delayIndicatorContainer}>
                      <div className={styles.delayTooltip}>
                        {Math.floor(delayInfo.delay)} horas atrasado
                      </div>
                      <div 
                        className={styles.delayIndicator} 
                        style={{ backgroundColor: delayInfo.color }}
                      ></div>
                    </div>
                  )}
                  <label 
                    className={styles.customCheckbox} 
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(ticket.id)}
                      onChange={() => toggleSelectTicket(ticket.id)}
                    />
                    <svg viewBox="0 0 64 64" height="1.2em" width="1.2em">
                      <path 
                        d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" 
                        pathLength="575.0541381835938" 
                        className={styles.path}
                      ></path>
                    </svg>
                  </label>
                  <div onClick={() => openTicketDetail(ticket)} className={styles.ticketContent}>
                    <h4><span className={styles.ticketId}>#{ticket.id}</span> - {ticket.title}</h4>
                    {assignedUser && (
                      <div className={styles.assignedUser}>
                        <img
                          src={`/media/${assignedUser.profile_picture.split('.')[0]}`}
                          alt={assignedUser.username}
                          className={styles.avatar}
                        />
                        <span>{assignedUser.username}</span>
                      </div>
                    )}
                  </div>
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
            <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleCreateTicket(); }}>
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
                <Button color="danger" onClick={() => {
                  handleDeleteTickets(selectedTicket.id)
                  }}>
                  <Trash2 /> Deletar
                </Button>
                <Button color="gray" onClick={() => setSelectedTicket(null)}>
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