# Hướng dẫn sử dụng agent-skills với Claude Code

Tài liệu này giải thích cách dùng bộ skill theo từng bước: giai đoạn nào dùng command nào, command đó gọi skill nào và agent nào, cùng cách tiết kiệm token. Mọi thông tin được đối chiếu với file thật trong [.claude/commands/](../../.claude/commands/), [agents/](../../agents/) và `skills/*/SKILL.md`.

> Muốn xem một ví dụ cụ thể đi từ đầu đến cuối, kèm đúng những gì bạn gõ ở mỗi bước: [vi-du-su-dung.md](vi-du-su-dung.md).
>
> Muốn gọi skill trực tiếp thay vì qua command, kèm tác dụng của cả 26 skill: [danh-muc-skills.md](danh-muc-skills.md).
>
> Muốn biết nên dùng skill nào cho việc đang làm và khi nào **không** nên dùng: [cach-dung-hieu-qua.md](cach-dung-hieu-qua.md).

---

## Bước 0: Cài đặt (chỉ làm một lần)

```
/plugin marketplace add thanhnd2397/claude-agents-skill
/plugin install agent-skills@thanhnd-agent-skills
```

Sau khi cài, mở Claude Code trong **dự án bạn đang làm** (không phải repo skill này). Gõ `/` sẽ thấy các lệnh dạng `/agent-skills:spec`. Riêng `/review` trùng với lệnh có sẵn của Claude Code, nên phải gõ `/agent-skills:review`.

> Nếu chỉ mở repo này mà chưa cài plugin, các command vẫn hiện (vì nằm trong `.claude/commands/`), nhưng skill sẽ không nạp được. Khi đó bạn sẽ gặp lỗi `Unknown skill: agent-skills:...`.

---

## Ba thành phần và cách chúng phối hợp

| Thành phần | Là gì | Ai kích hoạt | Tốn token khi nào |
|---|---|---|---|
| **Command** (9 lệnh) | Điểm vào cho từng giai đoạn. Mỗi lệnh gọi một hoặc hai skill. | **Chỉ bạn.** Mọi lệnh đều có `disable-model-invocation: true`, nên Claude không tự gọi. | Khi bạn gõ lệnh |
| **Skill** (25 skill) | Quy trình chi tiết, mỗi skill khoảng 200–400 dòng, tức khoảng 3–6k token. | Do command gọi, hoặc Claude tự gọi khi câu hỏi khớp với `description` của skill. | Lúc bình thường chỉ nạp phần `description` ngắn. Toàn bộ nội dung chỉ được nạp khi skill được gọi. |
| **Agent** (4 persona) | Subagent chạy trong **context riêng**, chỉ trả báo cáo về phiên chính. | `/ship`, `/webperf`, hoặc khi bạn gọi đích danh. | Mỗi agent tốn một context riêng, nhưng giữ cho phiên chính gọn. |

**Điểm hay bị hiểu nhầm:** `/review` và `/test` **không** dùng agent. Chúng chạy skill ngay trong phiên chính. Chỉ `/ship` và `/webperf` mới gọi agent.

---

## Bảng tra 10 command

| Command | Skill được gọi | Agent | Kết quả |
|---|---|---|---|
| `/analyze` | project-analysis | — | Bộ tài liệu trong `docs/analysis/`, vào từ `project-analysis.md`: nghiệp vụ, cấu trúc, stack, dữ liệu, số liệu, giấy phép, rủi ro, cách chạy, kèm `questions.md`. Mỗi nhận định có nhãn `[Verified]`/`[Inferred]`/`[Unknown]` và dẫn chứng `file:dòng`. Chỉ đọc. |
| `/spec` | spec-driven-development | — | `SPEC.md` (hỏi bạn rồi mới viết) |
| `/plan` | planning-and-task-breakdown | — | `tasks/plan.md` và `tasks/todo.md`. Chỉ đọc, không sửa code. |
| `/build` | incremental-implementation + test-driven-development | — | Làm **một** task: viết test fail → code cho pass → chạy toàn bộ test → build → commit → dừng |
| `/build auto` | Như trên, cộng planning nếu chưa có plan | — | Bạn duyệt plan **một lần**, sau đó nó làm hết các task, mỗi task một commit |
| `/test` | test-driven-development (cộng browser-testing-with-devtools nếu là lỗi trên trình duyệt) | — | Viết test trước. Với bug: viết test tái hiện lỗi trước rồi mới sửa. |
| `/review` | code-review-and-quality | — | Review theo 5 trục, phân loại Critical / Required / Optional / Nit, có `file:line` |
| `/code-simplify` | code-simplification | — | Làm code gọn hơn mà không đổi hành vi, chạy test sau mỗi thay đổi |
| `/constraints` | constraint-driven-development | — | `CONSTRAINTS.md`: tiêu chuẩn chất lượng và công cụ để kiểm tra |
| `/webperf` | — | **web-performance-auditor** | Báo cáo hiệu năng web. Chỉ dùng cho web app. |
| `/ship` | shipping-and-launch | **code-reviewer + security-auditor + test-engineer** chạy song song | Quyết định GO hoặc NO-GO kèm kế hoạch rollback |

Khi gặp lỗi, `/build` tự chuyển sang **debugging-and-error-recovery**. Khi gặp việc rủi ro (auth, xóa dữ liệu, deploy, secrets), nó chuyển sang **doubt-driven-development** và dừng lại hỏi bạn.

---

## Quy trình từng bước khi làm một tính năng mới

```
/spec ──▶ /plan ──▶ /build (lặp lại) ──▶ /review ──▶ /ship
  │         │            │                  │          │
duyệt     duyệt     mỗi task 1 commit     sửa lỗi    GO / NO-GO
```

**Bước 1. Định nghĩa: `/spec mô tả ngắn tính năng`**
- Skill: `spec-driven-development`. Agent: không có.
- Claude hỏi bạn về mục tiêu, tính năng, tech stack và ranh giới, rồi viết `SPEC.md` và **dừng lại chờ bạn duyệt**.
- Nếu ý tưởng còn mơ hồ, hãy gọi skill `interview-me` hoặc `idea-refine` trước. Ví dụ gõ "interview me về ý tưởng X".

**Bước 2. Lập kế hoạch: `/plan`**
- Skill: `planning-and-task-breakdown`. Agent: không có.
- Đọc `SPEC.md`, chia thành các task mỏng theo chiều dọc (mỗi task là một luồng hoàn chỉnh), mỗi task có tiêu chí nghiệm thu và cách kiểm tra. Lưu vào `tasks/`.

**Bước 3. Viết code: `/build`, lặp lại cho từng task**
- Skill: `incremental-implementation` + `test-driven-development`. Agent: không có.
- Có thể dùng `/build auto` nếu plan đã chắc chắn. Điều kiện là phải có `SPEC.md` và working tree sạch.
- Trong lúc code, Claude có thể tự gọi thêm skill khi phù hợp: `frontend-ui-engineering` cho UI, `api-and-interface-design` cho API, `source-driven-development` khi cần đối chiếu tài liệu framework.

**Bước 4. Kiểm tra: `/review`**, cộng `/code-simplify` nếu code rối
- Skill: `code-review-and-quality`. Agent: không có (chạy trong phiên chính).

**Bước 5. Ra mắt: `/ship`**, chỉ khi deploy lên production
- Agent: `code-reviewer`, `security-auditor` và `test-engineer` chạy song song.

**Với dự án có sẵn:** chạy `/analyze` trước để hiểu dự án (xem mục [Phân tích một codebase mới](#phân-tích-một-codebase-mới)), rồi `/constraints` một lần ở đầu để chốt tiêu chuẩn chất lượng, ví dụ coverage, lint, không được bỏ test.

---

## Chọn quy trình theo quy mô (tiết kiệm token nhiều nhất)

| Việc | Làm thế nào | Ghi chú |
|---|---|---|
| Sửa typo, thay đổi 1 dòng | Nói thẳng với Claude, **không dùng lệnh** | Skill spec ghi rõ không dùng cho trường hợp này |
| Sửa bug | `/test` (test tái hiện lỗi trước) | Không cần `/spec` hay `/plan` |
| Tính năng nhỏ, 1–3 file | `/build` rồi `/review` | Viết spec 2 dòng thẳng trong prompt là đủ |
| Tính năng vừa và lớn | `/spec` → `/plan` → `/build` → `/review` | Quy trình đầy đủ |
| Mới nhận một dự án người khác đã làm | `/analyze` trước mọi thứ khác | Một lần cho cả dự án. Chỉ đọc, kết quả nằm ở `docs/analysis/project-analysis.md` |
| Deploy production | Thêm `/ship` | Tốn nhất (3 subagent). `/ship` tự bỏ qua fan-out nếu thay đổi ≤ 2 file, < 50 dòng và không đụng tới auth, thanh toán, dữ liệu hay config. |

---

## Mẹo tiết kiệm token

1. **Mở phiên mới (`/clear`) giữa các giai đoạn.** Spec, plan và trạng thái task đều nằm trên đĩa (`SPEC.md`, `tasks/plan.md`, `tasks/todo.md`, git). Skill `context-engineering` (mục *Restartable Session Boundaries*) nói rõ: ranh giới an toàn để mở phiên mới là **sau khi xong một task**, không phải giữa chừng. Ví dụ: `/spec` → duyệt → `/clear` → `/plan` → `/clear` → `/build`…
2. **Mỗi phiên chỉ làm một task với `/build`** nếu tính năng dài. `/build auto` không làm mỗi task rẻ hơn. Nó chỉ bỏ bước bạn phải duyệt giữa các task, và context sẽ phình dần qua từng task.
3. **Không gọi `using-agent-skills`.** Claude Code tự chọn skill dựa trên description. Nạp thêm meta-skill này chỉ tốn token và tạo ra hai bộ định tuyến chồng nhau.
4. **Nói rõ phạm vi** cho `/review` và `/code-simplify`, ví dụ `/agent-skills:review src/auth/`, để nó không đọc cả repo.
5. **Chỉ dùng `/ship` cho thay đổi lên production.** Thay đổi nội bộ thì `/review` là đủ, vì `/ship` tốn gấp nhiều lần.
6. **Gọi agent trực tiếp** khi chỉ cần một góc nhìn, ví dụ "dùng agent security-auditor kiểm tra src/auth.ts". Cách này rẻ hơn `/ship` và giữ phiên chính gọn.

---

## Phân tích một codebase mới

Bắt đầu bằng `/analyze` (skill `project-analysis`). Nó đọc dự án và viết một bộ
tài liệu trong `docs/analysis/`, vào từ `project-analysis.md`:

```
docs/analysis/
├── project-analysis.md            # index: tóm tắt, số liệu, bản đồ tài liệu
├── technology-stack.md            # ngôn ngữ, framework, phiên bản
├── business-domain.md             # cây domain, vai trò, feature
├── structure.md                   # module, trách nhiệm, kiến trúc
├── inventory.md                   # số liệu và quy tắc đếm
├── data-and-integrations.md       # schema, API, dịch vụ ngoài
├── running-and-testing.md         # lệnh cài, chạy, build, test, CI
├── dependencies-and-licenses.md   # giấy phép và thành phần có thể mất phí
├── risk-register.md               # rủi ro kèm mức độ và dẫn chứng
├── questions.md                   # câu hỏi, bạn trả lời tại chỗ
└── features/<domain>/<feature>.md # tài liệu một nghiệp vụ, tạo khi bạn yêu cầu
```

File index luôn có. Các file còn lại chỉ được tạo khi chiều đó thật sự có kết
quả, nên dự án nhỏ sẽ không có bộ khung mười file rỗng.

```
/analyze
```

Chỉ cần một phần dự án thì truyền phạm vi vào, là đường dẫn hoặc chủ đề:

```
/analyze src/payments
/analyze luồng hoàn tiền
```

Nếu bộ tài liệu đã có và bạn truyền đúng tên một nghiệp vụ trong cây domain, nó
viết tài liệu riêng cho nghiệp vụ đó thay vì phân tích lại cả dự án:

```
/analyze Issue refund
```

Chạy lại `/analyze` về sau thì nó so commit đã ghi trong index với commit hiện
tại và chỉ phân tích lại phần đã thay đổi. Không có commit để so thì nó phân
tích lại toàn bộ và nói rõ lý do.

Bốn điều đáng biết về bộ tài liệu này:

- **Mỗi nhận định có nhãn và dẫn chứng.** `[Verified]` là đọc trực tiếp từ code kèm `file:dòng`, `[Inferred]` là suy luận kèm lý do, `[Unknown]` là code không trả lời được. Bạn biết chỗ nào tin được, chỗ nào chỉ là suy đoán.
- **Chỗ nào không rõ thành câu hỏi, không thành phỏng đoán.** Câu hỏi nằm trong `questions.md`. Bạn mở file, điền vào dòng `**Answer:**` dưới mỗi câu, rồi chạy lại `/analyze`; hoặc trả lời ngay trong chat. Nhận định tương ứng thành `[User]` kèm ngày xác nhận. Agent không bao giờ tự điền câu trả lời, nên cái gì trong đó là của bạn.
- **Chỉ đọc, và không tự chạy lệnh.** Nó không `npm install`, không `npm test`, không kết nối database; các lệnh tìm thấy được ghi là "not run". Nó cũng chỉ ghi tên biến môi trường và secret, không ghi giá trị.
- **Số liệu luôn kèm quy tắc đếm.** Mỗi con số trong `inventory.md` ghi rõ đếm gì và loại trừ gì, ví dụ "1 endpoint, là cặp method và path, không tính fallback 404". Một con số không có quy tắc đếm thì không ai kiểm lại được.

Sau khi có báo cáo, làm tiếp theo nhu cầu:

1. Gọi skill `context-engineering` để viết `CLAUDE.md` dựa trên báo cáo, bổ sung Tech Stack, Commands, Code Conventions, Boundaries. Chạy sau `/analyze` thì những quy ước ghi vào đều có dẫn chứng, không phải phỏng đoán. Lệnh `/init` có sẵn của Claude Code cũng tạo được `CLAUDE.md` ban đầu nếu bạn muốn một bản nháp nhanh.
2. Nếu cần ghi lại kiến trúc lâu dài, dùng `documentation-and-adrs`.
3. Nếu cần audit, dùng `/review`, hoặc gọi trực tiếp agent `security-auditor` hay `web-performance-auditor`. `risk-register.md` **không** phải bản audit: nó ghi lại nguy hiểm mà việc đọc dự án phơi ra, kèm mức độ và verdict (`Confirmed` là đã truy vết được, `Potential` là mới thấy dấu hiệu), không đi tìm cho đủ và không đề xuất cách sửa. File index chỉ nêu tối đa 5 dòng nghiêm trọng nhất. Register rỗng nghĩa là đọc không thấy gì, không phải dự án an toàn.
4. Chuẩn bị sửa gì thì sang `/spec`.
