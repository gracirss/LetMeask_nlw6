import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";


type FirebaseQuestions = Record<string,
  {
    author: { name: string, avatar: string },
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean,
    likes: Record<string, { author_id: string }>,

  }>;


type QuestionType = {
  id: string;
  author: { name: string, avatar: string },
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean,
  likeCount: number,
  likeId: string | undefined
};

type RoomType = {
  author: string,
  title: string,
  closed: boolean
}
export function useRoom(roomId: string) {
  const history = useHistory();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [room, setRoom] = useState<RoomType | undefined>(undefined);

  const { user } = useAuth();
  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on("value", room => {

      const firebaseQuestions: FirebaseQuestions = room.val().questions ?? {};
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.author_id == user?.id)?.[0]
        }
      });
      setQuestions(parsedQuestions.sort((a, b) => {
        return b["likeCount"] - a["likeCount"];
      }));
      setRoom({
        author: room.val().authorId,
        title: room.val().title,
        closed: room.val().endedAt || false
      });

    });
    return () => { roomRef.off("value") };
  },
    [roomId, user?.id]
  );

  return { questions, room };
}