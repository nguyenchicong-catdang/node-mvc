# Sử Dụng Regex để Bắt Khối

Để bắt và thay thế toàn bộ khối `<post-title><h2>post title</h2></post-title>` trong chuỗi HTML, bạn có thể sử dụng biểu thức chính quy (regex) với các ngôn ngữ lập trình. Cách tiếp cận tốt nhất là sử dụng regex để khớp chính xác toàn bộ khối, sau đó dùng hàm thay thế để chèn nội dung mới.

-----

### Sử Dụng Regex để Bắt Khối

Bạn có thể sử dụng mẫu regex sau để bắt toàn bộ khối:

```regex
<post-title>.*?<\/post-title>
```

**Giải thích:**

  * **`<post-title>`**: Khớp với chuỗi ký tự `<post-title>`.
  * **`.*?`**: Khớp với bất kỳ ký tự nào (`.`) không hoặc nhiều lần (`*`), nhưng theo cách **không tham lam (non-greedy)** (`?`). Điều này rất quan trọng để đảm bảo regex chỉ khớp đến thẻ `</post-title>` đầu tiên mà nó tìm thấy, thay vì tiếp tục khớp với các thẻ `</post-title>` khác nếu có.
  * **`<\/post-title>`**: Khớp với chuỗi ký tự `</post-title>`. Dấu `\` là ký tự thoát (escape character) vì `/` có ý nghĩa đặc biệt trong regex.

-----

### Ví Dụ Thay Thế với JavaScript

Giả sử bạn có chuỗi HTML sau:

```javascript
let htmlString = `
<main>
    <article>
        <post-title><h2>Tiêu đề bài viết 1</h2></post-title>
        <p>Nội dung bài viết 1...</p>
    </article>
    <article>
        <post-title><h2>Tiêu đề bài viết 2</h2></post-title>
        <p>Nội dung bài viết 2...</p>
    </article>
</main>
`;
```

Bạn muốn thay thế tất cả các khối `<post-title>...</post-title>` bằng một chuỗi rỗng hoặc một chuỗi HTML khác.

**1. Thay thế toàn bộ khối bằng một chuỗi mới:**

Sử dụng phương thức `replace()` với cờ `g` (global) để thay thế tất cả các lần xuất hiện của mẫu.

```javascript
let regex = /<post-title>.*?<\/post-title>/g; // Thêm cờ `g`

let newHtmlString = htmlString.replace(regex, '<p>Đây là tiêu đề mới được thay thế</p>');

console.log(newHtmlString);
```

**Kết quả:**

```html
<main>
    <article>
        <p>Đây là tiêu đề mới được thay thế</p>
        <p>Nội dung bài viết 1...</p>
    </article>
    <article>
        <p>Đây là tiêu đề mới được thay thế</p>
        <p>Nội dung bài viết 2...</p>
    </article>
</main>
```

**2. Bắt và chỉ thay thế nội dung bên trong `<post-title>`:**

Nếu bạn muốn giữ lại thẻ `<post-title>` và chỉ thay thế nội dung bên trong nó, bạn cần sử dụng một **nhóm bắt (capture group)**.

```javascript
let regex = /(<post-title>)(.*?)(<\/post-title>)/g;

let newHtmlString = htmlString.replace(regex, '$1<p>Tiêu đề mới</p>$3');

console.log(newHtmlString);
```

**Giải thích:**

  * `(<post-title>)`: Nhóm bắt `$1`.
  * `(.*?)`: Nhóm bắt `$2` (nội dung bên trong).
  * `(</post-title>)`: Nhóm bắt `$3`.
  * `$1`, `$3`: Tham chiếu đến các nhóm bắt `<post-title>` và `</post-title>`, giúp chúng không bị mất đi trong quá trình thay thế.

## v2
Để bắt và thay thế nhiều khối HTML khác nhau như `<post-title>`, `<post-description>`, v.v., bạn cần sử dụng **biểu thức chính quy (regex)** linh hoạt kết hợp với vòng lặp hoặc các phương thức thay thế nâng cao. Cách tiếp cận tốt nhất là sử dụng một hàm thay thế (replacement function) để xử lý từng khối một cách động.

-----

### Phương Pháp Thay Thế Từng Khối Một

Đây là phương pháp đơn giản nhất. Bạn sẽ viết một regex và một câu lệnh thay thế cho mỗi loại khối.

**Ví dụ với JavaScript:**

Giả sử bạn có chuỗi HTML sau:

```javascript
let htmlString = `
<main>
    <post-title><h2>Tiêu đề bài viết</h2></post-title>
    <post-description><p>Đây là mô tả tóm tắt của bài viết.</p></post-description>
</main>
`;
```

Bạn có thể thay thế từng khối như sau:

```javascript
// Thay thế khối <post-title>
let regexTitle = /<post-title>.*?<\/post-title>/g;
let newHtmlString = htmlString.replace(regexTitle, '<h1>Tiêu đề mới</h1>');

// Sau đó, thay thế khối <post-description> trên chuỗi đã thay đổi
let regexDescription = /<post-description>.*?<\/post-description>/g;
newHtmlString = newHtmlString.replace(regexDescription, '<p>Mô tả mới</p>');

console.log(newHtmlString);
```

Cách này hoạt động tốt nếu số lượng và loại khối của bạn là cố định và ít.

-----

### Phương Pháp Thay Thế Chung Dùng Hàm

Nếu bạn có nhiều loại khối và muốn xử lý tất cả chúng trong một lần quét, bạn có thể sử dụng một regex chung với một hàm thay thế.

**1. Sử dụng Regex chung:**

Bạn có thể tạo một regex để bắt bất kỳ khối nào có thẻ mở và đóng tương ứng, ví dụ như `<tên-thẻ>...</tên-thẻ>`. Tuy nhiên, cách này có thể phức tạp và dễ gặp lỗi nếu cấu trúc HTML của bạn không nhất quán. Một cách tiếp cận an toàn hơn là sử dụng các nhóm bắt (capture groups) để xác định tên thẻ.

**2. Sử dụng Hàm thay thế:**

Phương thức `replace()` của JavaScript có thể nhận một hàm làm đối số thứ hai. Hàm này sẽ được gọi cho mỗi lần khớp và kết quả trả về của hàm sẽ được dùng để thay thế chuỗi.

**Ví dụ nâng cao với JavaScript:**

```javascript
let htmlString = `
<main>
    <post-title><h2>Tiêu đề bài viết</h2></post-title>
    <post-description><p>Đây là mô tả tóm tắt của bài viết.</p></post-description>
</main>
`;

// Regex chung để bắt các khối tùy chỉnh
// Nhóm 1: Tên thẻ (<post-title> hoặc <post-description>)
// Nhóm 2: Nội dung bên trong
let regex = /<(post-title|post-description)>(.*?)<\/\1>/g;

let newHtmlString = htmlString.replace(regex, (match, tagName, content) => {
    // `tagName` là tên thẻ (ví dụ: "post-title")
    // `content` là nội dung bên trong thẻ (ví dụ: "<h2>Tiêu đề bài viết</h2>")

    switch(tagName) {
        case 'post-title':
            // Thay thế nội dung của <post-title> bằng <h1>
            return `<h1>${content.replace(/<.*?>/g, '')}</h1>`;
        case 'post-description':
            // Thay thế nội dung của <post-description> bằng một thẻ <span>
            return `<span>${content.replace(/<.*?>/g, '')}</span>`;
        default:
            return match; // Trả về chuỗi ban đầu nếu không khớp
    }
});

console.log(newHtmlString);
```

**Giải thích:**

  * **`<(post-title|post-description)>`**: Nhóm bắt này (`()`) sẽ khớp với một trong hai tên thẻ: `post-title` hoặc `post-description`. Giá trị khớp sẽ được lưu vào tham số `tagName`.
  * **`(.*?)`**: Nhóm bắt này sẽ lấy toàn bộ nội dung bên trong thẻ. Giá trị này được lưu vào tham số `content`.
  * **`<\/\1>`**: Đây là một tham chiếu ngược (backreference). Nó sẽ khớp với thẻ đóng tương ứng với thẻ mở mà nhóm `$1` đã bắt được. Ví dụ: nếu `$1` là `post-title`, `\1` sẽ là `post-title` và `</\1>` sẽ trở thành `</post-title>`.
  * **Hàm thay thế**: Hàm này cho phép bạn tùy chỉnh logic thay thế cho từng loại khối. Bạn có thể kiểm tra tên thẻ và quyết định cách xử lý nội dung tương ứng. Trong ví dụ trên, chúng ta đã thay thế nội dung của `<h2>` và `<p>` bằng `<h1>` và `<span>` tương ứng.

Phương pháp này rất mạnh mẽ, linh hoạt và hiệu quả hơn nhiều khi bạn phải xử lý nhiều khối HTML có cấu trúc tương tự.