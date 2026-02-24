# Git Flow Strategy

이 프로젝트는 **Git Flow** 브랜치 전략을 따릅니다.

## 주요 브랜치

- **`main`**: 제품으로 출시될 수 있는 상태의 코드를 관리합니다.
- **`develop`**: 다음 출시 버전을 개발하는 통합 브랜치입니다. 모든 기능 개발의 시작점입니다.

## 보조 브랜치

- **`feature/*`**: 새로운 기능을 개발할 때 사용합니다. `develop`에서 생성하고 `develop`으로 머지합니다.
- **`release/*`**: 다음 출시를 준비하는 브랜치입니다. `develop`에서 생성하고 `main`과 `develop`으로 머지합니다.
- **`hotfix/*`**: 제품(`main`)에서 발생한 긴급 버그를 수정할 때 사용합니다. `main`에서 생성하고 `main`과 `develop`으로 머지합니다.

## 작업 흐름 예시

1. 새로운 작업 시작: `git checkout -b feature/login develop`
2. 작업 완료 후 `develop`에 머지: (Pull Request를 통한 코드 리뷰 권장)
3. 출시 준비: `git checkout -b release/1.0.0 develop`
4. 제품 반영: `main`으로 머지 및 태그 생성
