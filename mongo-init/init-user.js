db = db.getSiblingDB('auth'); // 원하는 DB명으로 변경 가능

db.users.insertOne({
  id: "test",
  roles: ["user", "admin"]
});