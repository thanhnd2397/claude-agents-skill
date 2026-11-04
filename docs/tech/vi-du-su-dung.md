# Ví dụ sử dụng: làm một tính năng từ đầu đến khi ship

Tài liệu này đi qua **một tính năng cụ thể** từ lúc chỉ có ý tưởng đến lúc deploy, để bạn thấy mình gõ gì và nhận lại gì ở từng bước. Phần tra cứu command, skill và agent nằm ở [huong-dan-su-dung.md](huong-dan-su-dung.md); ở đây chỉ có ví dụ.

Tính năng ví dụ: **đặt lại mật khẩu qua email** cho một web app Next.js có sẵn.

> Các đoạn phản hồi của Claude trong tài liệu này được **tóm lược cho ngắn**, không phải bản ghi nguyên văn. Nội dung thật sẽ dài hơn và khác theo dự án của bạn.

---

## Bước 0: Mở Claude Code trong dự án của bạn

```bash
cd ~/projects/my-app
claude
```

Gõ `/` để kiểm tra plugin đã cài. Nếu thấy `/agent-skills:spec` trong danh sách là được.

---

## Bước 1: Viết spec

Bạn gõ, kèm mô tả ngắn ngay sau lệnh:

```
/agent-skills:spec Đặt lại mật khẩu qua email cho người dùng đã đăng ký
```

Claude nêu giả định và hỏi lại:

```
GIẢ ĐỊNH CỦA TÔI:
1. Dùng Next.js App Router và Prisma, dựa trên repo này
2. Email gửi qua Resend, vì đã có RESEND_API_KEY trong .env.example
3. Link đặt lại hết hạn sau 1 giờ
→ Sai chỗ nào bạn sửa giúp tôi.

Câu hỏi:
- Link đặt lại dùng được một lần hay nhiều lần?
- Có giới hạn số lần gửi yêu cầu không?
```

Bạn trả lời ngắn gọn, không cần trang trọng:

```
Đúng cả. Link chỉ dùng 1 lần. Giới hạn 3 lần mỗi email mỗi giờ.
```

Claude viết `SPEC.md` ở thư mục gốc rồi **dừng lại chờ bạn duyệt**. Spec gồm mục tiêu, tech stack, lệnh build/test, cấu trúc file, quy ước code, chiến lược test, ranh giới và tiêu chí hoàn thành.

Bạn mở `SPEC.md` đọc. Thấy thiếu thì nói thẳng:

```
Thêm vào spec: không được ghi token đặt lại vào log.
```

Khi thấy ổn:

```
Duyệt spec.
```

**Nên làm:** gõ `/clear` sau khi duyệt. Spec đã nằm trên đĩa nên phiên mới vẫn đọc được, và bạn tiết kiệm được kha khá token.

---

## Bước 2: Chia việc

```
/agent-skills:plan
```

Claude đọc `SPEC.md`, chia việc theo chiều dọc rồi lưu vào `tasks/plan.md` và `tasks/todo.md`:

```
Task 1: Lưu token đặt lại (migration + model + test)
Task 2: API POST /api/password-reset gửi email (có giới hạn 3 lần/giờ)
Task 3: API POST /api/password-reset/confirm đổi mật khẩu
Task 4: Trang nhập email và trang đặt mật khẩu mới

Checkpoint sau Task 1-3: chạy hết test, thử luồng bằng curl
```

Mỗi task là một luồng hoàn chỉnh, không phải một lớp kỹ thuật. Nhờ vậy sau mỗi task hệ thống vẫn chạy được.

Bạn duyệt plan, hoặc yêu cầu gộp, tách, đổi thứ tự.

---

## Bước 3: Code từng task

```
/agent-skills:build
```

Claude làm **một** task rồi dừng. Vòng lặp của mỗi task:

| Bước | Việc |
|---|---|
| RED | Viết test cho hành vi mong muốn, chạy và cho thấy test **fail** |
| GREEN | Viết code tối thiểu để test pass |
| Regression | Chạy toàn bộ test |
| Build | Chạy lệnh build |
| Commit | Commit riêng cho task đó |

Xong Task 1, Claude dừng và báo kết quả. Bạn gõ `/clear` rồi `/agent-skills:build` tiếp cho Task 2. Lặp lại đến hết.

**Nếu plan đã chắc chắn**, bạn có thể dùng một lệnh cho tất cả:

```
/agent-skills:build auto
```

Bạn duyệt **một lần**, sau đó Claude làm hết các task, mỗi task một commit. Lưu ý: cách này không rẻ hơn tính theo từng task, vì mỗi task vẫn chạy đủ vòng lặp test. Nó chỉ bỏ bước bạn phải duyệt giữa các task, và context sẽ phình dần.

### Khi gặp lỗi giữa đường

Bạn không cần làm gì thêm. Lúc test fail, Claude tự chuyển sang `debugging-and-error-recovery` và đi theo 5 bước: tái hiện, khoanh vùng, thu nhỏ, sửa, chặn lỗi quay lại.

Khi task đụng tới việc rủi ro, như xác thực hay xóa dữ liệu, Claude chuyển sang `doubt-driven-development` và **dừng lại hỏi bạn** trước khi làm.

---

## Bước 4: Rà soát code

```
/agent-skills:review src/app/api/password-reset/
```

Nêu rõ phạm vi như trên để Claude không đọc cả repo. Kết quả được phân loại theo mức độ:

```
Critical: token so sánh bằng === nên bị lộ qua timing attack
          (src/app/api/password-reset/confirm/route.ts:34)
Required: thiếu test cho trường hợp token hết hạn
Nit:      tên biến `t` nên đổi thành `token`
```

`Critical` và `Required` phải sửa trước khi merge. `Nit` thì tùy bạn.

Nhờ sửa:

```
Sửa Critical và Required.
```

Nếu code chạy đúng nhưng rối, thêm một bước:

```
/agent-skills:code-simplify src/app/api/password-reset/
```

Bước này giữ nguyên hành vi và chạy test sau mỗi thay đổi.

---

## Bước 5: Kiểm tra trước khi ship

```
/agent-skills:ship
```

Lệnh này gọi **3 agent chạy song song**, mỗi agent có context riêng: `code-reviewer`, `security-auditor` và `test-engineer`. Kết quả là một quyết định:

```
NO-GO
- security-auditor: token đặt lại được ghi vào log ở lib/mailer.ts:28
- test-engineer: chưa có test cho giới hạn 3 lần/giờ

Sửa hai điểm trên thì chuyển thành GO.
Kế hoạch rollback: revert commit a1b2c3d, không có migration cần hoàn tác.
```

Đây là lệnh tốn token nhất, nên chỉ dùng khi thật sự deploy lên production. Thay đổi nội bộ thì `/agent-skills:review` là đủ.

---

## Ví dụ ngắn: sửa một bug

Không phải việc gì cũng cần cả 5 bước. Với bug, bỏ qua `/spec` và `/plan`:

```
/agent-skills:test Giỏ hàng tính sai tiền khi xóa món cuối cùng, ra -0.00
```

Claude viết test tái hiện lỗi trước, cho thấy test fail, rồi mới sửa code. Kết quả là bạn có một test chặn lỗi này quay lại, điều mà việc sửa trực tiếp không cho bạn.

Sau đó rà soát phần vừa sửa:

```
/agent-skills:review src/cart/
```

## Ví dụ ngắn: tính năng nhỏ 1-3 file

Viết spec 2 dòng ngay trong prompt là đủ, không cần file `SPEC.md`:

```
/agent-skills:build Thêm nút copy link vào trang chi tiết đơn hàng.
Bấm vào thì copy URL hiện tại và hiện toast "Đã copy" trong 2 giây.
```

---

## Toàn bộ luồng trong một hình

```
Ý tưởng mơ hồ
   │
   ├─ "interview me về ý tưởng X"      ← khi chưa rõ mình muốn gì
   │
   ▼
/agent-skills:spec      → SPEC.md           → bạn duyệt → /clear
   ▼
/agent-skills:plan      → tasks/plan.md     → bạn duyệt → /clear
   ▼
/agent-skills:build     → code + test + commit, mỗi task một lần
   │                      (lặp lại, /clear giữa các task)
   ▼
/agent-skills:review    → sửa Critical và Required
   ▼
/agent-skills:ship      → GO hoặc NO-GO     ← chỉ khi lên production
```

---

## Ba lỗi thường gặp

| Lỗi | Hậu quả | Cách đúng |
|---|---|---|
| Gõ `/agent-skills:spec` mà không mô tả gì | Claude không có gì để viết spec | Mô tả ngắn ngay sau tên lệnh |
| Chạy lệnh trong repo `agent-skills` | `SPEC.md` được tạo trong repo skill, không phải dự án của bạn | Mở Claude Code trong dự án của bạn |
| Dùng `/ship` cho mọi thay đổi | Tốn token gấp nhiều lần vì gọi 3 agent | Chỉ dùng khi deploy production |

Nếu bạn gõ sai tên lệnh, ví dụ `/agent-skill:spec` thiếu chữ `s`, lệnh sẽ không chạy và Claude xử lý tin nhắn đó như một câu nói thường. Hãy gõ `/` rồi chọn từ danh sách cho chắc.
