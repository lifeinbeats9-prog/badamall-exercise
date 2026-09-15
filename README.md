# badamall-exercise

생성형 AI 활용 웹 서비스 개발 과제용 프로젝트입니다.

## 문제 1 — 바다몰 화면 재현 + JSON/fetch
- `index.html` / `style.css` / `app.js` / `products.json`
- `products.json`을 `fetch()`로 비동기 호출
- 장바구니 클릭 시 JavaScript 객체를 `JSON.stringify()` 후 POST 전송
- 실제 주문 기능은 없는 수업용 화면입니다.

### 상품 이미지 교체
`images/01.jpg` ~ `images/08.jpg` 파일을 올리면 자동으로 적용됩니다.
이미지가 없으면 `images/placeholder.svg`가 표시됩니다.

## 문제 2 — Hugging Face / Colab
`colab/problem2_huggingface_colab.ipynb`
- 감정 분석
- 한→영 번역
- 문서 요약

## 문제 3 — FastAPI + Hugging Face
`fastapi/` 폴더

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

브라우저에서 `http://127.0.0.1:8000` 접속.
