import ilustracao from "../assets/images/illustration.svg";
import googleIcon from "../assets/images/google-icon.svg";
import logo from "../assets/images/logo.svg";
import "../styles/auth.scss";
import { Button } from "../components/Button";
import { useHistory } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FormEvent, useState } from "react";
import { database } from "../services/firebase";
import { useTheme } from "../hooks/useTheme";
export function Home() {

  //type roomCode = {};
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');
  const { theme, toggleTheme } = useTheme();

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }
    history.push("/rooms/new");
  }
  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();
    if (roomCode.trim() == "") {
      return;
    }
    const roomRef = await database.ref(`rooms/${roomCode}`).get();
    if (!roomRef.exists()) {
      alert("Código de sala inválido");
      return;
    }

    if (roomRef.val().endedAt) {
      alert("Sala encerrada");
      return;
    }

    if (roomRef.val().authorId == user?.id) {
      history.push(`/admin/rooms/${roomCode}`);
    }
    else {
      history.push(`/rooms/${roomCode}`);
    }



  }


  return (
    <div id="page-auth" className={theme}>
      <aside>
        <img src={ilustracao} alt="Ilustração que representa perguntas e respostas" />
        <strong>Crie sua sala</strong>
        <p>Tire suas dúvidas em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logo} alt="Logo Letmeask" />

          <button className="create-room" onClick={handleCreateRoom} >
            <img src={googleIcon} alt="Logo do Google" />
            Crie sua sala
          </button>

          <div className="separator">ou entre numa sala</div>
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
          <div className="switch_theme" title="Alterar tema">
            <label className="switch">
              <input type="checkbox" onClick={() => toggleTheme()}
                checked={theme == "dark"}
              />
              <span className="slider round"> </span>
            </label>
            <span>{theme}</span>
          </div>
        </div>
      </main>
    </div>
  );
}