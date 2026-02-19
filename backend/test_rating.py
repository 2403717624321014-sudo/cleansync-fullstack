from database import SessionLocal, engine
import models
from crud import create_provider, update_provider, get_provider_by_id, delete_provider
from schemas import ProviderCreate, ProviderUpdate

models.Base.metadata.create_all(bind=engine)
db = SessionLocal()

print('--- Starting rating test ---')
# Create provider without rating (should get default 5.0)
p = ProviderCreate(name="Test Provider", email="test@example.com")
created = create_provider(db, p)
print('Created rating:', created.rating)

# Update rating to 4.2
upd = ProviderUpdate(rating=4.2)
updated = update_provider(db, created.id, upd)
print('Updated rating (returned):', updated.rating)

# Fetch again to verify
prov = get_provider_by_id(db, created.id)
print('Verified rating:', prov.rating)

# Cleanup
delete_provider(db, created.id)
print('--- Done ---')

db.close()