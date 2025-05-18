db = db.getSiblingDB('game'); // 원하는 DB명으로 변경 가능

db.events.insertMany([
  {
    name: '5일 연속 로그인 보상',
    description: '5일간 로그인하면 보상을 드립니다.',
    conditions: [{ type: 'LOGIN_COUNT', loginCount: 5 }],
    reward: {
      gold: 500,
      exp: 100,
    },
    startDate: new Date('2025-06-01T00:00:00Z'),
    endDate: new Date('2025-06-30T23:59:59Z'),
    isActive: true,
    version: 1,
    lastModifiedBy: 'admin1',
  },
  {
    name: '친구 초대 이벤트',
    description: '친구를 3명 초대하면 쿠폰을 드립니다.',
    conditions: [{ type: 'INVITE_FRIEND', invite_friend: 3 }],
    reward: {
      coupon: 'INVITE_FRIEND_VER1',
    },
    startDate: new Date('2025-06-05T00:00:00Z'),
    endDate: new Date('2025-06-25T23:59:59Z'),
    isActive: true,
    version: 1,
    lastModifiedBy: 'admin1',
  },
  {
    name: '몬스터 처치 이벤트',
    description: '고블린을 20마리 처치하면 보상을 드립니다.',
    conditions: [{ type: 'MONSTER_KILL', kill_monster_id: 101, count: 20 }],
    reward: {
      exp: 300,
      gold: 200,
    },
    startDate: new Date('2025-06-10T00:00:00Z'),
    endDate: new Date('2025-06-20T23:59:59Z'),
    isActive: true,
    version: 1,
    lastModifiedBy: 'operator1',
  },
  {
    name: '복합 출석 + 초대 이벤트',
    description: '3일 로그인하고 친구 1명을 초대하세요.',
    conditions: [
      { type: 'LOGIN_COUNT', loginCount: 3 },
      { type: 'INVITE_FRIEND', invite_friend: 1 },
    ],
    reward: {
      coupon: 'DOUBLEFUN',
      exp: 150,
    },
    startDate: new Date('2025-06-01T00:00:00Z'),
    endDate: new Date('2025-06-15T23:59:59Z'),
    isActive: false,
    version: 1,
    lastModifiedBy: 'admin1',
  },
  {
    name: '보스 몬스터 이벤트',
    description: '보스 몬스터를 5회 처치하면 보상을 드립니다.',
    conditions: [{ type: 'MONSTER_KILL', kill_monster_id: 10, count: 5 }],
    reward: {
      exp: 500,
      gold: 1000,
    },
    startDate: new Date('2025-06-15T00:00:00Z'),
    endDate: new Date('2025-07-01T23:59:59Z'),
    isActive: true,
    version: 1,
    lastModifiedBy: 'admin1',
  },
]);
