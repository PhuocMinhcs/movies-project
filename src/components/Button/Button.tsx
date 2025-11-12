import React from "react";
import "./Button.scss";

export type BUTTON = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const Button: React.FC<BUTTON> = ({ children, disabled = false, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="button"
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
