from typing import Optional, Dict, Any
import os
import json
from abc import ABC, abstractmethod

class SecretsManager(ABC):
    """Abstract base class for secrets management"""
    
    @abstractmethod
    async def get_secret(self, key: str) -> Optional[str]:
        """Get secret by key"""
        pass
    
    @abstractmethod
    async def set_secret(self, key: str, value: str) -> bool:
        """Set secret"""
        pass
    
    @abstractmethod
    async def delete_secret(self, key: str) -> bool:
        """Delete secret"""
        pass


class VaultSecretsManager(SecretsManager):
    """HashiCorp Vault secrets manager"""
    
    def __init__(self, vault_url: str, vault_token: str):
        self.vault_url = vault_url
        self.vault_token = vault_token
        self.mount_point = "secret"
    
    async def get_secret(self, key: str) -> Optional[str]:
        """Get secret from Vault"""
        import httpx
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.vault_url}/v1/{self.mount_point}/data/{key}",
                    headers={"X-Vault-Token": self.vault_token}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data.get("data", {}).get("data", {}).get("value")
        except Exception as e:
            print(f"Error fetching secret from Vault: {e}")
        
        return None
    
    async def set_secret(self, key: str, value: str) -> bool:
        """Set secret in Vault"""
        import httpx
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.vault_url}/v1/{self.mount_point}/data/{key}",
                    headers={"X-Vault-Token": self.vault_token},
                    json={"data": {"value": value}}
                )
                
                return response.status_code in [200, 204]
        except Exception as e:
            print(f"Error setting secret in Vault: {e}")
        
        return False
    
    async def delete_secret(self, key: str) -> bool:
        """Delete secret from Vault"""
        import httpx
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.delete(
                    f"{self.vault_url}/v1/{self.mount_point}/data/{key}",
                    headers={"X-Vault-Token": self.vault_token}
                )
                
                return response.status_code in [200, 204]
        except Exception as e:
            print(f"Error deleting secret from Vault: {e}")
        
        return False


class FirebaseSecretsManager(SecretsManager):
    """Firebase secrets manager using Google Secret Manager"""
    
    def __init__(self, project_id: str):
        self.project_id = project_id
        self._client = None
    
    def _get_client(self):
        """Lazy load Secret Manager client"""
        if not self._client:
            from google.cloud import secretmanager
            self._client = secretmanager.SecretManagerServiceClient()
        return self._client
    
    async def get_secret(self, key: str) -> Optional[str]:
        """Get secret from Google Secret Manager"""
        try:
            client = self._get_client()
            name = f"projects/{self.project_id}/secrets/{key}/versions/latest"
            response = client.access_secret_version(request={"name": name})
            return response.payload.data.decode("UTF-8")
        except Exception as e:
            print(f"Error fetching secret from Firebase: {e}")
        
        return None
    
    async def set_secret(self, key: str, value: str) -> bool:
        """Set secret in Google Secret Manager"""
        try:
            client = self._get_client()
            parent = f"projects/{self.project_id}"
            
            # Create secret if it doesn't exist
            try:
                secret = client.create_secret(
                    request={
                        "parent": parent,
                        "secret_id": key,
                        "secret": {"replication": {"automatic": {}}},
                    }
                )
            except:
                pass  # Secret already exists
            
            # Add secret version
            secret_name = f"{parent}/secrets/{key}"
            client.add_secret_version(
                request={
                    "parent": secret_name,
                    "payload": {"data": value.encode("UTF-8")},
                }
            )
            return True
        except Exception as e:
            print(f"Error setting secret in Firebase: {e}")
        
        return False
    
    async def delete_secret(self, key: str) -> bool:
        """Delete secret from Google Secret Manager"""
        try:
            client = self._get_client()
            name = f"projects/{self.project_id}/secrets/{key}"
            client.delete_secret(request={"name": name})
            return True
        except Exception as e:
            print(f"Error deleting secret from Firebase: {e}")
        
        return False


class EnvironmentSecretsManager(SecretsManager):
    """Fallback secrets manager using environment variables"""
    
    def __init__(self):
        self._secrets: Dict[str, str] = {}
    
    async def get_secret(self, key: str) -> Optional[str]:
        """Get secret from environment or cache"""
        if key in self._secrets:
            return self._secrets[key]
        return os.getenv(key)
    
    async def set_secret(self, key: str, value: str) -> bool:
        """Set secret in cache"""
        self._secrets[key] = value
        return True
    
    async def delete_secret(self, key: str) -> bool:
        """Delete secret from cache"""
        if key in self._secrets:
            del self._secrets[key]
            return True
        return False


# Factory function to create appropriate secrets manager
def get_secrets_manager() -> SecretsManager:
    """Get secrets manager based on configuration"""
    secrets_backend = os.getenv("SECRETS_BACKEND", "environment")
    
    if secrets_backend == "vault":
        vault_url = os.getenv("VAULT_URL")
        vault_token = os.getenv("VAULT_TOKEN")
        if vault_url and vault_token:
            return VaultSecretsManager(vault_url, vault_token)
    
    elif secrets_backend == "firebase":
        project_id = os.getenv("FIREBASE_PROJECT_ID")
        if project_id:
            return FirebaseSecretsManager(project_id)
    
    # Default to environment variables
    return EnvironmentSecretsManager()


# Global secrets manager instance
secrets_manager = get_secrets_manager()
