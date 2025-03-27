import React, { useState, useEffect } from 'react';
import { getCookie } from '../../utils/cookies';
import styles from './Config.module.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useNavigate } from 'react-router';


function Config() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  const MySwal = withReactContent(Swal)

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
        console.log(process.env);
      const userCookie = getCookie('user');
      if (userCookie) {
        try {
          const user = JSON.parse(userCookie);
          setUsername(user.username || '');
          setEmail(user.email || '');
          // Define a url para exibir a imagem: pega de 'profile_picture' ou usa 'default.jpg'
          const pic = user.profile_picture || 'default.jpg';
          setPreviewUrl(`/media/${pic.split('.')[0]}`);
          clearInterval(interval);
        } catch (error) {
          console.error("Erro ao converter o cookie 'user':", error);
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePictureFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (e) => {
    MySwal.fire({
      icon: 'info',
      title: 'Certeza?',
      text: 'Deseja realmente deletar o usuário?',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('email', email);
        try {
          const response = fetch('/api/deleteUser', {
            method: 'DELETE',
            credentials: 'include',
            body: formData,
          });
            response.then((res) => {
            if (res.ok) {
              MySwal.fire({
              title: 'Sucesso!',
              text: 'Usuário deletado com sucesso!',
              icon: 'success'
              });
              document.cookie = 'user=; path=/';
              navigate('/');
            } else {
              MySwal.fire({
              title: 'Erro!',
              text: 'Erro ao deletar o usuário!',
              icon: 'error'
              });
            }
            }).catch((error) => {
            console.error('Erro na resposta:', error);
            MySwal.fire({
              title: 'Erro!',
              text: 'Erro ao processar a solicitação!',
              icon: 'error'
            });
            });
        }
        catch (error) {
          console.error(error);
          alert('Erro ao deletar o usuário');
        }
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    if (profilePictureFile) {
      formData.append('profile_picture', profilePictureFile);
    }

    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (response.ok) {
        const updatedUser = await response.json();
        // Atualiza o cookie para refletir as alterações
        document.cookie = `user=${JSON.stringify(updatedUser)}; path=/`;
        MySwal.fire({
          title: 'Sucesso!',
          text: 'Configurações atualizadas com sucesso!',
          icon: 'success'
        })
      } else {
        MySwal.fire({
          title: 'Erro!',
          text: 'Erro ao atualizar as configurações!',
          icon: 'error'
        })
      }
    } catch (error) {
      console.error(error);
      alert('Erro no envio dos dados');
    }
  };

  return (
    <div className={styles.configContainer}>
      <h1>Configurações do Usuário</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="username">Nome de Usuário:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="profile_picture">Foto de Perfil:</label>
          <input
            type="file"
            id="profile_picture"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        {previewUrl && (
          <div className={styles.preview}>
            <img src={previewUrl} alt="Preview" />
          </div>
        )}
        <button type="submit" className={styles.submitButton}>
          Salvar Configurações
        </button>
        <button type="button" onClick={handleDelete} className={styles.deleteButton}>
          Deletar Usuário
        </button>
      </form>
    </div>
  );
}

export default Config;