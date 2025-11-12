import React, { useCallback, useState } from "react";
import Input from "../Input/Input";
import Select from "../Select/Select";
import { FILTER, FilterData } from "../../utils/types";
import Button from "../Button/Button";
import "./Filter.scss";

const Filter: React.FC<FILTER> = ({ genres, onConfirm = () => {} }) => {
  const [filter, setFilter] = useState<FilterData>({
    text: "",
    genres: [],
  });

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilter({
        ...filter,
        text: e.target.value,
      });
    },
    [filter]
  );

  const handleSelectChange = useCallback(
    (genres: any[]) => {
      setFilter({
        ...filter,
        genres,
      });
    },
    [filter]
  );

  const handleClickFilter = useCallback(() => {
    onConfirm(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div className="filter">
      <p>Filter movie:</p>
      <Input placeholder="Enter movie name" onChange={handleInputChange} />
      <Select
        options={genres}
        placeHolder="Select Genres"
        onSelect={handleSelectChange}
      />

      <Button onClick={handleClickFilter}>Filter</Button>
    </div>
  );
};

export default Filter;
