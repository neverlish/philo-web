# 테스트 컨벤션

## 기본 원칙

새 route 또는 컴포넌트를 추가할 때는 테스트 파일을 함께 작성한다.

- `app/api/foo/route.ts` → `app/api/foo/route.test.ts`
- `components/bar/baz.tsx` → `components/bar/baz.test.tsx`

## mock은 헬퍼에서 import

Supabase와 Request mock은 직접 작성하지 말고 헬퍼를 사용한다.

```ts
import { makeSupabaseMock } from '@/tests/helpers/supabase'
import { makeRequest } from '@/tests/helpers/request'
```

## 실행 명령

| 명령 | 용도 |
|------|------|
| `npm test` | 전체 테스트 watch 모드 |
| `npm run test:run` | 전체 테스트 1회 실행 |
| `npm run test:watch` | 개발 중 파일 변경 시 자동 실행 |
| `npm run test:cov` | 커버리지 리포트 생성 (`coverage/index.html`) |

## API Route 테스트 체크리스트

- [ ] 인증 없으면 401
- [ ] 필수 입력값 없으면 400
- [ ] 정상 케이스 200/201
- [ ] DB 오류 시 500

## 컴포넌트 테스트 체크리스트

- [ ] 필수 정보가 화면에 렌더링됨
- [ ] 조건부 렌더링이 올바르게 동작함
- [ ] 인터랙션(클릭 등) 후 상태 변화가 반영됨
- [ ] API 실패 시 롤백 또는 에러 처리가 됨
