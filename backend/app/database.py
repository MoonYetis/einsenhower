import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql+asyncpg://eisenhower:eisenhower_pass@db:5432/eisenhower_db"
)

# Crear el motor asíncrono para PostgreSQL
engine = create_async_engine(DATABASE_URL, echo=True, future=True)

# Creador de sesiones asíncronas
async_session = async_sessionmaker(
    bind=engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

# Dependencia para obtener la sesión de base de datos de manera limpia en FastAPI
async def get_db():
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
