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

---

## 🐋 Docker 설정

### ⚡️ MSA (마이크로서비스) 구조

모든 프로젝트는 다음과 같은 MSA 구조에 따른 NestJS 개발 경험치에 맞춰 구성되어 있습니다.

```
Gateway (API Gateway)
  ├── Rosette (JWT 인증/인가 관리)
  └── Chrono (Event, Reward, RewardLog 관리)
```

* **Gateway**: 클라이언트의 다음 요청을 각 서비스로 발신
* **Rosette**: 사용자 JWT 인증, 인가, 회원가입/로그인 관리
* **Chrono**: 이벤트 등록, 보상 지구, 사용자 보상 로그 관리

---

### 💪 Docker 전체 시작

프로젝트 루트 경로에서 다음 명령을 실행합니다.

```bash
docker-compose build && docker-compose up -d
```

해당 명령은 다음 서비스들을 동시에 구성합니다:

* `gateway-service` (port: 3000)
* `rosette-service` (port: 8877)
* `chrono-service` (port: 8878)
* `mongodb` (port: 27017)

.env.docker 파일 등을 통해 NestJS 개발과 구분되고, 각 NestJS 구현체에서 `ConfigModule.forRoot` 를 통해 가장 매칭된 env 파일을 읽어서 시작됩니다.

---

### ⚡️ 목표: DB만 Docker를 도입하고 NestJS가 로컬에서 실행.

1. MongoDB만 Docker로 시작:

```bash
cd ./local-mongo-db && docker-compose up -d
```

```
`local-mongo-db` 폴더는 로컬 MongoDB 시작을 위한 파일들이 있음 (초기화 데이터 포함)
```

2. NestJS 서버는 로컬에서 다음 명령어로 실행:

```bash
npm run start:dev
```

---

## 🤩 프로그램 설계 및 로직 설명

### 1. 전체 도메인 구성

서비스는 다음과 같이 4개의 도메인으로 설계되었습니다:

* **User**: 사용자 계정, 인증 및 권한 정보 관리
* **Events**: 보상지급 조건을 담고 있는 게임 내 이벤트 관리
* **Rewards**: 보상 관리 (Gold, Exp, Coupon 등)
* **UserRewards**: 사용자 이벤트 참여 실패/성공 이력관리

---

### 2. Event ↔ Reward 관계

처음에는 **N\:M 관계**로 설계하려 했지만, 향후 데이터가 많아지면 관리가 여러울점을 고려해 **1:1 관계**로 단순화 <br/>
`Reward`는 MongoDB의 수정에 자유로운 특징을 활용해 어떤 보상이 오더라도 추가되게 셜계함.

```ts
//Reward 컬렉션에 있는 컬럼 중 하나인 RewardItem
export type RewardItem = {
  type: string; // ex: gold, exp, coupon, item, etc.
  id?: string | null; // ex: 쿠폰 코드, 아이템 ID 등
  count: number; // 지급 수량
  meta?: Record<string, any>; // 추가 속성 (optional)
};
```

---

### 3. 분산 환경 대비 Lock 처리

* Node.js는 기본적으로 싱글 스레드 기반이지만, **멀티 프로세스 또는 MSA 환경을 고려**해 동시성 제어를 위해 **Lock 시스템** 구현
* Lock은 MongoDB 기반으로 구현:

    * 이유: 크기가 작고, TTL이 짧아 빠른 회수 가능
    * 분산 Lock이 필요한 방식(ex. `user/reward` 데이터 지급)에 적용

---

### 4. 보상 지급 조건

* `POST /user/reward` API의 로직은 다음과 같다.

    1. 유저는 데이터(eventId, eventVersion, 평가데이터, JWT (header 'Authorization: ...))을 호출한다.:
       ```ts
       export class UserRewardRequest {
          userId: string;
          eventId: string;
          eventVersion: number;
          evaluations: EvaluationItem[];
        }
       
       export type EvaluationItem = {
         type: string;
         data: Record<string, any>;
       };
       ```
    2. 서버는 이벤트에 등록된 모든 조건을 검사:
        * 모든 조건이 맞으면 `COMPLETED`
        * 하나라도 맞지 않으면 `FAILED`

    3. 처리 결과는 `UserRewardLog`에 기록:
        * `logSnapshot`으로 현재 상황 스냅샷 저장
        * 이벤트 또는 조건이 변경되든 과거 기록 추적 가능
