from enum import Enum

from pydantic import BaseModel


class ColumnType(str, Enum):
    numeric = "numeric"
    categorical = "categorical"
    date = "date"


class CsvColumnSchema(BaseModel):
    name: str
    type: ColumnType
    sample_values: list[str]


class CsvDatasetResponse(BaseModel):
    dataset_id: str
    filename: str
    row_count: int
    columns: list[CsvColumnSchema]
