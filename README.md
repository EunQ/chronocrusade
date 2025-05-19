# ChronoCrusade Project OverView <br/> 이벤트 & 보상 시스템

## 📋 인증 및 사용자 시스템 (`auth` DB)

### 🔐 JWT 인증

모든 API는 JWT 기반 인증을 사용합니다. JWT에는 `id`, `roles[]` 정보가 포함됩니다.

```json
{
  "id": "user1",
  "roles": ["user"]
}
```

### 📌 API 목록

| Method | Endpoint       | 설명                  |
| ------ | -------------- |---------------------|
| POST   | `/auth/login`  | 로그인, JWT 토큰 발급      |
| POST   | `/user/signup` | 회원가입                |
| POST   | `/user`        | 사용자 본인 정보 수정        |
| POST   | `/admin/user`  | Admin이 다른 사용자 정보 수정 |

* 사용자 정보는 `users` 콜렉션에 저장되며, 다음것과 같은 필드로 구성됩니다:

| 필드명           | 설명                                        |
| ------------- | ----------------------------------------- |
| `id`          | 사용자 ID                                    |
| `encPassword` | 암호화된 비밀번호                                 |
| `roles[]`     | 사용자 역할 (user, admin, operator, auditor 등) |

### 🔒 권한 제어

기본적으로 다음 Guard 및 Decorator를 통해 보호됩니다:

```ts
@UseGuards(RoleGuard)
@Roles(Role.USER)
@MatchUser(true) //Request에 있는 userId와 JWT 토큰 ID를 비교.
```

---

## 🎯 이벤트 시스템 (`game` DB)

### 📘 이벤트 스키마 (`events` 켈렉션)

| 필드명                     | 설명        |
| ----------------------- |-----------|
| `eventId`               | 이벤트 고유 ID |
| `name`                  | 이벤트 이름    |
| `description`           | 설명        |
| `rewardIds[]`           | 연결된 보상 ID |
| `conditions[]`          | 완료 조건     |
| `startDate` / `endDate` | 기간        |
| `isActive`              | 활성 상태     |
| `version`               | 버전 관리용    |
| `lastModifiedBy`        | 최종 수정자    |

#### ✅ 조건 타입 예시

```ts
{ type: 'LOGIN_COUNT', loginCount: 5 }
{ type: 'INVITE_FRIEND', invite_friend: 3 }
{ type: 'MONSTER_KILL', kill_monster_id: 999, count: 5 }
```

---

## 🎁 보상 시스템 (`game` DB)

### 📘 보상 스키마 (`rewards` 컬렉션)

| 필드명              | 설명         |
| ---------------- | ---------- |
| `rewardId`       | 보상 ID      |
| `eventId`        | 연결된 이벤트 ID |
| `items[]`        | 지금 아이템들    |
| `version`        | 보상 버전      |
| `lastModifiedBy` | 수정자        |

#### 🎁 보상 아이템 구조 예시

```ts
{
  type: 'gold',
  id: 'GOLD',
  count: 100
}

// ItemType
{
  type: { type: String, required: true },
  id: { type: String, default: null },
  count: { type: Number, required: true },
  meta: { type: Object, default: {} },
},
```

---

## 🧰 유저 리워드 시스템 (`user_rewards` 컬렉션)

| 필드명            | 설명                      |
| -------------- |-------------------------|
| `userId`       | 유저 ID                   |
| `eventId`      | 이벤트 ID                  |
| `eventVersion` | 이벤트 버전                  |
| `status`       | `COMPLETED` 또는 `FAILED` |
| `logSnapshot`  | 최근에 한 결과에 대한 로그         |

---

## 🧪 리워드 이력 로그 (`log` DB, `user_reward_logs` 컬렉션)

| 필드명                 | 설명                                |
| ------------------- |-----------------------------------|
| `userId`            | 유저 ID                             |
| `gameEventSnapshot` | 이벤트 당시 스냅샷                        |
| `rewardSnapshot`    | 보상 지금 내역 스냅샷                      |
| `evaluations[]`     | 유저가 호출한 실제 평가 데이터                 |
| `isConditionMet`    | 조건 충족 여부                          |
| `status`            | `COMPLETED` / `FAILED`            |
| `errorMessage`      | 실패 사유 예시: `"조건 실패: MONSTER_KILL"` |


Log DB에는 `event_logs` `reward_logs` 각각 존재, event, reward가 수정될 때마다 적재함.


---

## 🧱 DB 분리 구조 설계

| DB 이름  | 목적                            |
| ------ |-------------------------------|
| `auth` | 로그인, 사용자 정보 ( 비밀번호 포함 )       |
| `game` | 이벤트 / 보상 정의 / 유저의 이벤트 보상이력    |
| `log`  | 유저 참여 및 리워드, 이벤트 수정 이력 저장     |
| `lock` | 동시성 처리를 위한 Lock DB  |

> **설계 의도**:
>
> * 마이크로서비스별 책임 분리
> * 로그/기록용 DB는 별도로 분리하여 관리 유의성 향상
> * Lock 설계 의도는 멀티 프로세스 및 쓰레딩 환경에서 일관성을 유지하기 위해. 
