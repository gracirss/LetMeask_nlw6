import logoImg from "../assets/images/logo.svg";
import { RoomCode } from "./RoomCode";

import "../styles/header.scss";
import { useHistory } from "react-router-dom";
import { ReactNode } from "react";


type HeaderProps = {
  roomId: string,
  children?: ReactNode,
};
export function Header(props: HeaderProps) {

  const history = useHistory();

  function homeNavigator() {
    history.push("/");
  }

  return (
    <header>
      <div className="content">
        <img src={logoImg} alt="Letmeask" onClick={() => homeNavigator()} />
        <div>
          {props.children}
          <RoomCode code={props.roomId} />
        </div>
      </div>
    </header>
  );
}