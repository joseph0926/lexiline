# LexiLine – Vocabulary & Sentence Trainer

## 1. 서비스 개요

### 1.1 목적

- 영단어를 "외웠는데 금방 까먹는" 문제를 줄이고 영어 문장을 "끝까지 구조를 잡아서" 해석하는 습관을 만들기 위한 개인용 학습 도구

### 1.2 핵심 컨셉

- 간격 반복(SRS) 기반 단어 복습
- 문장 해석 연습 + 단어-문장 연결
- "오늘 할 일" 중심의 가벼운 루틴 + 알림
- PWA로 오프라인 지원

---

## 2. 핵심 기능

### 2.1 단어 학습 모듈

#### 단어 카드

- EN → KO, KO → EN 회상 모드
- 정답 확인 후:
  - 뜻, 품사
  - 대표 예문 1~2개
  - 예문 번역 (버튼으로 별도 노출)
- **단어가 포함된 등록 문장**도 함께 표시

#### 난이도 버튼 (4단계)

| 버튼  | 동작                     |
| ----- | ------------------------ |
| Again | 세션 내 반복 또는 1일 뒤 |
| Hard  | interval × 1.2           |
| Good  | interval × 2             |
| Easy  | interval × 2.5           |

#### 간격 반복 스케줄링

- 기본 간격: 오늘 세션 반복 → 1일 → 3일 → 10일 → 30일 → 90일…
- 난이도에 따라 간격 조정

#### 헷갈리는 단어

- 오답률 높은 단어 Top N 자동 추출
- 해당 단어들로 집중 퀴즈 제공

---

### 2.2 문장 해석 모듈

#### 문장 등록

- 사용자가 직접 문장/문단을 등록 (기사, 소설, 시험 지문 등)
- 각 문장에 태그: 출처, 난이도 등

#### 해석 연습

1. 영어 문장 표시
2. 사용자가 해석 작성 (또는 머릿속으로)
3. 정답(한국어 번역) 확인
4. 난이도 평가 → SRS 스케줄링

#### 단어-문장 링크

- 문장 화면에서 단어 클릭 시 단어 카드 팝업
- 단어 복습 시 해당 단어가 포함된 문장도 함께 표시

---

### 2.3 오늘 루틴 & 알림

#### 오늘 할 일 화면

- 오늘 due 카드 수
- 오늘 최소 목표 (사용자 설정: 예 30개)
- 남은 목표 수 + 진행률(%) 표시

#### 학습 루틴 플로우

- [오늘 시작] 버튼 누르면:
  1. 단어 복습 세션
  2. 새 단어 추가 옵션
  3. 문장 해석 세션 (2~3문장)
- 각 세션 끝에 "오늘 종료 / 더 하기" 선택

#### 알림 (PWA Push Notification)

- **시간 기반**: 아침/점심/저녁 중 사용자가 선택
- **내용**: "오늘 복습 12개 남았습니다 (5분이면 끝나요)"

---

### 2.4 학습 통계

- 일별/주별 복습 수
- 정답률 추이
- 가장 어려워하는 단어 Top 10
- 연속 학습일 (streak)

---

## 3. 기술 스택 & 구조

### 3.1 프론트엔드

| 항목      | 기술                         |
| --------- | ---------------------------- |
| Framework | React 19 + Vite              |
| Styling   | Tailwind CSS                 |
| PWA       | Vite PWA Plugin              |
| 상태관리  | TBD (React Query + Zustand?) |

### 3.2 백엔드

| 항목      | 기술            |
| --------- | --------------- |
| Framework | Fastify         |
| API       | tRPC            |
| ORM       | Prisma          |
| DB        | Neon PostgreSQL |

### 3.3 배포

| 항목     | 기술                  |
| -------- | --------------------- |
| 컨테이너 | Docker                |
| 호스팅   | AWS EC2               |
| CI/CD    | GitHub Actions (예정) |

### 3.4 음성 (TTS)

- **1단계**: Web Speech API 사용 (브라우저 내장)
- **2단계** (필요시): Google TTS 등 상용 서비스

---

## 4. 데이터 설계

### Word

| 필드      | 타입     | 설명   |
| --------- | -------- | ------ |
| id        | UUID     | PK     |
| text      | String   | 영단어 |
| pos       | String?  | 품사   |
| meaning   | String   | 뜻     |
| note      | String?  | 메모   |
| createdAt | DateTime | 생성일 |

### WordExample

| 필드       | 타입    | 설명        |
| ---------- | ------- | ----------- |
| id         | UUID    | PK          |
| wordId     | UUID    | FK → Word   |
| sentenceEn | String  | 영어 예문   |
| sentenceKo | String? | 한국어 번역 |

### WordReview

| 필드        | 타입     | 설명           |
| ----------- | -------- | -------------- |
| id          | UUID     | PK             |
| wordId      | UUID     | FK → Word      |
| interval    | Int      | 현재 간격 (일) |
| easeFactor  | Float    | 난이도 계수    |
| nextDue     | DateTime | 다음 복습일    |
| reviewCount | Int      | 총 복습 횟수   |

### WordReviewLog

| 필드       | 타입     | 설명                 |
| ---------- | -------- | -------------------- |
| id         | UUID     | PK                   |
| wordId     | UUID     | FK → Word            |
| reviewedAt | DateTime | 복습 일시            |
| rating     | Enum     | Again/Hard/Good/Easy |

### Sentence

| 필드       | 타입     | 설명         |
| ---------- | -------- | ------------ |
| id         | UUID     | PK           |
| textEn     | String   | 영어 문장    |
| textKo     | String?  | 한국어 번역  |
| source     | String?  | 출처         |
| difficulty | Int?     | 난이도 (1-5) |
| createdAt  | DateTime | 생성일       |

### SentenceWord

| 필드       | 타입 | 설명          |
| ---------- | ---- | ------------- |
| id         | UUID | PK            |
| sentenceId | UUID | FK → Sentence |
| wordId     | UUID | FK → Word     |

### SentenceReview

| 필드       | 타입     | 설명           |
| ---------- | -------- | -------------- |
| id         | UUID     | PK             |
| sentenceId | UUID     | FK → Sentence  |
| interval   | Int      | 현재 간격 (일) |
| nextDue    | DateTime | 다음 복습일    |

### UserSettings

| 필드                 | 타입    | 설명           |
| -------------------- | ------- | -------------- |
| id                   | UUID    | PK             |
| dailyTargetWords     | Int     | 일일 단어 목표 |
| dailyTargetSentences | Int     | 일일 문장 목표 |
| notificationTime     | String? | 알림 시간      |

---

## 5. 제외된 기능 (v2.0 이후 고려)

- 로그인/인증 (멀티 디바이스 동기화)
- 데이터 import/export
- S/V/O 문장 구조 시각화
- 역번역 모드
- React Native 앱
