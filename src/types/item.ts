export interface Division {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  image: string;
  name: string;
  phone: string;
  division: Division;
  position: string;
}