import "./Modal.css";

// defining a TypeScript type called Props. This type represents the props (properties) that your Modal component expects to receive:
// message: A string that represents the message to be displayed in the modal
// onClick: A function that takes no parameters and has a return type of void. This function is a callback to be executed when the "Play again" button is clicked.
type Props = {
    message: string;
    onClick(): void
}

// This is the main function for your Modal component, which is exported as the default export. It takes in the props defined in the Props type.
export default function Modal({ message, onClick }: Props) {
  return (
    <div className="modal">
      <div className="modal-contents">
        <p>{message}</p>
        <button onClick={onClick}>Play again</button>
      </div>
    </div>
  );
}
