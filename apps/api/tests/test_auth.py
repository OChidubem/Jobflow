def test_register_success(client):
    resp = client.post("/auth/register", json={"email": "new@example.com", "password": "Password1"})
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == "new@example.com"
    assert "id" in data


def test_register_duplicate_email(client, registered_user):
    resp = client.post(
        "/auth/register", json={"email": registered_user["email"], "password": "Password1"}
    )
    assert resp.status_code == 400
    assert "already registered" in resp.json()["detail"]


def test_register_weak_password_too_short(client):
    resp = client.post("/auth/register", json={"email": "a@b.com", "password": "short"})
    assert resp.status_code == 422


def test_register_weak_password_no_uppercase(client):
    resp = client.post("/auth/register", json={"email": "a@b.com", "password": "password1"})
    assert resp.status_code == 422


def test_register_weak_password_no_digit(client):
    resp = client.post("/auth/register", json={"email": "a@b.com", "password": "Password"})
    assert resp.status_code == 422


def test_login_success(client, registered_user):
    resp = client.post(
        "/auth/login",
        data={"username": registered_user["email"], "password": registered_user["password"]},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client, registered_user):
    resp = client.post(
        "/auth/login",
        data={"username": registered_user["email"], "password": "WrongPass1"},
    )
    assert resp.status_code == 401


def test_login_unknown_email(client):
    resp = client.post(
        "/auth/login", data={"username": "nobody@example.com", "password": "Password1"}
    )
    assert resp.status_code == 401


def test_login_json(client, registered_user):
    resp = client.post(
        "/auth/login-json",
        json={"email": registered_user["email"], "password": registered_user["password"]},
    )
    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_me(client, auth_headers, registered_user):
    resp = client.get("/auth/me", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["email"] == registered_user["email"]


def test_me_no_token(client):
    resp = client.get("/auth/me")
    assert resp.status_code == 401


def test_logout(client, auth_headers, mock_redis):
    resp = client.post("/auth/logout", headers=auth_headers)
    assert resp.status_code == 204
    mock_redis.setex.assert_called_once()


def test_logout_invalidates_token(client, auth_headers, mock_redis):
    client.post("/auth/logout", headers=auth_headers)
    mock_redis.exists.return_value = 1
    resp = client.get("/auth/me", headers=auth_headers)
    assert resp.status_code == 401
