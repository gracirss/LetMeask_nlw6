import ilustracao from "../assets/images/illustration.svg";
import logo from "../assets/images/logo.svg";
import "../styles/auth.scss";
import { Button } from "../components/Button";
import { Link, useHistory } from "react-router-dom";
import { FormEvent, useState } from "react";
import userEvent from "@testing-library/user-event";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";
import { useTheme } from "../hooks/useTheme";

export function NewRoom() {
  const { user } = useAuth();
  const [newRoom, setNewRoom] = useState('');
  const history = useHistory();
  const { theme } = useTheme();

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();
    if (newRoom.trim() == "") {
      return;
    }

    const roomRef = database.ref('rooms');
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });
    history.push(`/rooms/${firebaseRoom.key}`);
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
          <h2>Crie sua sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Digite o nome da sala"
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>Quer entrar em uma sala existente?
            <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}