import { useHistory } from 'react-router-dom'
import { FormEvent, useState } from 'react';

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { database } from '../services/firebase';

import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

import '../styles/auth.scss';
import { Col, Container, Row } from 'react-bootstrap';

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth()
  const [roomCode, setRoomCode] = useState('');
  const { theme, toggleTheme } = useTheme()

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle()
    }

    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert('Room does not exists.');
      return;
    }

    if (roomRef.val().endedAt) {
      alert('Esta sala foi fechada.')
      return
    }

    history.push(`/rooms/${roomCode}`);
  }


  return (
    <Container fluid>
        <div id="page-auth" className={theme}>
          <Col xs={12} sm={6}>
            <aside>
              <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
              <strong>Crie salas de Q&amp;A ao-vivo</strong>
              <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
          </Col>
          <Col xs={12} sm={6}>
            <main>
              <div className="main-content">
                {/* <button onClick={toggleTheme}>Trocar</button> */}
                <img src={logoImg} alt="Letmeask" />
                <button onClick={handleCreateRoom} className="create-room">
                  <img src={googleIconImg} alt="Logo do Google" />
                  Crie sua sala com o Google
                </button>
                <div className="separator">ou entre em uma sala</div>
                <form onSubmit={handleJoinRoom}>
                  <input
                    type="text"
                    placeholder="Digite o código da sala"
                    onChange={event => setRoomCode(event.target.value)}
                    value={roomCode}
                  />
                  <Button type="submit">
                    Entrar na sala
                  </Button>
                </form>
              </div>
            </main>
          </Col>
        </div>
    </Container>
  )
}