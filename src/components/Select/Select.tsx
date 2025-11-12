import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { OPTION, SELECT } from "../../utils/types";
import "./Select.scss";

const Select: React.FC<SELECT> = ({
  options,
  placeHolder,
  value,
  multiple = true,
  onSelect = () => {},
}) => {
  const isDirty = useRef<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<any[]>([]);

  const handleOpenOption = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handleItemClick: (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    item: OPTION
  ) => void = useCallback(
    (e, item) => {
      e.stopPropagation();
      isDirty.current = true;

      if (multiple) {
        if (selected.includes(item.value as any)) {
          return setSelected(selected.filter((p) => p !== item.value));
        }
        return setSelected([...selected, item.value as any]);
      }

      setSelected([item.value as any]);
      setOpen(false);
    },
    [multiple, selected]
  );

  const displayText = useMemo(() => {
    if (!selected.length) return placeHolder;

    return options
      .filter((op) => selected.includes(op.value as any))
      .map((op) => op.label)
      .join(", ");
  }, [selected, placeHolder, options]);

  useEffect(() => {
    if (isDirty.current)
      onSelect(options.filter((op) => selected.includes(op.value as any)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div className="select" onClick={handleOpenOption}>
      <div className={`value${selected.length > 0 ? " has-value" : ""}`}>
        {displayText}
      </div>
      <div className={`options${open ? " show" : ""}`}>
        <ul>
          {options.map((op: OPTION) => (
            <li
              key={op.value}
              className={
                selected.includes(op.value as number) ? "selected" : ""
              }
              onClick={(e) => handleItemClick(e, op)}
            >
              {op.label}
            </li>
          ))}
        </ul>
      </div>

      {open && <div className={`option-overlay${open ? " show" : ""}`} />}
    </div>
  );
};

export default Select;
