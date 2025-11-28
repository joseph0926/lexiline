# LexiLine

영단어 & 문장 해석 트레이너

## 기술 스택

| 영역     | 기술                                 |
| -------- | ------------------------------------ |
| Frontend | React 19 + Vite + Tailwind CSS + PWA |
| Backend  | Fastify + tRPC                       |
| DB       | Neon PostgreSQL + Prisma             |
| 배포     | Docker + AWS EC2                     |

## 프로젝트 구조

```
├── apps/
│   ├── web/          # React 프론트엔드
│   └── api/          # Fastify 백엔드 (예정)
├── docs/
│   └── plan.md       # 기획 문서
├── turbo.json        # Turborepo 설정
├── tsconfig.base.json
└── package.json
```

## 시작하기

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 타입 체크
pnpm typecheck
```

## 스크립트

| 명령어              | 설명                   |
| ------------------- | ---------------------- |
| `pnpm dev`          | 모든 앱 개발 서버 실행 |
| `pnpm build`        | 모든 앱 빌드           |
| `pnpm typecheck`    | 타입 체크              |
| `pnpm format`       | Prettier로 전체 포맷팅 |
| `pnpm format:check` | 포맷팅 검사 (CI용)     |
