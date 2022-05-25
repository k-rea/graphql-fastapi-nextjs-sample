import os


def test_ping(client):
    response = client.get("/ping")
    data = response.json()

    assert response.status_code == 200
    assert data["testing"]
    assert data["ping"] == "pong"
    assert data["environment"] == "dev"
    assert data["database_url"] == os.getenv("DATABASE_TEST_URL")
