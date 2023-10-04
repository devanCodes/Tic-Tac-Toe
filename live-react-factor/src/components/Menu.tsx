// This Menu component is a UI component that provides a dropdown-style menu with actions to the user. It allows users to interact with your application by selecting specific actions like resetting the game or starting a new round.

import "./Menu.css";
import { useState } from "react";
import classNames from "classnames";

// Here, you define a TypeScript type called Props. This type represents the props (properties) that your Menu component expects to receive:
// onAction: A function that takes a single parameter action, which can only be one of two string values: "reset" or "new-round." The function has a return type of void.
type Props = {
  onAction(action: "reset" | "new-round"): void;
};

// This is the main function for your Menu component, which is exported as the default export. It takes in the props defined in the Props type.
export default function Menu({ onAction }: Props) {
  // Here, you use the useState hook to initialize a state variable menuOpen with an initial value of false. This state variable will be used to control whether the menu is open or closed.
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="menu">
      <button className="menu-btn" onClick={() => setMenuOpen((prev) => !prev)}>
        Actions
        <i
          className={classNames(
            "fa-solid",
            menuOpen ? "fa-chevron-up" : "fa-chevron-down"
          )}
        ></i>
      </button>

      {menuOpen && (
        <div className="items border">
          <button onClick={() => onAction("reset")}>Reset</button>
          <button onClick={() => onAction("new-round")}>New Round</button>
        </div>
      )}
    </div>
  );
}
