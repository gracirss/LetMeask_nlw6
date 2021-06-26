import { useHistory, useParams } from "react-router-dom";
import { database } from "../services/firebase";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";
import { useAuth } from "../hooks/useAuth";
import deleteImg from "../assets/images/delete.svg";
import answerImg from "../assets/images/answer.svg";
import checkImg from "../assets/images/check.svg";
import "../styles/room.scss";
import { useEffect } from "react";
import { useTheme } from "../hooks/useTheme";

type RoomParams = { id: string };

export function AdminRoom() {
  const history = useHistory();
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const { questions, room } = useRoom(params.id);
  const { theme } = useTheme();


  async function handleQuestionDelete(questionId: string) {
    if (user?.id != room?.author) {
      alert("Você não é o administrador da sala");
      return;
    }
    if (window.confirm("Tem certeza que deseja excluir?")) {
      await database.ref(`rooms/${params.id}/questions/${questionId}`).remove();
    }
  }

  async function handleRoomClose(roomId: string) {
    if (user?.id != room?.author) {
      alert("Você não é o administrador da sala");
      return;
    }
    if (window.confirm("Tem certeza que deseja encerrar a sala?")) {
      await database.ref(`rooms/${params.id}`).update({ endedAt: new Date() });
      history.push("/");
    }
  }
  async function handleAnswerQuestion(questionId: string) {
    if (user?.id != room?.author) {
      alert("Você não é o administrador da sala");
      return;
    }
    await database.ref(`rooms/${params.id}/questions/${questionId}`).update({ isHighlighted: true });

  }
  async function handleAnsweredQuestion(questionId: string) {
    if (user?.id != room?.author) {
      alert("Você não é o administrador da sala");
      return;
    }
    await database.ref(`rooms/${params.id}/questions/${questionId}`).update({ isHighlighted: false, isAnswered: true });

  }


  return (
    <div id="page-room" className={theme}>
      <Header roomId={params.id}>
        <Button disabled={room?.closed} isOutLined onClick={() => handleRoomClose(params.id)}>Encerrar sala</Button>
      </Header>
      <main className="content">
        <div className="room-title">
          <h1>Sala {room?.title} {room?.closed && '[ENCERRADA]'}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isHighlighted={question.isHighlighted}
                isAnswered={question.isAnswered}
              >
                {!question.isAnswered && (
                  <>
                    <button type="button" onClick={() => handleAnsweredQuestion(question.id)}>
                      <img src={checkImg} alt="Marcar pergunta como respondida" />
                    </button>
                    <button type="button" onClick={() => handleAnswerQuestion(question.id)}>
                      <img src={answerImg} alt="Destacar pergunta" />
                    </button>
                  </>
                )}
                <button type="button" onClick={() => handleQuestionDelete(question.id)}>
                  <img src={deleteImg} alt="Excluir pergunta" />
                </button>
              </Question>
            );
          }

          )}
        </div>
      </main>
    </div>

  );
}