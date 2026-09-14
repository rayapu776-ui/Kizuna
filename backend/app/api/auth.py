from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.consent import ConsentSetting
from backend.app.schemas.user import UserCreate, UserLogin, UserResponse, Token

SECRET_KEY = "kizuna-secure-secret-key-for-social-withdrawal-bridge"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

import bcrypt

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    # If no token provided or demo mode, return default youth user (Ren Sato)
    if not token:
        user = db.query(User).filter(User.username == "ren_sato").first()
        if user:
            return user
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter((User.email == user_in.email) | (User.username == user_in.username)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already registered")
        
    user = User(
        email=user_in.email,
        username=user_in.username,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role,
        age=user_in.age,
        is_minor=user_in.is_minor,
        population_type=user_in.population_type,
        linked_user_id=user_in.linked_user_id
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # If user is youth, create default consent settings
    if user.role == "youth":
        consent = ConsentSetting(youth_id=user.id, caregiver_id=user.linked_user_id)
        db.add(consent)
        db.commit()

    token = create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.post("/login", response_model=Token)
def login(creds: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == creds.username).first()
    if not user or not verify_password(creds.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
        
    token = create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/switch-demo-role/{role}", response_model=Token)
def switch_demo_role(role: str, db: Session = Depends(get_db)):
    """
    Seamless role switcher for hackathon evaluation:
    role: "youth" (Ren Sato), "caregiver" (Mrs. Keiko Sato), "clinician" (Dr. Takahashi), "elderly" (Mrs. Tanaka)
    """
    role_map = {
        "youth": "ren_sato",
        "caregiver": "keiko_sato",
        "clinician": "dr_takahashi",
        "elderly": "mrs_tanaka"
    }
    target_username = role_map.get(role.lower(), "ren_sato")
    user = db.query(User).filter(User.username == target_username).first()
    if not user:
        # Fallback to any user matching role
        user = db.query(User).filter(User.role == role.lower()).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"Demo profile for {role} not found")
        
    token = create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}
