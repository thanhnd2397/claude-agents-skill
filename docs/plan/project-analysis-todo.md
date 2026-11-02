# Danh sách task: `project-analysis`

Spec: [docs/SPEC.md](../SPEC.md). Plan: [project-analysis-plan.md](project-analysis-plan.md).

**Bộ lệnh kiểm tra CI**, gọi tắt là "CI cục bộ" trong các task dưới đây:

```bash
node scripts/validate-skills.js
node scripts/validate-commands.js
node scripts/validate-artifact-paths.js
node scripts/validate-reference-links.js
node scripts/validate-versions.js
node scripts/run-evals.js --min-rank1 95
```

Mốc trước khi làm (2026-11-02): tất cả đều qua, rank-1 đạt 99% (94/95).

Làm trên nhánh riêng, không làm trực tiếp trên `main`.

---

## Giai đoạn 1: Skill hoạt động

## Task 1: Tạo fixture `fresh`

**Mô tả:** Tạo một dự án nhỏ có các đáp án đã biết để eval chấm được báo cáo. Thêm các điểm cần phát hiện theo mục Testing Strategy của spec. Secret và chỉ thị giả phải rõ ràng là giả.

**Tiêu chí chấp nhận:**
- [ ] Có đủ 5 điểm: quy tắc đọc được từ code, README mâu thuẫn với code, quy tắc không suy ra được, secret giả, chỉ thị giả trong comment
- [ ] Có đủ nguyên liệu cho các mục báo cáo: manifest, điểm vào, schema, một tích hợp ngoài, script test và CI
- [ ] Mọi file đều được git theo dõi

**Kiểm tra:**
- [ ] `git check-ignore` không bỏ qua file nào trong fixture
- [ ] CI cục bộ qua

**Phụ thuộc:** Không

**File dự kiến:**
- `evals/fixtures/project-analysis/fresh/` (khoảng 6 đến 8 file nhỏ, gồm `README.md`, `package.json`, `src/`, `db/schema.sql`, `config/credentials.yml`)

**Quy mô:** M

## Task 2: Viết skill và file eval

**Mô tả:** Viết `SKILL.md` theo quy trình 8 bước, bốn nhãn và các ranh giới trong spec. Thêm file eval với trigger và eval hành vi đầu tiên trên fixture `fresh`.

**Tiêu chí chấp nhận:**
- [ ] `SKILL.md` có đủ các phần bắt buộc, dưới 500 dòng, tham chiếu skill khác thay vì chép nội dung
- [ ] Có ít nhất 3 positive trigger và 2 negative trigger, gồm negative có `owner` cho `context-engineering` và `doubt-driven-development`
- [ ] Eval 1 có expectation cho từng tiêu chí 2, 3, 4, 5, 9 của spec

**Kiểm tra:**
- [ ] CI cục bộ qua, rank-1 từ 95% trở lên, không có cảnh báo trùng mô tả mới
- [ ] `node scripts/run-evals.js --behavioral project-analysis --dry-run` tìm thấy fixture

**Phụ thuộc:** Task 1

**File dự kiến:**
- `skills/project-analysis/SKILL.md`
- `evals/cases/project-analysis.json`

**Quy mô:** S

## Task 3: Thêm lệnh `/analyze`

**Mô tả:** Thêm lệnh gọi skill và nhận tham số phạm vi, theo mẫu của các lệnh hiện có.

**Tiêu chí chấp nhận:**
- [ ] Lệnh có `description`, `disable-model-invocation: true`, gọi `agent-skills:project-analysis` và truyền `$ARGUMENTS`
- [ ] Đã kiểm tra `/analyze` có trùng lệnh có sẵn của Claude Code không, và ghi kết quả vào mục Open Questions của spec

**Kiểm tra:**
- [ ] `node scripts/validate-commands.js` qua

**Phụ thuộc:** Task 2

**File dự kiến:**
- `.claude/commands/analyze.md`
- `docs/SPEC.md`

**Quy mô:** XS

### Checkpoint 1
- [ ] CI cục bộ qua, không có cảnh báo trùng mô tả mới

---

## Giai đoạn 2: Chứng minh hành vi

## Task 4: Chạy eval hành vi và sửa skill

**Mô tả:** Chạy eval hành vi thật và sửa `SKILL.md` theo các lỗi phát hiện được. Bước này tốn token.

**Tiêu chí chấp nhận:**
- [ ] Tất cả expectation của eval 1 đều đạt
- [ ] Các expectation không bị nới lỏng để eval qua. Nếu một expectation thật sự sai, phải nêu lý do khi sửa
- [ ] Trong báo cáo, secret giả không xuất hiện và chỉ thị giả không được làm theo

**Kiểm tra:**
- [ ] `node scripts/run-evals.js --behavioral project-analysis`, xem kết quả trong `evals/results/`
- [ ] Tự đối chiếu một số dẫn chứng `file:dòng` với fixture

**Phụ thuộc:** Task 2

**File dự kiến:**
- `skills/project-analysis/SKILL.md`
- `evals/cases/project-analysis.json`

**Quy mô:** S

## Task 5: Hỗ trợ chạy lại và câu trả lời của người dùng

**Mô tả:** Thêm fixture đã có báo cáo cũ. Eval gửi câu trả lời cho một câu hỏi còn mở, sau đó kiểm tra báo cáo được cập nhật đúng.

**Tiêu chí chấp nhận:**
- [ ] Câu trả lời mới có nhãn `[User]`, câu hỏi tương ứng được đóng, các nội dung không liên quan được giữ nguyên
- [ ] Câu trả lời `[User]` cũ không mất, và không có file báo cáo thứ hai

**Kiểm tra:**
- [ ] Eval 2 đạt khi chạy `--behavioral project-analysis`
- [ ] CI cục bộ qua

**Phụ thuộc:** Task 4

**File dự kiến:**
- `evals/fixtures/project-analysis/rerun/`
- `evals/cases/project-analysis.json`
- `skills/project-analysis/SKILL.md`

**Quy mô:** M

## Task 6: Hỗ trợ phân tích theo phạm vi

**Mô tả:** Thêm eval dùng fixture `fresh` với một đường dẫn cụ thể, và sửa skill nếu eval phát hiện lỗi.

**Tiêu chí chấp nhận:**
- [ ] Báo cáo nêu rõ phạm vi đã phân tích
- [ ] Nhận định và dẫn chứng chỉ nằm trong phạm vi, phần ngoài phạm vi được ghi là chưa phân tích

**Kiểm tra:**
- [ ] Eval 3 đạt khi chạy `--behavioral project-analysis`
- [ ] CI cục bộ qua

**Phụ thuộc:** Task 4

**File dự kiến:**
- `evals/cases/project-analysis.json`
- `skills/project-analysis/SKILL.md`

**Quy mô:** S

### Checkpoint 2
- [ ] Cả ba eval hành vi đều đạt
- [ ] Bạn đã xem một báo cáo mẫu và đồng ý trước khi tiếp tục

---

## Giai đoạn 3: Đăng ký và kiểm tra cuối

## Task 7: Đăng ký skill trong catalog

**Mô tả:** Thêm skill và lệnh vào các danh sách dành cho agent và người đóng góp.

**Tiêu chí chấp nhận:**
- [ ] `README.md` có lệnh và skill mới, số lượng đổi từ 25 thành 26 skill, 24 thành 25 lifecycle skill, 25 thành 26 case file
- [ ] `CLAUDE.md` có skill trong "Skills by Phase" và lệnh trong danh sách lệnh
- [ ] Sơ đồ, thứ tự và bảng trong `using-agent-skills` có skill mới, trước `spec-driven-development`

**Kiểm tra:**
- [ ] CI cục bộ qua
- [ ] Tìm trong repo không còn số lượng cũ chưa được cập nhật

**Phụ thuộc:** Task 3, Task 6

**File dự kiến:**
- `README.md`
- `CLAUDE.md`
- `skills/using-agent-skills/SKILL.md`

**Quy mô:** S

## Task 8: Cập nhật tài liệu cho người dùng

**Mô tả:** Hướng dẫn người dùng chạy `/analyze` khi vào dự án có sẵn.

**Tiêu chí chấp nhận:**
- [ ] `docs/getting-started.md` có dòng ánh xạ lệnh và skill
- [ ] `docs/adoption-guide.md` Path B đưa `/analyze` vào bước đầu, trước khi viết file rules bằng `context-engineering`
- [ ] `docs/tech/huong-dan-su-dung.md` có lệnh mới và câu ở dòng 79 không còn chỉ dẫn dùng `context-engineering` để tìm hiểu codebase mới

**Kiểm tra:**
- [ ] `node scripts/validate-artifact-paths.js` và `node scripts/validate-reference-links.js` qua

**Phụ thuộc:** Task 7

**File dự kiến:**
- `docs/getting-started.md`
- `docs/adoption-guide.md`
- `docs/tech/huong-dan-su-dung.md`

**Quy mô:** S

## Task 9: Kiểm tra cuối trước PR

**Mô tả:** Đối chiếu kết quả với toàn bộ tiêu chí của spec, chạy thử trên một dự án thật và đóng các câu hỏi còn mở.

**Tiêu chí chấp nhận:**
- [ ] Đã chạy CI cục bộ và các test của script mà CI chạy
- [ ] `/agent-skills:analyze` chạy được từ plugin đã cài trên một dự án thật, và đã xác định có cần tăng version không
- [ ] Đã kiểm tra PR và issue đang mở, và cập nhật trạng thái spec

**Kiểm tra:**
- [ ] Đối chiếu từng tiêu chí trong 9 Success Criteria của spec
- [ ] `git status` trên dự án thật chỉ có thêm file báo cáo

**Phụ thuộc:** Task 8

**File dự kiến:**
- `docs/SPEC.md`
- `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` (nếu tăng version)

**Quy mô:** S

### Checkpoint 3
- [ ] Đạt đủ 9 tiêu chí trong Success Criteria
- [ ] Bạn đã duyệt và sẵn sàng mở PR
