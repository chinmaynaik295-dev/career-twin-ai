import logging
import asyncio
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from app.core.config import settings

logger = logging.getLogger(__name__)

# Fallback In-Memory Async Data Store for resilient local operation
class MemoryCollection:
    def __init__(self, name: str):
        self.name = name
        self.documents: Dict[str, Dict[str, Any]] = {}
        self._id_counter = 1

    async def find_one(self, filter: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        for doc in self.documents.values():
            match = True
            for k, v in filter.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                return dict(doc)
        return None

    async def find(self, filter: Optional[Dict[str, Any]] = None, sort: Optional[List] = None) -> List[Dict[str, Any]]:
        results = []
        filter = filter or {}
        for doc in self.documents.values():
            match = True
            for k, v in filter.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                results.append(dict(doc))
        
        if sort:
            key, direction = sort[0]
            results.sort(key=lambda x: x.get(key, ""), reverse=(direction < 0))
            
        return results

    async def insert_one(self, document: Dict[str, Any]):
        doc = dict(document)
        if "_id" not in doc:
            doc["_id"] = f"{self.name}_{self._id_counter}_{int(datetime.now().timestamp()*1000)}"
            self._id_counter += 1
        self.documents[str(doc["_id"])] = doc
        class InsertResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        return InsertResult(doc["_id"])

    async def update_one(self, filter: Dict[str, Any], update: Dict[str, Any], upsert: bool = False):
        target_id = None
        for doc_id, doc in self.documents.items():
            match = True
            for k, v in filter.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                target_id = doc_id
                break
        
        if target_id:
            doc = self.documents[target_id]
            if "$set" in update:
                doc.update(update["$set"])
            if "$push" in update:
                for k, v in update["$push"].items():
                    if k not in doc:
                        doc[k] = []
                    doc[k].append(v)
            self.documents[target_id] = doc
        elif upsert:
            new_doc = dict(filter)
            if "$set" in update:
                new_doc.update(update["$set"])
            await self.insert_one(new_doc)

    async def delete_one(self, filter: Dict[str, Any]):
        target_id = None
        for doc_id, doc in self.documents.items():
            match = True
            for k, v in filter.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                target_id = doc_id
                break
        if target_id and target_id in self.documents:
            del self.documents[target_id]


class Database:
    def __init__(self):
        self.is_connected = False
        self.is_mock = True
        self.client = None
        self.db = None
        self.collections: Dict[str, Any] = {
            "users": MemoryCollection("users"),
            "career_profiles": MemoryCollection("career_profiles"),
            "career_paths": MemoryCollection("career_paths"),
            "simulations": MemoryCollection("simulations"),
            "roadmaps": MemoryCollection("roadmaps"),
            "conversations": MemoryCollection("conversations"),
            "progress_records": MemoryCollection("progress_records"),
        }

    async def connect(self):
        if settings.MONGODB_URL and not settings.FORCE_MOCK_DB:
            try:
                import motor.motor_asyncio
                self.client = motor.motor_asyncio.AsyncIOMotorClient(
                    settings.MONGODB_URL,
                    serverSelectionTimeoutMS=2500
                )
                self.db = self.client[settings.DATABASE_NAME]
                # Test connection
                await self.client.admin.command('ping')
                self.is_connected = True
                self.is_mock = False
                logger.info(f"Connected to MongoDB Atlas: {settings.DATABASE_NAME}")
                return
            except Exception as e:
                logger.warning(f"Could not connect to MongoDB Atlas ({e}). Falling back to Local Resilient Database.")
        
        self.is_mock = True
        self.is_connected = True
        logger.info("Operating in Local Resilient Store Mode with in-memory database store.")

    def get_collection(self, name: str):
        if not self.is_mock and self.db is not None:
            return self.db[name]
        if name not in self.collections:
            self.collections[name] = MemoryCollection(name)
        return self.collections[name]

db = Database()

