export type GENRE = {
  id: number;
  name: string;
};

export type MAPPING_GENRE = {
  [key: number]: string;
};

export type Metadata = {
  page: number;
  totalPage: number;
  totalResult: number;
};

export type FilterData = { text: string; genres: OPTION[] };

export type FILTER = {
  genres: OPTION[];
  onConfirm?: (data: FilterData) => void;
};

export type OPTION = {
  label: string;
  value: string | number;
};

export type SELECT = {
  options: OPTION[];
  placeHolder?: string;
  value?: string | number | null;
  multiple?: boolean;
  onSelect?: (data: OPTION[]) => void;
};
