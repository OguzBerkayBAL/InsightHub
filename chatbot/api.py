from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from main import process_multilingual_query
import uvicorn
import uuid
from datetime import datetime
import traceback
import logging

# Logging ayarları
logging.basicConfig(
    level=logging.WARNING,  # OpenAI HTTP loglarını gizle
    format='%(message)s',   # Sadece mesajı göster
    handlers=[
        logging.StreamHandler(),  # Console'a yazdır
    ]
)
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)  # Sadece bizim loglarımızı göster

# OpenAI loglarını gizle
logging.getLogger("openai").setLevel(logging.WARNING)
logging.getLogger("httpx").setLevel(logging.WARNING)

# API uygulamasını oluştur
app = FastAPI(
    title="Çok Dilli Adaptif RAG API",
    description="Farklı dillerde sorguları işleyebilen ve cevapları orijinal dilde döndüren bir API",
    version="1.0.0"
)

# CORS ayarları (frontend'den istek yapabilmek için)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tüm kaynaklara izin ver (geliştirme için)
    allow_credentials=True,
    allow_methods=["*"],  # Tüm HTTP metodlarına izin ver
    allow_headers=["*"],  # Tüm başlıklara izin ver
)

# Genel hata yakalama
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": f"Beklenmeyen bir hata oluştu: {str(exc)}"}
    )

# Sohbet geçmişini saklamak için basit bir bellek içi depo
chat_sessions = {}

# Sorgu için veri modeli
class Query(BaseModel):
    question: str
    session_id: Optional[str] = None

# Mesaj modeli
class Message(BaseModel):
    role: str  # "user" veya "assistant"
    content: str
    timestamp: str

# Sohbet oturumu modeli
class ChatSession(BaseModel):
    session_id: str
    messages: List[Message] = []
    created_at: str

# Cevap için veri modeli
class Response(BaseModel):
    question: str
    generation: Optional[str] = None
    documents: Optional[list] = None
    detected_language: str
    session_id: str

# Oturum ID'si oluştur veya mevcut oturumu al
def get_or_create_session(session_id: Optional[str] = None):
    if session_id and session_id in chat_sessions:
        return chat_sessions[session_id]
    
    # Yeni oturum oluştur
    new_session_id = session_id or str(uuid.uuid4())
    chat_sessions[new_session_id] = ChatSession(
        session_id=new_session_id,
        messages=[],
        created_at=datetime.now().isoformat()
    )
    return chat_sessions[new_session_id]

@app.post("/query")
async def query(query_data: Query):
    try:
        print("\n" + "="*60)
        print(f"📝 SORGU: {query_data.question}")
        print("="*60)
        
        # Oturumu al veya oluştur
        session = get_or_create_session(query_data.session_id)
        
        # Kullanıcı mesajını oturuma ekle
        session.messages.append(Message(
            role="user",
            content=query_data.question,
            timestamp=datetime.now().isoformat()
        ))
        
        # Sorguyu işle
        result, detected_language = process_multilingual_query(query_data.question)
        
        print("="*60)
        print("✅ ISLEM TAMAMLANDI!")
        print("="*60 + "\n")
        
        # Cevabı hazırla
        response = {
            "question": query_data.question,
            "detected_language": detected_language,
            "session_id": session.session_id
        }
        
        # Sonuçları ekle
        if isinstance(result, dict):
            if "generation" in result:
                response["generation"] = result["generation"]
                
                # Asistan mesajını oturuma ekle
                session.messages.append(Message(
                    role="assistant",
                    content=result["generation"],
                    timestamp=datetime.now().isoformat()
                ))
                
            if "documents" in result:
                # Document nesnelerini serileştirilebilir hale getir
                docs = []
                for doc in result["documents"]:
                    try:
                        if hasattr(doc, "page_content"):
                            docs.append({
                                "content": doc.page_content,
                                "metadata": doc.metadata if hasattr(doc, "metadata") else {}
                            })
                        else:
                            # Eğer doc bir sözlükse doğrudan kullan
                            docs.append(doc if isinstance(doc, dict) else {"content": str(doc)})
                    except Exception as e:
                        # Belge dönüştürme hatası, yoksay ve devam et
                        print(f"Belge dönüştürme hatası: {str(e)}")
                        
                response["documents"] = docs
        
        return response
    except Exception as e:
        print(f"İşlem sırasında hata: {str(e)}")
        print(f"Hata detayı: {traceback.format_exc()}")
        
        # Hata durumunda en azından bir yanıt döndürelim
        return {
            "question": query_data.question,
            "generation": f"Üzgünüm, sorunuzu işlerken bir hata oluştu: {str(e)}",
            "documents": [],
            "detected_language": "TR",  # Varsayılan dil
            "session_id": session.session_id if 'session' in locals() else str(uuid.uuid4())
        }

@app.get("/sessions/{session_id}")
async def get_session(session_id: str):
    """Belirli bir oturumun mesaj geçmişini döndürür"""
    if session_id not in chat_sessions:
        raise HTTPException(status_code=404, detail="Oturum bulunamadı")
    
    return chat_sessions[session_id]

@app.get("/sessions")
async def list_sessions():
    """Tüm aktif oturumların listesini döndürür"""
    return [
        {"session_id": session_id, "created_at": session.created_at, "message_count": len(session.messages)}
        for session_id, session in chat_sessions.items()
    ]

@app.delete("/sessions/{session_id}")
async def delete_session(session_id: str):
    """Belirli bir oturumu siler"""
    if session_id not in chat_sessions:
        raise HTTPException(status_code=404, detail="Oturum bulunamadı")
    
    del chat_sessions[session_id]
    return {"message": "Oturum silindi", "session_id": session_id}

@app.get("/")
async def root():
    return {"message": "Çok Dilli Adaptif RAG API'sine Hoş Geldiniz!"}

@app.get("/health")
async def health_check():
    """API sağlık kontrolü"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# API'yi çalıştır
if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=False) 