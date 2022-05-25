import json

import pytest

from src.schemas.status import Status


@pytest.mark.asyncio
async def test_query(client, db_task):
    query = """
        query getTasks {
            tasks {
                id
                index
                isArchive
                status
                title
            }
        }
    """
    response = client.post("/graphql", json={"query": query})

    data = json.loads(response._content)["data"]
    print(data)
    assert response.status_code == 200
    assert len(data["tasks"]) == 1


@pytest.mark.asyncio
async def test_mutation(client, db_task):
    title = "友達にメール"
    query = """
        mutation addTask($title: String!, $index:  Int!) {
          addTask(task: {title: $title, index: $index}) {
            id
            index
            title
            status
            isArchive
          }
        }
    """
    variables = {"title": title, "index": 5}

    response = client.post("/graphql", json={"query": query, "variables": variables})

    data = json.loads(response._content)["data"]["addTask"]
    assert response.status_code == 200
    assert data["id"]
    assert data["title"] == title
    assert data["index"] == 5
    assert data["status"] == Status.not_started
    assert data["isArchive"] is False
