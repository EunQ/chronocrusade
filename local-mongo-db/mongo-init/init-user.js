db = db.getSiblingDB('auth'); // 원하는 DB명으로 변경 가능

db.users.insertMany([
  { id: 'user1', roles: ['user'] },
  { id: 'user2', roles: ['user'] },
  { id: 'user3', roles: ['user'] },
  { id: 'user4', roles: ['user'] },
  { id: 'user5', roles: ['user'] },

  { id: 'admin1', roles: ['admin'] },

  { id: 'operator1', roles: ['operator'] },

  { id: 'auditor1', roles: ['auditor'] },
]);
