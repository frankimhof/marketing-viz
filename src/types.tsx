interface DataEntryHead{
  Jahr: string;
  Fachrichtung: string;
  Geschlecht: 'Mann'|'Frau'|'Mann+Frau';
  totalNumberOfStudents: number,
}

interface DataEntryBody{
  [key: string]: number | string;
}

type PatternType = "" | "checkered" | "circles" | "diagonal-lines" | "sine";

type DataEntry = DataEntryHead & DataEntryBody;

export type {DataEntry, PatternType}
