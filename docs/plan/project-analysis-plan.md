# Kế hoạch triển khai: Luồng phân tích dự án (`project-analysis`)

Spec: [docs/SPEC.md](../SPEC.md). Danh sách task chi tiết: [project-analysis-todo.md](project-analysis-todo.md).

## Tổng quan

Thêm skill `project-analysis`, lệnh `/analyze` và bộ eval đi kèm, rồi đăng ký chúng trong tài liệu của repo. Không thêm script hay dependency. Rủi ro lớn nhất nằm ở hai việc: skill có được gọi đúng lúc không, và agent có thật sự tuân theo quy tắc về dẫn chứng và secret không. Vì vậy các eval này được làm trước phần tài liệu.

## Quyết định thiết kế

| Quyết định | Lý do |
|---|---|
| Làm fixture trước `SKILL.md` | CI bắt buộc mỗi skill có file eval, và execution eval phải có fixture. Fixture không làm CI đỏ khi đứng một mình. |
| Thêm skill và file eval trong cùng một task | Thêm riêng skill sẽ làm `run-evals.js` báo lỗi thiếu case file. |
| Dùng hai fixture, `fresh` và `rerun` | Eval hành vi chỉ gửi một prompt. Fixture `rerun` có sẵn báo cáo cũ nên kiểm tra được việc cập nhật và giữ câu trả lời `[User]`. |
| Lưu secret giả trong `config/credentials.yml` | `.gitignore` bỏ qua `.env` và `.env.*`, nên file theo các tên đó sẽ không được commit vào repo. |
| Giữ mẫu báo cáo trong `SKILL.md` trừ khi vượt 100 dòng | Đây là quy ước của repo về supporting file. |
| Lưu plan trong `docs/plan/` | Theo quy tắc `docs/` của bạn. Xem hệ quả ở Câu hỏi còn mở. |

## Thứ tự phụ thuộc

```
T1 Fixture fresh
 └─ T2 Skill + file eval
     ├─ T3 Lệnh /analyze
     └─ T4 Chạy eval hành vi lần đầu
         ├─ T5 Chạy lại và cập nhật báo cáo
         └─ T6 Phân tích theo phạm vi
             └─ T7 Đăng ký skill trong catalog
                 └─ T8 Tài liệu cho người dùng
                     └─ T9 Kiểm tra cuối trước PR
```

T5 và T6 đều sửa `SKILL.md` và file eval nên phải làm lần lượt. T7 và T8 sửa các file khác nhau, nhưng nên viết sau khi tên lệnh đã chốt ở T3 và hành vi đã ổn định ở T6.

## Danh sách task

### Giai đoạn 1: Skill hoạt động

- [ ] T1: Tạo fixture `fresh`
- [ ] T2: Viết skill và file eval
- [ ] T3: Thêm lệnh `/analyze`

**Checkpoint 1:** toàn bộ lệnh kiểm tra CI đều qua, không có cảnh báo trùng mô tả mới.

### Giai đoạn 2: Chứng minh hành vi

- [ ] T4: Chạy eval hành vi trên `fresh` và sửa skill theo kết quả
- [ ] T5: Hỗ trợ chạy lại và câu trả lời của người dùng
- [ ] T6: Hỗ trợ phân tích theo phạm vi

**Checkpoint 2:** cả ba eval hành vi đều đạt. Bạn xem một báo cáo mẫu trước khi tiếp tục.

### Giai đoạn 3: Đăng ký và kiểm tra cuối

- [ ] T7: Đăng ký skill trong catalog
- [ ] T8: Cập nhật tài liệu cho người dùng
- [ ] T9: Kiểm tra cuối trước PR

**Checkpoint 3:** đạt đủ 9 tiêu chí trong Success Criteria của spec.

## Rủi ro và cách xử lý

| Rủi ro | Mức độ | Cách xử lý |
|---|---|---|
| Mô tả skill trùng `context-engineering` hoặc `doubt-driven-development` ("unfamiliar code") | Cao | Thêm negative trigger có `owner` cho hai skill này ở T2. Nếu trùng, sửa mô tả, không sửa prompt. Ngưỡng: lỗi từ 75%, cảnh báo từ 50%. |
| Trigger eval tĩnh qua nhưng Claude Code không tự gọi skill | Trung bình | Lệnh `/analyze` vẫn gọi trực tiếp được. Plugin eval là tùy chọn, không nằm trong phạm vi bắt buộc. |
| Agent chép secret hoặc làm theo chỉ thị giả | Cao | Có expectation riêng trong eval `fresh`. Không đạt thì không sang T5. |
| Dẫn chứng `file:dòng` sai | Cao | Expectation yêu cầu đối chiếu dòng trong fixture. Skill yêu cầu đọc lại dòng được dẫn trước khi ghi. |
| Eval hành vi cho kết quả dao động và tốn token | Trung bình | Chạy `--dry-run` trước, chỉ chạy thật ở T4 đến T6. Ghi lại số lần đạt. |
| Fixture lồng nhau không được eval runner xử lý như dự kiến | Trung bình | Kiểm tra bằng `--dry-run` ở T2. Nếu không được, chuyển `rerun` thành eval riêng theo cách runner hỗ trợ. |
| Trùng tên lệnh `/analyze` | Thấp | Kiểm tra ở T3. Tên đầy đủ `/agent-skills:analyze` vẫn gọi được. |

## Câu hỏi còn mở

1. **`/build auto` không thấy plan này.** Lệnh này chỉ tìm `tasks/plan.md`, nếu không có sẽ tạo plan mới. Hãy dùng `/agent-skills:build` thường, chỉ rõ đường dẫn plan và làm từng task. Nếu muốn dùng `/build auto`, cần chuyển hai file sang `tasks/`, nhưng như vậy sẽ lệch quy tắc `docs/` của bạn.
2. **Có tăng version plugin không?** Plugin đang cài từ bản cache 0.6.14. Cần xác định ở T9 liệu có phải tăng version để máy nhận lệnh mới hay không.
3. **Kiểm tra PR và issue đang mở:** cần cài `gh` hoặc kiểm tra thủ công trên GitHub trước khi mở PR.
