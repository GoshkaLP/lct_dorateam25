from enum import Enum


class ObjectStatus(str, Enum):
    ORANGE = "Оранжевы"
    YELLOW = "Желтый"
    GREEN = "Зеленый"
    UNKNOWN = "Неизвестно"
