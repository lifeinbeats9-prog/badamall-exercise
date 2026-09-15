# badamall-exercise

수업 과제용 바다몰 메인페이지 재구성본입니다.

## 과제 요소
- 실제 바다몰 메인페이지를 참고한 HTML/CSS 레이아웃
- `products.json` 상품 데이터
- `fetch('./products.json')` 비동기 GET
- 장바구니 버튼에서 `JSON.stringify()` + `fetch(..., { method: 'POST' })`
- 메인 배너 슬라이더

## 로컬 실행
정적 파일을 직접 더블클릭하면 브라우저 보안 정책 때문에 JSON fetch가 막힐 수 있습니다.

```bash
python -m http.server 8000
```

이후 `http://localhost:8000` 접속.

## GitHub Pages
`main` 브랜치의 `/ (root)`를 Pages 소스로 지정하면 됩니다.
