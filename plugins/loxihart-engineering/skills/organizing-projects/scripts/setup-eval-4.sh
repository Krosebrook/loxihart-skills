#!/bin/bash
set -euo pipefail

# Eval 4: Python Naming Chaos
# A Python project with mixed conventions violating PEP 8

DIR="${1:-.}/python-naming-chaos"
rm -rf "$DIR"
mkdir -p "$DIR"
cd "$DIR"

git init -q

cat > .gitignore << 'EOF'
__pycache__/
*.pyc
.env
venv/
dist/
*.egg-info/
EOF

cat > pyproject.toml << 'EOF'
[project]
name = "naming-chaos"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = ["fastapi", "sqlalchemy", "pydantic"]

[tool.pytest.ini_options]
testpaths = ["tests"]
EOF

cat > README.md << 'EOF'
# Naming Chaos
A Python project with inconsistent naming.
EOF

# PascalCase directory (wrong for Python)
mkdir -p src/NamingChaos/API
mkdir -p src/NamingChaos/Models
mkdir -p src/NamingChaos/Services
mkdir -p src/NamingChaos/Utils

# __init__.py files
touch src/NamingChaos/__init__.py
touch src/NamingChaos/API/__init__.py
touch src/NamingChaos/Models/__init__.py
touch src/NamingChaos/Services/__init__.py
touch src/NamingChaos/Utils/__init__.py

# camelCase files (wrong for Python)
cat > src/NamingChaos/API/userRoutes.py << 'EOF'
from NamingChaos.Services.userService import UserService
from NamingChaos.Models.userModel import User

def get_users():
    svc = UserService()
    return svc.get_all()
EOF

cat > src/NamingChaos/API/authRoutes.py << 'EOF'
from NamingChaos.Services.authService import AuthService

def login(username, password):
    return AuthService().authenticate(username, password)
EOF

# camelCase model files
cat > src/NamingChaos/Models/userModel.py << 'EOF'
from pydantic import BaseModel

class User(BaseModel):
    id: str
    name: str
    email: str
EOF

cat > src/NamingChaos/Models/authModel.py << 'EOF'
from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str
EOF

# camelCase service files
cat > src/NamingChaos/Services/userService.py << 'EOF'
from NamingChaos.Models.userModel import User

class UserService:
    def get_all(self):
        return []

    def create(self, data):
        return User(id="1", name=data["name"], email=data["email"])
EOF

cat > src/NamingChaos/Services/authService.py << 'EOF'
class AuthService:
    def authenticate(self, username, password):
        return {"token": "fake-token"}
EOF

# Some correctly named files (snake_case) — proving inconsistency
cat > src/NamingChaos/Utils/date_helpers.py << 'EOF'
from datetime import datetime

def format_date(d: datetime) -> str:
    return d.isoformat()
EOF

cat > src/NamingChaos/Utils/stringHelpers.py << 'EOF'
def capitalize_name(name: str) -> str:
    return name.title()
EOF

# snake_case main entry (correct)
cat > src/NamingChaos/main.py << 'EOF'
from NamingChaos.API.userRoutes import get_users
from NamingChaos.API.authRoutes import login

if __name__ == "__main__":
    print(get_users())
EOF

# Tests directory — also mixed naming
mkdir -p tests
cat > tests/test_users.py << 'EOF'
from NamingChaos.Services.userService import UserService

def test_get_all():
    svc = UserService()
    assert svc.get_all() == []
EOF

cat > tests/testAuth.py << 'EOF'
from NamingChaos.Services.authService import AuthService

def test_auth():
    svc = AuthService()
    result = svc.authenticate("admin", "pass")
    assert "token" in result
EOF

git add -A
git commit -q -m "initial commit"

echo "✅ Eval 4 repo created at $DIR"
