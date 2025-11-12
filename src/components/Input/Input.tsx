import React, { InputHTMLAttributes, useCallback } from "react";
import "./Input.scss";

type INPUT = {
  label?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<INPUT> = ({
  label = "",
  type = "text",
  onChange = () => {},
  ...rest
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="input">
      {label && <label htmlFor="input-id">{label}</label>}
      <input type={type} onChange={handleChange} {...rest} id="input-id" />
    </div>
  );
};

export default Input;
