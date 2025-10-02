from enum import Enum


class ObjectStatus(str, Enum):
    ORANGE = "Оранжевый"
    YELLOW = "Желтый"
    GREEN = "Зеленый"
    UNKNOWN = "Неизвестно"
