# Danh mục 26 skill (tiếng Việt)

Tài liệu này dành cho lúc bạn muốn **gọi skill trực tiếp**, không đi qua command. Mỗi mục ghi: skill làm gì, khi nào nên gọi, và nó tạo ra cái gì. Nội dung lấy từ `description` thật trong `skills/*/SKILL.md`.

> Muốn đi theo quy trình command (`/spec` → `/plan` → `/build` → ...): xem [huong-dan-su-dung.md](huong-dan-su-dung.md). Muốn xem ví dụ chạy thật từ đầu đến cuối: [vi-du-su-dung.md](vi-du-su-dung.md).

---

## Hai cách gọi skill trực tiếp

**Cách 1 — gõ tên skill như slash command:**

```
/agent-skills:test-driven-development
/agent-skills:interview-me
```

Cách này **chắc chắn** nạp skill. Dùng khi bạn biết rõ mình muốn quy trình nào.

**Cách 2 — nói bằng lời, để Claude tự chọn:**

```
Review giúp tôi diff này
Code này rối quá, làm gọn lại đi
```

Claude chỉ thấy `name` + `description` của skill rồi tự quyết định có nạp hay không. Không có gì bắt buộc, nên **có thể bị bỏ qua** — nhất là khi câu lệnh của bạn ngắn và mơ hồ ("sửa cái bug này"). Nếu muốn chắc, dùng cách 1.

**Khi không chắc dùng skill nào:** gọi `/agent-skills:using-agent-skills`. Đây là skill điều phối, nó có cây quyết định dẫn bạn tới skill đúng.

---

## 17 skill không có command

Phần lớn skill **không** có command tương ứng. Với những skill này, gọi trực tiếp là cách duy nhất để dùng chúng:

| Skill (gọi trực tiếp) | Tóm tắt một dòng | Chi tiết |
|---|---|---|
| `interview-me` | Moi ra ý định thật của bạn bằng cách hỏi từng câu một | [Define](#giai-đoạn-1--hiểu-và-định-hình-define) |
| `idea-refine` | Mở rộng nhiều phương án rồi chốt một | [Define](#giai-đoạn-1--hiểu-và-định-hình-define) |
| `context-engineering` | Nạp đúng context, tinh chỉnh file rule của project | [Build](#giai-đoạn-3--xây-dựng-build) |
| `source-driven-development` | Đối chiếu với tài liệu chính thức trước khi code | [Build](#giai-đoạn-3--xây-dựng-build) |
| `doubt-driven-development` | Phản biện mọi quyết định rủi ro cao trước khi làm | [Build](#giai-đoạn-3--xây-dựng-build) |
| `frontend-ui-engineering` | Dựng UI production: accessible, responsive | [Build](#giai-đoạn-3--xây-dựng-build) |
| `api-and-interface-design` | Thiết kế API và ranh giới module ổn định | [Build](#giai-đoạn-3--xây-dựng-build) |
| `browser-testing-with-devtools` | Test trong browser thật qua Chrome DevTools MCP | [Verify](#giai-đoạn-4--kiểm-chứng-verify) |
| `debugging-and-error-recovery` | Tìm nguyên nhân gốc thay vì đoán | [Verify](#giai-đoạn-4--kiểm-chứng-verify) |
| `security-and-hardening` | Bịt lỗ hổng OWASP, rà soát dependency | [Review](#giai-đoạn-5--soát-xét-review) |
| `performance-optimization` | Tối ưu hiệu năng — đo trước, tối ưu sau | [Review](#giai-đoạn-5--soát-xét-review) |
| `git-workflow-and-versioning` | Tách working tree bừa thành commit nguyên tứ, PR, release | [Ship](#giai-đoạn-6--phát-hành-ship) |
| `ci-cd-and-automation` | Dựng pipeline build & deploy, quality gate | [Ship](#giai-đoạn-6--phát-hành-ship) |
| `observability-and-instrumentation` | Gắn log, metric, trace, alert để thấy được production | [Ship](#giai-đoạn-6--phát-hành-ship) |
| `documentation-and-adrs` | Ghi lại **lý do** của quyết định kiến trúc | [Ship](#giai-đoạn-6--phát-hành-ship) |
| `deprecation-and-migration` | Khai tỷ hệ thống cũ, migration không downtime | [Ship](#giai-đoạn-6--phát-hành-ship) |
| `using-agent-skills` | Cây quyết định chọn skill + 6 hành vi cốt lõi | [Meta](#meta) |

Cột "Chi tiết" dẫn tới bảng đầy đủ ở dưới: gọi khi nào, đầu ra là gì.

9 skill còn lại vừa gọi trực tiếp được, vừa có command gói sẵn: `project-analysis` (`/analyze`), `spec-driven-development` (`/spec`), `constraint-driven-development` (`/constraints`), `planning-and-task-breakdown` (`/plan`), `incremental-implementation` (`/build`), `test-driven-development` (`/test`), `code-review-and-quality` (`/review`), `code-simplification` (`/code-simplify`), `shipping-and-launch` (`/ship`).

---

## Giai đoạn 1 — Hiểu và định hình (Define)

| Skill | Tác dụng | Gọi khi nào | Đầu ra | Command |
|---|---|---|---|---|
| **interview-me** | Phỏng vấn bạn **mỗi lần một câu** cho tới khi hiểu ~95% ý định thật, thay vì đoán rồi làm sai | Yêu cầu còn thiếu "cho ai" và "vì sao bây giờ". Hoặc bạn muốn bị chất vấn: "grill me", "chắc chưa?" | Bản mô tả ý định đã được xác nhận | — |
| **idea-refine** | Mài ý tưởng thô thành khái niệm rõ ràng: mở rộng nhiều phương án (divergent) rồi chốt một (convergent) | Ý tưởng còn mơ hồ, hoặc muốn thử sức chịu đựng của giả định trước khi lập kế hoạch | Danh sách phương án + phương án được chọn kèm lý do | — |
| **project-analysis** | Phân tích codebase có sẵn thành một bộ tài liệu có dẫn chứng, số file tùy quy mô dự án: miền nghiệp vụ, kiến trúc, tech stack, dữ liệu, tích hợp, số liệu, giấy phép, cách chạy và test, kèm tài liệu riêng cho từng nghiệp vụ khi cần. Rủi ro và chỗ còn thiếu được báo trong chat, thành file khi bạn đồng ý | Mới nhận một dự án người khác đã làm, cần hiểu trước khi sửa gì | `docs/analysis/` | `/analyze` |
| **spec-driven-development** | Viết đặc tả trước khi viết code: mục tiêu, phạm vi, tiêu chí nghiệm thu | Bắt đầu project/feature mới mà chưa có spec. Hoặc yêu cầu còn mơ hồ | `SPEC.md` | `/spec` |
| **constraint-driven-development** | Biến tiêu chuẩn chất lượng thành **hợp đồng viết ra giấy**, rồi canh diff xem agent có âm thầm hạ chuẩn không (thêm `@ts-ignore`, skip test, xoá assertion, sửa ngưỡng xuống) | Chưa có tiêu chuẩn nào được ghi lại. Hoặc agent cứ tắt check để cho test xanh | `CONSTRAINTS.md` | `/constraints` |

---

## Giai đoạn 2 — Lập kế hoạch (Plan)

| Skill | Tác dụng | Gọi khi nào | Đầu ra | Command |
|---|---|---|---|---|
| **planning-and-task-breakdown** | Chia việc thành các task nhỏ, có thứ tự, mỗi task kiểm chứng được | Đã có spec, cần chia việc. Hoặc task to quá không biết bắt đầu từ đâu | `tasks/plan.md` + `tasks/todo.md` | `/plan` |

---

## Giai đoạn 3 — Xây dựng (Build)

| Skill | Tác dụng | Gọi khi nào | Đầu ra | Command |
|---|---|---|---|---|
| **incremental-implementation** | Giao hàng theo **lát mỏng kiểm chứng được**, không đổ một đống code một lần | Thay đổi chạm nhiều hơn một file. Hoặc bạn sắp viết rất nhiều code cùng lúc. Hoặc cần rollout sau feature flag | Mỗi lát một commit | `/build` |
| **source-driven-development** | Đối chiếu mọi quyết định với **tài liệu chính thức** trước khi code, kèm trích dẫn nguồn | Làm với framework/library mà sai là tốn kém. Muốn code không dùng pattern đã lỗi thời | Code có chú thích nguồn | — |
| **doubt-driven-development** | Đưa mọi quyết định không-tầm-thường qua một vòng **phản biện bằng context mới** trước khi cho qua | Việc rủi ro cao: auth production, logic bảo mật, migration lớn, thao tác không thể hoàn tác. Hoặc làm trong code lạ | Danh sách giả định đã bị chất vấn + điểm yếu tìm được | — |
| **context-engineering** | Nạp đúng context vào đúng lúc, cấu hình file rule cho project | Mở session mới. Chất lượng output tụt dần. Chuyển sang task khác | `CLAUDE.md` / `AGENTS.md` được tinh chỉnh | — |
| **frontend-ui-engineering** | Dựng UI **chất lượng production**: accessible, responsive, không bị cái vẻ "do AI sinh ra" | Làm hoặc sửa giao diện, component, layout. Cần đạt WCAG | Component + ghi chú accessibility | — |
| **api-and-interface-design** | Thiết kế API và ranh giới module ổn định, hợp đồng rõ ràng | Thiết kế REST/GraphQL endpoint, định nghĩa type contract giữa các module, chia ranh giới frontend/backend | Định nghĩa interface + hợp đồng | — |

---

## Giai đoạn 4 — Kiểm chứng (Verify)

| Skill | Tác dụng | Gọi khi nào | Đầu ra | Command |
|---|---|---|---|---|
| **test-driven-development** | Vòng **đỏ → xanh → refactor**: viết test fail trước, rồi mới code cho pass | Làm bất kỳ logic nào. Sửa bất kỳ bug nào — viết test tái hiện lỗi **trước** khi sửa | Test + code đã pass | `/test` |
| **browser-testing-with-devtools** | Test trong trình duyệt thật qua Chrome DevTools MCP: đọc DOM, bắt lỗi console, xem network, profile hiệu năng | Debug thứ gì chạy trong browser, cần dữ liệu runtime thật chứ không phải phỏng đoán | Bằng chứng runtime | — |
| **debugging-and-error-recovery** | Tìm **nguyên nhân gốc** có hệ thống: tái hiện → khoanh vùng → sửa → chốt bằng test | Test fail, build vỡ, hôm qua chạy hôm nay không, hành vi khác mong đợi | Nguyên nhân gốc + bản sửa + test chặn tái phát | — |

> `browser-testing-with-devtools` cần MCP server `chrome-devtools` được cấu hình sẵn. Không có thì skill không chạy được.

---

## Giai đoạn 5 — Soát xét (Review)

| Skill | Tác dụng | Gọi khi nào | Đầu ra | Command |
|---|---|---|---|---|
| **code-review-and-quality** | Review theo nhiều trục: đúng đắn, dễ đọc, kiến trúc, bảo mật, hiệu năng | Trước khi merge bất cứ thứ gì. Review code của mình, của agent khác, hay của người khác. Dán diff vào cũng được | Phát hiện phân loại Critical / Required / Optional / Nit kèm `file:line` | `/review` |
| **code-simplification** | Làm code gọn hơn mà **không đổi hành vi** | Code chạy đúng nhưng khó đọc, khó sửa, lồng quá sâu | Code đã gọn + test vẫn xanh | `/code-simplify` |
| **security-and-hardening** | Bịt lỗ hổng: OWASP Top Ten, validate input, least privilege, rà soát dependency, GDPR/CCPA | Có xử lý input không tin cậy, auth, session, lưu dữ liệu, tích hợp bên thứ ba. Hoặc đang triage kết quả `npm audit` | Danh sách lỗ hổng + bản vá | — |
| **performance-optimization** | Tối ưu hiệu năng frontend, backend, query, database — **đo trước, tối ưu sau** | Có yêu cầu về hiệu năng, nghi ngờ bị chậm đi, Core Web Vitals kém, có N+1 query | `PERF.md` + bản tối ưu có số đo | — |

> **Đừng đoán mà tối ưu.** `performance-optimization` yêu cầu có số đo trước. Không có baseline thì không biết mình có cải thiện gì hay không.

---

## Giai đoạn 6 — Phát hành (Ship)

| Skill | Tác dụng | Gọi khi nào | Đầu ra | Command |
|---|---|---|---|---|
| **git-workflow-and-versioning** | Commit nguyên tử, history sạch, branch, giải quyết conflict, mở/review PR, cắt release và semantic version | Làm bất kỳ thay đổi code nào. Đặc biệt hữu ích khi **working tree đang bừa** và cần tách thành các commit gọn | Commit sạch / PR / tag / changelog | — |
| **ci-cd-and-automation** | Dựng pipeline build & deploy, tự động hoá quality gate, cấu hình test runner trong CI | Thiết lập hoặc sửa pipeline | File cấu hình CI | — |
| **observability-and-instrumentation** | Gắn log, metric, trace, alert để thấy được hành vi production | Ship feature chạy production và cần bằng chứng nó hoạt động. Hoặc có sự cố mà dữ liệu hiện có không đủ để biết đã xảy ra gì | Structured log + RED metric + alert theo triệu chứng | — |
| **documentation-and-adrs** | Ghi lại **lý do** của quyết định kiến trúc, không chỉ ghi cái gì đã làm | Có quyết định kiến trúc cần lưu. Đổi public API. Ship feature | ADR trong `docs/` | — |
| **deprecation-and-migration** | Khai tử hệ thống cũ và di chuyển người dùng an toàn | Xoá API/feature cũ. Migration schema production không downtime (expand/contract) | Kế hoạch migration theo giai đoạn | — |
| **shipping-and-launch** | Checklist trước phát hành, monitoring, rollout từng phần, kế hoạch rollback | Chuẩn bị deploy production | Quyết định **GO / NO-GO** + kế hoạch rollback | `/ship` |

---

## Meta

| Skill | Tác dụng | Gọi khi nào |
|---|---|---|
| **using-agent-skills** | Cây quyết định chọn skill, cộng 6 hành vi cốt lõi áp dụng mọi lúc: nêu giả định ra, xử lý chỗ mình đang mơ hồ, phản biện khi cần, giữ sự đơn giản, không làm quá phạm vi, phải kiểm chứng | Đầu session. Hoặc khi không biết task này thuộc skill nào |

---

## Chọn nhanh theo tình huống

```
Chưa biết mình muốn gì ─────────────→ interview-me
Có ý tưởng, cần nhiều phương án ───→ idea-refine
Nhận dự án người khác đã làm ──────→ project-analysis
Bắt đầu feature mới ───────────────→ spec-driven-development
Chưa có tiêu chuẩn chất lượng ─────→ constraint-driven-development
Có spec, cần chia task ────────────→ planning-and-task-breakdown
Đang viết code ────────────────────→ incremental-implementation
   ├─ làm UI ──────────────────────→ frontend-ui-engineering
   ├─ làm API ─────────────────────→ api-and-interface-design
   ├─ cần đúng theo docs ──────────→ source-driven-development
   └─ việc rủi ro cao / code lạ ───→ doubt-driven-development
Viết test ─────────────────────────→ test-driven-development
   └─ chạy trong browser ──────────→ browser-testing-with-devtools
Có cái gì vỡ ──────────────────────→ debugging-and-error-recovery
Review trước merge ────────────────→ code-review-and-quality
   ├─ code rối ───────────────────→ code-simplification
   ├─ lo bảo mật ─────────────────→ security-and-hardening
   └─ lo chậm ────────────────────→ performance-optimization
Commit / PR / release ─────────────→ git-workflow-and-versioning
Dựng CI/CD ────────────────────────→ ci-cd-and-automation
Thêm log / metric / alert ─────────→ observability-and-instrumentation
Ghi lại quyết định ────────────────→ documentation-and-adrs
Khai tử hệ thống cũ ───────────────→ deprecation-and-migration
Deploy production ─────────────────→ shipping-and-launch
Không biết chọn gì ────────────────→ using-agent-skills
```

---

## Mấy điều nên biết trước khi dùng

**Gọi skill tốn token.** Lúc bình thường chỉ phần `description` ngắn nằm trong context. Toàn bộ nội dung skill (khoảng 150–400 dòng, tức 3–6k token) chỉ được nạp khi skill được gọi. Nên đừng gọi 5 skill một lúc cho vui.

**Nhiều skill có thể dùng nối tiếp.** Một feature trọn vẹn thường đi: `spec-driven-development` → `planning-and-task-breakdown` → `incremental-implementation` → `test-driven-development` → `code-review-and-quality` → `shipping-and-launch`. Một bug fix thì chỉ cần: `debugging-and-error-recovery` → `test-driven-development` → `code-review-and-quality`.

**Skill là quy trình, không phải gợi ý.** Làm theo đúng thứ tự các bước, đừng bỏ bước kiểm chứng ở cuối.

**Skill mới thêm vào repo phải `/plugin update` mới gọi được.** Ví dụ `project-analysis` có trong repo nhưng bản plugin đang cài là `0.6.14` — nếu `/agent-skills:project-analysis` báo `Unknown skill`, chạy `/plugin update` rồi mở lại session.
