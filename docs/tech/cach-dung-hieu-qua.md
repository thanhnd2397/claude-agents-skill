# Cách dùng bộ agent-skills hiệu quả

Tài liệu này không liệt kê skill — [danh-muc-skills.md](danh-muc-skills.md) đã làm việc đó. Đây là **chiến lược chọn skill**: dùng cái gì, khi nào, và quan trọng hơn là khi nào **không** dùng.

---

## Nguyên tắc số một: đừng dùng cả 27 skill

Chọn 5–6 skill cho công việc hằng ngày, gọi thêm khi gặp đúng tình huống.

Lý do rất cụ thể: **mỗi skill nạp vào tốn 3–6k token** (nội dung 150–400 dòng). Chạy đủ chuỗi 16 bước trong lifecycle cho một tính năng nhỏ là tự bóp context của chính mình — rồi chất lượng output tụt đúng lúc bạn cần nó nhất.

Lúc bình thường chỉ phần `description` ngắn của mỗi skill nằm trong context. Toàn bộ nội dung chỉ được nạp khi skill được gọi. Nên chi phí thật nằm ở **số skill bạn gọi**, không phải số skill bạn đã cài.

---

## Tầng 0 — dự án bạn chưa biết

Ba tầng dưới đây giả định bạn đã hiểu codebase. Nếu vừa nhận một dự án người khác làm, chạy đúng một lệnh trước mọi thứ khác:

```
/analyze
```

Nó đọc dự án rồi **trả lời trong chat, không sinh file**. Giá trị thật không nằm ở việc có một bản tóm tắt — mà ở chỗ **mỗi nhận định đều có nhãn**: `[Verified]` kèm `file:dòng`, `[Inferred]` kèm lý do, `[Unknown]` nói rõ thiếu gì và cái gì sẽ chốt được nó. Agent không biết thì nó nói là không biết, thay vì nói chắc nịch một điều nó đoán — đó là cách đọc code của agent gây tốn kém nhất.

Muốn thành tài liệu thì nói rõ: `/analyze --write`, hoặc "viết tài liệu phân tích". Lúc đó nó ghi vào `docs/analysis/`, vào từ `README.md`, với số file tùy quy mô: dự án nhỏ được `README.md` + `tech.md` + `system.md`; dự án lớn — từ 3 domain hoặc 10 module trở lên — được tách thêm `domain.md` và `architecture.md`.

Chỉ cần một phần thì truyền phạm vi: `/analyze src/payments`. Cần hiểu sâu đúng một nghiệp vụ thì truyền tên nó: `/analyze Issue refund`. Chạy xong, trả lời những chỗ còn `[Unknown]` ngay trong chat, rồi mới gọi `context-engineering` viết `CLAUDE.md` — lúc đó quy ước ghi vào đều có dẫn chứng.

`/analyze` **không chấm điểm rủi ro**, và không tự gọi skill nào khác. Chỗ nào đáng lo mà việc đọc phơi ra thì nó nêu một dòng kèm dẫn chứng, không mức độ, không verdict, không đề xuất cách sửa — rồi dừng. Muốn biết nghiêm trọng tới đâu thì **bạn** gọi skill `risk-assessment` ở lượt sau: nó chấm verdict (`Confirmed` chỉ khi đã trace được đường đi, còn lại là `Potential`) và severity, nhưng cũng không sửa. Muốn audit thật thì gọi `security-and-hardening` hoặc `/review`.

---

## Ba tầng theo mức độ rủi ro

### Tầng 1 — việc nhỏ

*Sửa bug, thêm một field, đổi text, rename.*

Đừng gọi skill nào. Nói thẳng việc cần làm.

Ngoại lệ duy nhất — nếu là bug:

```
/agent-skills:debugging-and-error-recovery
```

Chỉ vậy. Nó ép tái hiện lỗi trước khi sửa, đó là toàn bộ giá trị cần ở mức này. Không có bước này thì bạn đang sửa thứ mình đoán là nguyên nhân, không phải nguyên nhân.

### Tầng 2 — một tính năng (vòng lặp chính, dùng 90% thời gian)

```
/spec  →  /plan  →  /build (lặp lại)  →  /agent-skills:review
```

`/build` **đã gói sẵn** `incremental-implementation` + `test-driven-development`, và tự chuyển sang `debugging-and-error-recovery` khi gặp lỗi. Không cần gọi tay ba skill đó.

Lưu ý: `/review` trùng tên với lệnh có sẵn của Claude Code, nên phải gõ đủ `/agent-skills:review`.

### Tầng 3 — việc có thể làm hỏng production

*Auth, payment, migration schema, xoá dữ liệu, thao tác không hoàn tác được.*

Thêm vào tầng 2:

```
/agent-skills:doubt-driven-development   ← TRƯỚC khi code
/agent-skills:security-and-hardening     ← SAU khi code
/ship                                     ← chỉ khi deploy thật
```

**Về `/ship`:** nó fan-out 3 persona (`code-reviewer`, `security-auditor`, `test-engineer`) chạy song song, tốn 3 context window. Đáng giá khi bạn thực sự bấm deploy. Không đáng cho một PR chỉ sửa tài liệu — lúc đó ba báo cáo trả về sẽ rỗng, vì không có test để phân tích coverage và không có attack surface để audit.

---

## Ba skill bị dùng ít hơn mức đáng

Chúng không có command nên dễ bị quên, mà lại giải quyết đúng những cơn đau thật.

### `git-workflow-and-versioning`

Gọi khi working tree bừa bộn — 15 file sửa lẫn lộn ba việc khác nhau. Nó tách thành các commit nguyên tử, mỗi commit một ý.

Đây là skill dùng được nhiều nhất trong nhóm không-command, vì tình huống "làm xong rồi mới nghĩ tới commit" xảy ra gần như mỗi ngày.

### `interview-me`

Gọi **trước** `/spec`, không phải thay thế nó.

- `/spec` viết ra cái bạn **nói**.
- `interview-me` tìm ra cái bạn **thực sự muốn**.

Khoảng cách giữa hai thứ đó là nơi phần lớn công sức bị đổ đi. Nó hỏi từng câu một, mỗi câu kèm phán đoán của agent để bạn phản ứng thay vì phải tự nghĩ từ đầu.

### `performance-optimization`

Nhưng **chỉ khi bạn đã có số đo**. Không có baseline thì nó cũng chỉ đoán cùng bạn. Đo trước, tối ưu sau — đó là nguyên tắc cốt lõi của chính skill đó.

---

## Lỗ hổng cần vá: skill chỉ chạy khi được gọi

Đây là điểm yếu thật của cả bộ skill, cần biết trước khi tin vào nó.

Claude chỉ thấy `name` + `description` của skill rồi **tự quyết định** có nạp hay không. Không có cơ chế nào bắt buộc. Với câu lệnh ngắn và mơ hồ kiểu *"sửa cái này đi"*, Claude sẽ làm thẳng và bỏ qua toàn bộ quy trình bạn đã dựng.

Cách vá: đưa chỉ dẫn vào **global CLAUDE.md** (`~/.claude/CLAUDE.md`), vì file đó *luôn* nằm trong context, còn skill thì không.

```markdown
## Agent skills
- Việc không tầm thường: kiểm tra có skill `agent-skills:*` nào áp dụng trước khi bắt đầu.
- Sửa bug: luôn dùng `agent-skills:debugging-and-error-recovery`.
- Việc rủi ro cao (auth, payment, migration, xoá dữ liệu): dừng lại và dùng
  `agent-skills:doubt-driven-development` trước khi viết code.
```

Đó là thứ biến bộ skill từ "có sẵn" thành "được dùng" ở mọi project.

> Đoạn trên **chưa** được ghi vào `~/.claude/CLAUDE.md`. File đó ảnh hưởng tới mọi project nên cần bạn quyết định.

Cách cứng rắn hơn là dùng `SessionStart` hook trong [hooks/](../../hooks/) để nạp sẵn chỉ dẫn mỗi phiên. Đổi lại là tốn token ở mọi session, kể cả những session không cần tới skill nào.

---

## Hai cách gọi skill, và khi nào dùng cách nào

| Cách | Cú pháp | Khi nào |
|---|---|---|
| **Gõ tên skill** | `/agent-skills:test-driven-development` | Khi bạn biết rõ muốn quy trình nào. **Chắc chắn** nạp được skill. |
| **Nói bằng lời** | "Review giúp tôi diff này" | Khi câu lệnh khớp rõ với mô tả skill. Có thể bị bỏ qua. |

Khi không biết chọn gì: `/agent-skills:using-agent-skills` — skill điều phối, có cây quyết định dẫn tới skill đúng.

---

## Tóm một dòng

Dự án chưa biết thì `/analyze` một lần trước đã. Sau đó dùng `/spec → /plan → /build → /review` làm vòng lặp mặc định. Thêm `doubt-driven-development` và `security-and-hardening` khi việc có thể làm hỏng production. Gọi `git-workflow-and-versioning` khi cần dọn commit. Còn lại để dành cho lúc gặp đúng tình huống.

---

## Đọc thêm

- [danh-muc-skills.md](danh-muc-skills.md) — tác dụng chi tiết của cả 27 skill
- [huong-dan-su-dung.md](huong-dan-su-dung.md) — quy trình theo command, từng bước
- [vi-du-su-dung.md](vi-du-su-dung.md) — ví dụ chạy thật từ đầu đến cuối
