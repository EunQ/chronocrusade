const rewards = [
  {
    rewardId: 'RWD-202405191800-A1Xb7',
    gold: 100,
    exp: 50,
    eventIds: [], // 이후 이벤트에서 참조됨
  },
  {
    rewardId: 'RWD-202405191800-Fz92L',
    coupons: [{ id: 'WELCOME10', count: 1 }],
    eventIds: [],
  },
  {
    rewardId: 'RWD-202405191800-ZzE91',
    gold: 200,
    exp: 100,
    coupons: [{ id: 'BOSS50', count: 2 }],
    eventIds: [],
  },
];

const events = [
  {
    eventId: 'EVT-202405191800-kPd8M',
    name: '5일 연속 로그인 이벤트',
    description: '5일간 로그인 시 보상을 드립니다.',
    rewardIds: ['RWD-202405191800-A1Xb7'],
    conditions: [{ type: 'LOGIN_COUNT', loginCount: 5 }],
    startDate: new Date('2025-06-01T00:00:00Z'),
    endDate: new Date('2025-06-10T00:00:00Z'),
    isActive: true,
    version: 1,
    lastModifiedBy: 'admin1',
  },
  {
    eventId: 'EVT-202405191800-Pc3aD',
    name: '친구 초대 이벤트',
    description: '친구 3명을 초대하세요!',
    conditions: [{ type: 'INVITE_FRIEND', invite_friend: 3 }],
    rewardIds: ['RWD-202405191800-Fz92L'],
    startDate: new Date('2025-06-05T00:00:00Z'),
    endDate: new Date('2025-06-20T00:00:00Z'),
    isActive: true,
    version: 1,
    lastModifiedBy: 'admin1',
  },
  {
    eventId: 'EVT-202405191800-dA9Lk',
    name: '보스 몬스터 처치 이벤트',
    description: '보스를 5회 처치하면 고급 보상 지급',
    rewardIds: ['RWD-202405191800-ZzE91'],
    conditions: [{ type: 'MONSTER_KILL', kill_monster_id: 999, count: 5 }],
    startDate: new Date('2025-06-10T00:00:00Z'),
    endDate: new Date('2025-06-25T00:00:00Z'),
    isActive: true,
    version: 1,
    lastModifiedBy: 'admin1',
  },
  {
    eventId: 'EVT-202405191800-UyW3d',
    name: '6월 출석 이벤트',
    description: '6월 한 달 동안 출석 보상을 드립니다.',
    rewardIds: ['RWD-202405191800-A1Xb7'],
    conditions: [{ type: 'LOGIN_COUNT', loginCount: 30 }],
    startDate: new Date('2025-06-01T00:00:00Z'),
    endDate: new Date('2025-06-30T00:00:00Z'),
    isActive: false,
    version: 1,
    lastModifiedBy: 'operator1',
  },
  {
    eventId: 'EVT-202405191800-XzWq7',
    name: '여름 복합 이벤트',
    description: '로그인 3일 + 친구 초대 1명',
    rewardIds: ['RWD-202405191800-Fz92L', 'RWD-202405191800-ZzE91'],
    conditions: [
      { type: 'LOGIN_COUNT', loginCount: 3 },
      { type: 'INVITE_FRIEND', invite_friend: 1 },
    ],
    startDate: new Date('2025-06-15T00:00:00Z'),
    endDate: new Date('2025-07-01T00:00:00Z'),
    isActive: true,
    version: 1,
    lastModifiedBy: 'admin1',
  },
];

rewards[0].eventIds = ['EVT-202405191800-kPd8M', 'EVT-202405191800-UyW3d'];
rewards[1].eventIds = ['EVT-202405191800-Pc3aD', 'EVT-202405191800-XzWq7'];
rewards[2].eventIds = ['EVT-202405191800-dA9Lk', 'EVT-202405191800-XzWq7'];

const now = new Date();
rewards.forEach((r) => {
  r.createdAt = now;
  r.updatedAt = now;
});
events.forEach((e) => {
  e.createdAt = now;
  e.updatedAt = now;
});

db = db.getSiblingDB('game');

db.rewards.insertMany(rewards);
db.events.insertMany(events);
