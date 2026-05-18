import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const categories = [
  { name: 'Công nghệ', slug: 'cong-nghe', description: 'Tin tức công nghệ, AI, smartphone, phần mềm', sort_order: 1 },
  { name: 'Kinh doanh', slug: 'kinh-doanh', description: 'Thị trường, startup, tài chính doanh nghiệp', sort_order: 2 },
  { name: 'Thể thao', slug: 'the-thao', description: 'Bóng đá, tennis, esports và các môn thể thao', sort_order: 3 },
  { name: 'Giải trí', slug: 'giai-tri', description: 'Phim ảnh, âm nhạc, sự kiện giải trí', sort_order: 4 },
  { name: 'Sức khỏe', slug: 'suc-khoe', description: 'Y tế, dinh dưỡng, lối sống lành mạnh', sort_order: 5 },
]

const articleTemplates: Record<string, Array<{ title: string; excerpt: string; content: string }>> = {
  'cong-nghe': [
    {
      title: 'Apple ra mắt iPhone 17 với thiết kế siêu mỏng',
      excerpt: 'Apple chính thức giới thiệu iPhone 17 Air, mẫu iPhone mỏng nhất từ trước đến nay.',
      content: `<p>Apple vừa chính thức ra mắt dòng iPhone 17 tại sự kiện đặc biệt diễn ra tại Apple Park. Điểm nhấn lớn nhất năm nay chính là iPhone 17 Air - mẫu iPhone mỏng nhất trong lịch sử với độ dày chỉ 5.5mm.</p>
<h2>Thiết kế đột phá</h2>
<p>iPhone 17 Air sử dụng khung titanium thế hệ mới, kết hợp với mặt lưng ceramic giúp máy vừa nhẹ vừa bền. Màn hình OLED 6.6 inch với tần số quét 120Hz ProMotion cho trải nghiệm mượt mà.</p>
<h2>Camera AI thông minh</h2>
<p>Hệ thống camera được nâng cấp với chip xử lý hình ảnh mới, tích hợp AI giúp chụp ảnh trong điều kiện thiếu sáng tốt hơn 40% so với thế hệ trước. Tính năng "Clean Up" sử dụng AI để tự động loại bỏ vật thể không mong muốn trong ảnh.</p>
<p>Giá khởi điểm từ 799 USD cho phiên bản 128GB. Đặt hàng trước từ ngày 25/5 và bán ra từ 1/6.</p>`,
    },
    {
      title: 'GPT-5 chính thức ra mắt: Bước nhảy vọt về AI',
      excerpt: 'OpenAI công bố GPT-5 với khả năng suy luận ngang ngửa con người trong nhiều lĩnh vực.',
      content: `<p>OpenAI đã chính thức ra mắt GPT-5, mô hình ngôn ngữ lớn thế hệ mới với nhiều cải tiến đáng kinh ngạc về khả năng suy luận, hiểu ngữ cảnh và tương tác đa phương thức.</p>
<h2>Khả năng suy luận vượt trội</h2>
<p>GPT-5 đạt điểm 92% trên bài test benchmark MMLU, vượt xa GPT-4 (86.4%). Đặc biệt, mô hình mới có khả năng giải quyết các bài toán toán học phức tạp và viết code chính xác hơn đáng kể.</p>
<h2>Tích hợp đa phương thức</h2>
<p>Không chỉ xử lý text, GPT-5 có thể phân tích video, tạo hình ảnh, và thậm chí tương tác với phần mềm trên máy tính thông qua API mới.</p>
<p>GPT-5 hiện đã có mặt trên ChatGPT Plus và API cho developers. Phiên bản miễn phí sẽ được mở rộng dần trong các tuần tới.</p>`,
    },
    {
      title: 'Samsung Galaxy S26 Ultra lộ diện với camera 200MP',
      excerpt: 'Rò rỉ hình ảnh thực tế Samsung Galaxy S26 Ultra với nhiều nâng cấp đáng kể về camera.',
      content: `<p>Những hình ảnh thực tế đầu tiên của Samsung Galaxy S26 Ultra vừa bị rò rỉ trên mạng xã hội, cho thấy nhiều thay đổi đáng kể về thiết kế và đặc biệt là hệ thống camera.</p>
<h2>Camera 200MP thế hệ mới</h2>
<p>Galaxy S26 Ultra sẽ trang bị cảm biến camera chính 200MP mới với kích thước pixel lớn hơn, hứa hẹn chất lượng ảnh vượt trội trong mọi điều kiện. Camera zoom quang học 10x được giữ nguyên nhưng chất lượng cải thiện nhờ lens mới.</p>
<h2>Chip Snapdragon 8 Gen 5</h2>
<p>Máy sử dụng chip Snapdragon 8 Gen 5 sản xuất trên tiến trình 2nm, mang lại hiệu năng tăng 30% và tiết kiệm pin hơn 20% so với thế hệ trước.</p>
<p>Dự kiến Samsung sẽ ra mắt Galaxy S26 Ultra vào tháng 1/2027 với giá từ 1,299 USD.</p>`,
    },
    {
      title: 'Việt Nam vào top 10 quốc gia phát triển AI nhanh nhất',
      excerpt: 'Báo cáo mới nhất cho thấy Việt Nam đang có tốc độ phát triển và ứng dụng AI ấn tượng.',
      content: `<p>Theo báo cáo "Global AI Index 2026" vừa được công bố, Việt Nam đã vươn lên vị trí thứ 8 trong danh sách các quốc gia phát triển AI nhanh nhất thế giới, tăng 5 bậc so với năm 2025.</p>
<h2>Đầu tư mạnh vào AI</h2>
<p>Chính phủ Việt Nam đã đầu tư hơn 500 triệu USD vào nghiên cứu và phát triển AI trong năm 2025-2026. Nhiều trung tâm AI lớn được thành lập tại Hà Nội, TP.HCM và Đà Nẵng.</p>
<h2>Nguồn nhân lực chất lượng</h2>
<p>Số lượng kỹ sư AI tại Việt Nam đã tăng gấp 3 lần trong 2 năm qua. Các trường đại học hàng đầu đều mở chuyên ngành AI và Data Science.</p>
<p>Dự kiến đến năm 2028, ngành AI sẽ đóng góp khoảng 2% GDP của Việt Nam.</p>`,
    },
    {
      title: 'Tesla ra mắt robot Optimus phiên bản thương mại',
      excerpt: 'Robot hình người Optimus của Tesla bắt đầu được bán cho các nhà máy với giá 25,000 USD.',
      content: `<p>Tesla chính thức bắt đầu nhận đơn đặt hàng cho robot hình người Optimus Gen 3, đánh dấu lần đầu tiên sản phẩm này được bán thương mại.</p>
<h2>Khả năng vượt trội</h2>
<p>Optimus Gen 3 có thể thực hiện hơn 100 loại tác vụ khác nhau trong nhà máy, từ lắp ráp linh kiện đến vận chuyển hàng hóa. Robot có thể hoạt động liên tục 16 giờ trước khi cần sạc.</p>
<h2>Giá cả cạnh tranh</h2>
<p>Với mức giá 25,000 USD, Elon Musk cho biết Optimus sẽ "rẻ hơn một chiếc ô tô" và có thể thay thế nhân công trong các công việc nguy hiểm hoặc lặp đi lặp lại.</p>
<p>Đợt giao hàng đầu tiên dự kiến vào Q4/2026, ưu tiên cho các nhà máy sản xuất và kho vận.</p>`,
    },
    {
      title: 'Windows 12 ra mắt với AI Copilot tích hợp sâu',
      excerpt: 'Microsoft công bố Windows 12 với trợ lý AI Copilot được tích hợp vào mọi ứng dụng.',
      content: `<p>Microsoft vừa chính thức ra mắt Windows 12, phiên bản hệ điều hành mới nhất với AI Copilot được tích hợp sâu vào mọi khía cạnh của trải nghiệm người dùng.</p>
<h2>AI Copilot mọi nơi</h2>
<p>Copilot trong Windows 12 có thể hiểu ngữ cảnh màn hình, tự động gợi ý hành động và thực hiện các tác vụ phức tạp chỉ bằng lệnh giọng nói. Ví dụ: "Hãy tóm tắt email quan trọng sáng nay" hay "Chỉnh sửa ảnh này cho sáng hơn".</p>
<h2>Hiệu năng cải thiện</h2>
<p>Windows 12 khởi động nhanh hơn 40% so với Windows 11, sử dụng RAM hiệu quả hơn và tối ưu pin cho laptop tốt hơn đáng kể.</p>
<p>Windows 12 sẽ được cung cấp miễn phí cho người dùng Windows 11 từ tháng 10/2026.</p>`,
    },
  ],
  'kinh-doanh': [
    {
      title: 'VN-Index vượt mốc 1,500 điểm lần đầu sau 2 năm',
      excerpt: 'Thị trường chứng khoán Việt Nam bùng nổ khi VN-Index chính thức vượt ngưỡng 1,500 điểm.',
      content: `<p>Phiên giao dịch ngày hôm qua chứng kiến VN-Index chính thức vượt mốc 1,500 điểm, mức cao nhất kể từ tháng 4/2024, với thanh khoản đạt hơn 25,000 tỷ đồng.</p>
<h2>Dòng tiền ngoại đổ vào</h2>
<p>Khối ngoại đã mua ròng hơn 3,000 tỷ đồng trong tuần qua, tập trung vào nhóm cổ phiếu ngân hàng và bất động sản. Đây là tuần mua ròng mạnh nhất của khối ngoại kể từ đầu năm.</p>
<h2>Triển vọng nâng hạng</h2>
<p>Kỳ vọng Việt Nam được nâng hạng từ thị trường cận biên lên thị trường mới nổi vào cuối năm 2026 đang là động lực chính thúc đẩy thị trường.</p>
<p>Các chuyên gia dự báo VN-Index có thể đạt 1,600-1,700 điểm vào cuối năm nay nếu việc nâng hạng diễn ra thuận lợi.</p>`,
    },
    {
      title: 'Startup Việt gọi vốn kỷ lục 100 triệu USD Series C',
      excerpt: 'Một startup fintech Việt Nam vừa hoàn tất vòng gọi vốn Series C lớn nhất lịch sử startup Việt.',
      content: `<p>VNPay, startup fintech hàng đầu Việt Nam, vừa công bố hoàn tất vòng gọi vốn Series C trị giá 100 triệu USD, đánh dấu kỷ lục mới cho hệ sinh thái startup Việt Nam.</p>
<h2>Nhà đầu tư lớn tham gia</h2>
<p>Vòng gọi vốn do SoftBank Vision Fund dẫn dắt, với sự tham gia của GIC (quỹ đầu tư quốc gia Singapore) và Sequoia Capital Southeast Asia.</p>
<h2>Kế hoạch mở rộng</h2>
<p>Số vốn mới sẽ được sử dụng để mở rộng sang thị trường Đông Nam Á, đặc biệt là Philippines và Indonesia, đồng thời phát triển các sản phẩm lending và insurance.</p>
<p>Định giá công ty hiện đạt khoảng 1.5 tỷ USD, trở thành unicorn thứ 3 của Việt Nam.</p>`,
    },
    {
      title: 'Giá vàng lập đỉnh mới: Vượt 100 triệu đồng/lượng',
      excerpt: 'Giá vàng SJC trong nước chính thức vượt mốc 100 triệu đồng/lượng.',
      content: `<p>Giá vàng SJC trong nước ngày hôm nay đã chính thức vượt mốc tâm lý 100 triệu đồng/lượng, lập kỷ lục mới trong bối cảnh giá vàng thế giới liên tục tăng.</p>
<h2>Nguyên nhân tăng giá</h2>
<p>Giá vàng tăng mạnh do lo ngại lạm phát toàn cầu gia tăng, căng thẳng địa chính trị leo thang, và các ngân hàng trung ương lớn tiếp tục mua vàng dự trữ.</p>
<h2>Lời khuyên cho nhà đầu tư</h2>
<p>Các chuyên gia khuyến cáo nhà đầu tư không nên "chạy theo" giá vàng mà cần có chiến lược phân bổ tài sản hợp lý. Vàng chỉ nên chiếm 10-15% danh mục đầu tư.</p>
<p>Dự báo giá vàng có thể điều chỉnh về 95-98 triệu/lượng trước khi tiếp tục xu hướng tăng dài hạn.</p>`,
    },
    {
      title: 'Vingroup đầu tư 2 tỷ USD xây nhà máy chip bán dẫn',
      excerpt: 'Tập đoàn Vingroup công bố kế hoạch xây dựng nhà máy sản xuất chip bán dẫn đầu tiên tại Việt Nam.',
      content: `<p>Tập đoàn Vingroup vừa công bố kế hoạch đầu tư 2 tỷ USD để xây dựng nhà máy sản xuất chip bán dẫn đầu tiên tại Việt Nam, đặt tại Khu công nghệ cao Hòa Lạc, Hà Nội.</p>
<h2>Hợp tác với Samsung</h2>
<p>Dự án được thực hiện với sự hợp tác kỹ thuật từ Samsung Foundry, tập trung vào sản xuất chip trên tiến trình 28nm và 14nm phục vụ IoT, ô tô và thiết bị điện tử tiêu dùng.</p>
<h2>Tạo việc làm lớn</h2>
<p>Nhà máy dự kiến tạo ra hơn 5,000 việc làm trực tiếp và 15,000 việc làm gián tiếp khi đi vào hoạt động đầy đủ vào năm 2029.</p>
<p>Đây là bước đi chiến lược nhằm đưa Việt Nam vào chuỗi cung ứng chip bán dẫn toàn cầu.</p>`,
    },
  ],
  'the-thao': [
    {
      title: 'Đội tuyển Việt Nam thắng Thái Lan 2-1 tại AFF Cup',
      excerpt: 'Trận cầu nảy lửa tại Mỹ Đình, đội tuyển Việt Nam giành chiến thắng kịch tính trước Thái Lan.',
      content: `<p>Đội tuyển Việt Nam vừa có chiến thắng kịch tính 2-1 trước Thái Lan trong khuôn khổ bán kết lượt về AFF Cup 2026 trên sân Mỹ Đình trước sự chứng kiến của hơn 40,000 khán giả.</p>
<h2>Diễn biến trận đấu</h2>
<p>Thái Lan mở tỉ số ngay phút thứ 15 nhờ pha phản công sắc bén. Tuy nhiên, đội tuyển Việt Nam đã nhanh chóng gỡ hòa ở phút 38 nhờ pha đánh đầu của Nguyễn Tiến Linh. Bàn thắng quyết định đến ở phút 87 do công của Quang Hải với cú sút xa ngoạn mục.</p>
<h2>Vào chung kết</h2>
<p>Với tổng tỉ số 3-2 sau hai lượt trận, Việt Nam chính thức góp mặt tại trận chung kết AFF Cup 2026, nơi họ sẽ gặp Indonesia.</p>
<p>Trận chung kết lượt đi sẽ diễn ra vào ngày 25/5 tại Jakarta.</p>`,
    },
    {
      title: 'Nguyễn Thị Oanh phá kỷ lục SEA Games chạy 1500m',
      excerpt: 'Nữ hoàng điền kinh Nguyễn Thị Oanh tiếp tục tỏa sáng với kỷ lục mới tại SEA Games.',
      content: `<p>"Nữ hoàng điền kinh" Nguyễn Thị Oanh đã phá kỷ lục SEA Games ở nội dung chạy 1500m nữ với thành tích 4 phút 05 giây 23, cải thiện kỷ lục cũ của chính cô hơn 2 giây.</p>
<h2>Phong độ đỉnh cao</h2>
<p>Đây là tấm HCV thứ 3 của Oanh tại kỳ SEA Games này sau hai nội dung 5000m và 3000m vượt chướng ngại vật. Cô tiếp tục là VĐV được yêu thích nhất của thể thao Việt Nam.</p>
<h2>Hướng tới Olympic 2028</h2>
<p>HLV trưởng đội tuyển cho biết Oanh đang trong giai đoạn chuẩn bị tốt nhất sự nghiệp và mục tiêu lớn nhất là giành suất dự Olympic Los Angeles 2028.</p>
<p>Oanh chia sẻ: "Tôi sẽ tiếp tục tập luyện chăm chỉ để mang vinh quang về cho thể thao Việt Nam."</p>`,
    },
    {
      title: 'Premier League 2025-26: Man City vô địch lần thứ 6 liên tiếp',
      excerpt: 'Manchester City chính thức đăng quang Premier League mùa giải 2025-26.',
      content: `<p>Manchester City đã chính thức giành chức vô địch Premier League 2025-26, lập kỷ lục 6 mùa giải liên tiếp đăng quang giải đấu hàng đầu nước Anh.</p>
<h2>Mùa giải ấn tượng</h2>
<p>Dưới sự dẫn dắt của HLV Pep Guardiola, City kết thúc mùa giải với 91 điểm, hơn Arsenal 3 điểm. Erling Haaland tiếp tục là Vua phá lưới với 32 bàn thắng.</p>
<h2>Kỷ lục lịch sử</h2>
<p>Chưa đội bóng nào trong lịch sử bóng đá Anh vô địch 6 mùa liên tiếp. Thành tích này đưa Man City sánh ngang với Barcelona và Real Madrid về sự thống trị lâu dài.</p>
<p>Guardiola chia sẻ đây có thể là mùa giải cuối cùng của ông tại Man City trước khi nghỉ hưu.</p>`,
    },
    {
      title: 'Esports Việt Nam giành HCV ASIAD: Kỷ nguyên mới',
      excerpt: 'Đội tuyển esports Việt Nam giành HCV lịch sử tại ASIAD với bộ môn League of Legends.',
      content: `<p>Đội tuyển League of Legends Việt Nam đã giành tấm HCV lịch sử tại ASIAD 2026 sau chiến thắng 3-1 trước Hàn Quốc trong trận chung kết đầy kịch tính.</p>
<h2>Chiến thắng lịch sử</h2>
<p>Đây là lần đầu tiên Việt Nam đánh bại Hàn Quốc - cường quốc esports thế giới - trong một giải đấu quốc tế lớn. Các tuyển thủ Việt Nam đã thể hiện lối chơi chiến thuật xuất sắc.</p>
<h2>Ý nghĩa to lớn</h2>
<p>Tấm HCV ASIAD đánh dấu sự công nhận chính thức của esports tại Việt Nam. Chính phủ đã ban hành chính sách hỗ trợ phát triển esports như một ngành thể thao chuyên nghiệp.</p>
<p>Đội tuyển sẽ được thưởng 500 triệu đồng từ Tổng cục TDTT và nhận bằng khen của Thủ tướng.</p>`,
    },
  ],
  'giai-tri': [
    {
      title: 'Phim Việt "Đất Rừng Phương Nam" 2 đạt 500 tỷ doanh thu',
      excerpt: 'Bom tấn điện ảnh Việt tiếp tục phá kỷ lục phòng vé với doanh thu nửa ngàn tỷ.',
      content: `<p>Bộ phim "Đất Rừng Phương Nam 2" của đạo diễn Nguyễn Quang Dũng đã chính thức cán mốc 500 tỷ đồng doanh thu phòng vé sau 4 tuần công chiếu, trở thành phim Việt có doanh thu cao nhất mọi thời đại.</p>
<h2>Phim hay, khán giả ủng hộ</h2>
<p>Phần 2 nhận được đánh giá rất tích cực từ cả khán giả và giới phê bình, với điểm đánh giá 8.5/10 trên các nền tảng review phim. Diễn xuất của dàn diễn viên trẻ được khen ngợi hết lời.</p>
<h2>Mở rộng quốc tế</h2>
<p>Phim đã được phát hành tại 15 quốc gia và vùng lãnh thổ, thu về thêm 5 triệu USD từ thị trường quốc tế. Netflix đã mua bản quyền phát sóng toàn cầu.</p>
<p>Thành công này mở ra hy vọng mới cho điện ảnh Việt Nam trên bản đồ điện ảnh châu Á.</p>`,
    },
    {
      title: 'Concert Sơn Tùng M-TP tại Mỹ Đình: 50,000 vé sold out',
      excerpt: 'Sơn Tùng M-TP lập kỷ lục với concert lớn nhất lịch sử âm nhạc Việt Nam.',
      content: `<p>50,000 vé cho concert "Sky Tour Final" của Sơn Tùng M-TP tại sân vận động Mỹ Đình đã sold out chỉ trong vòng 15 phút mở bán, lập kỷ lục mới cho ngành giải trí Việt Nam.</p>
<h2>Show diễn hoành tráng</h2>
<p>Concert sẽ sử dụng hệ thống âm thanh và ánh sáng trị giá hơn 50 tỷ đồng, được thiết kế bởi đội ngũ từng làm show cho các ngôi sao quốc tế như Coldplay và Ed Sheeran.</p>
<h2>Khách mời bí ẩn</h2>
<p>BTC tiết lộ sẽ có sự xuất hiện của các khách mời đặc biệt trong và ngoài nước, nhưng từ chối tiết lộ danh tính cụ thể để tạo bất ngờ cho khán giả.</p>
<p>Concert diễn ra vào ngày 15/6 tại SVĐ Quốc gia Mỹ Đình. Giá vé từ 800,000 đến 5,000,000 đồng.</p>`,
    },
    {
      title: 'Netflix đầu tư 50 triệu USD sản xuất phim Việt Nam',
      excerpt: 'Netflix công bố kế hoạch đầu tư lớn vào thị trường nội dung Việt Nam.',
      content: `<p>Netflix vừa công bố kế hoạch đầu tư 50 triệu USD trong 3 năm tới để sản xuất các series và phim điện ảnh gốc tại Việt Nam, đánh dấu cam kết lớn nhất của hãng tại Đông Nam Á.</p>
<h2>Nội dung đa dạng</h2>
<p>Kế hoạch bao gồm 5 series dài tập và 3 phim điện ảnh, trải rộng các thể loại từ thriller, romance đến historical drama. Netflix đã ký hợp đồng với nhiều đạo diễn và biên kịch hàng đầu Việt Nam.</p>
<h2>Xây dựng studio</h2>
<p>Netflix cũng sẽ xây dựng studio sản xuất tại TP.HCM, tạo ra hơn 1,000 việc làm trực tiếp cho ngành giải trí Việt Nam.</p>
<p>Series đầu tiên dự kiến lên sóng vào Q1/2027.</p>`,
    },
    {
      title: 'Game Việt "Flappy Bird Revival" lọt top 1 App Store toàn cầu',
      excerpt: 'Phiên bản mới của Flappy Bird do đội ngũ Việt Nam phát triển gây bão toàn cầu.',
      content: `<p>Flappy Bird Revival - phiên bản mới được phát triển bởi studio game tại TP.HCM - đã leo lên vị trí số 1 trên App Store và Google Play tại hơn 50 quốc gia chỉ sau 48 giờ ra mắt.</p>
<h2>Gameplay quen thuộc, đồ họa mới</h2>
<p>Game giữ nguyên lối chơi đơn giản gây nghiện của bản gốc nhưng bổ sung đồ họa 3D tuyệt đẹp, chế độ multiplayer online và hệ thống skin đa dạng.</p>
<h2>Doanh thu khủng</h2>
<p>Theo ước tính, game đã thu về hơn 5 triệu USD chỉ trong tuần đầu từ quảng cáo và in-app purchase, với hơn 20 triệu lượt tải.</p>
<p>Đây là minh chứng cho thấy tiềm năng to lớn của ngành game Việt Nam trên thị trường quốc tế.</p>`,
    },
  ],
  'suc-khoe': [
    {
      title: 'WHO khuyến cáo mới về thời gian sử dụng điện thoại',
      excerpt: 'Tổ chức Y tế Thế giới đưa ra hướng dẫn mới giới hạn thời gian sử dụng smartphone.',
      content: `<p>WHO vừa công bố hướng dẫn mới khuyến cáo người trưởng thành không nên sử dụng smartphone quá 4 giờ/ngày cho mục đích giải trí, giảm xuống 2 giờ cho trẻ em dưới 16 tuổi.</p>
<h2>Tác hại của screen time</h2>
<p>Nghiên cứu trên 500,000 người cho thấy sử dụng smartphone quá 6 giờ/ngày làm tăng 40% nguy cơ trầm cảm, 30% nguy cơ mất ngủ, và ảnh hưởng nghiêm trọng đến thị lực.</p>
<h2>Giải pháp đề xuất</h2>
<p>WHO khuyến khích quy tắc "20-20-20": cứ 20 phút nhìn màn hình, hãy nhìn ra xa 20 feet (6m) trong 20 giây. Ngoài ra, nên tắt điện thoại ít nhất 1 giờ trước khi đi ngủ.</p>
<p>Nhiều quốc gia đang xem xét áp dụng các khuyến cáo này vào chính sách y tế công cộng.</p>`,
    },
    {
      title: 'Phát hiện vaccine mới ngừa ung thư hiệu quả 90%',
      excerpt: 'Thử nghiệm lâm sàng vaccine mRNA chống ung thư cho kết quả đột phá.',
      content: `<p>Kết quả thử nghiệm lâm sàng giai đoạn 3 của vaccine mRNA chống ung thư do Moderna và Merck phối hợp phát triển cho thấy hiệu quả lên đến 90% trong việc ngăn ngừa tái phát melanoma (ung thư da).</p>
<h2>Cơ chế hoạt động</h2>
<p>Vaccine sử dụng công nghệ mRNA tương tự vaccine COVID-19, được cá nhân hóa cho từng bệnh nhân dựa trên profile gene của khối u. Hệ miễn dịch được "huấn luyện" để nhận diện và tiêu diệt tế bào ung thư.</p>
<h2>Triển vọng mở rộng</h2>
<p>Moderna cho biết đang mở rộng thử nghiệm sang các loại ung thư khác bao gồm ung thư phổi, ung thư đại trực tràng và ung thư vú.</p>
<p>Vaccine dự kiến được FDA phê duyệt vào cuối năm 2027 và có giá khoảng 10,000-15,000 USD mỗi liệu trình.</p>`,
    },
    {
      title: 'Xu hướng Intermittent Fasting: Lợi ích và rủi ro',
      excerpt: 'Chuyên gia dinh dưỡng phân tích toàn diện về phương pháp nhịn ăn gián đoạn.',
      content: `<p>Intermittent Fasting (IF) - nhịn ăn gián đoạn - tiếp tục là xu hướng dinh dưỡng phổ biến nhất năm 2026. Tuy nhiên, các chuyên gia cảnh báo phương pháp này không phù hợp với tất cả mọi người.</p>
<h2>Lợi ích được chứng minh</h2>
<p>Nhiều nghiên cứu cho thấy IF có thể giúp giảm cân, cải thiện insulin sensitivity, giảm viêm và thậm chí kéo dài tuổi thọ. Phương pháp 16:8 (nhịn 16 giờ, ăn trong 8 giờ) là phổ biến nhất.</p>
<h2>Ai không nên áp dụng?</h2>
<p>Phụ nữ mang thai, người bị tiểu đường type 1, trẻ em dưới 18 tuổi và người có tiền sử rối loạn ăn uống tuyệt đối không nên áp dụng IF. Người bị bệnh dạ dày cũng cần thận trọng.</p>
<p>Lời khuyên: Nên tham khảo ý kiến bác sĩ trước khi bắt đầu bất kỳ chế độ ăn kiêng nào.</p>`,
    },
    {
      title: 'Thiền định 10 phút mỗi ngày giúp giảm 50% stress',
      excerpt: 'Nghiên cứu mới cho thấy thiền định ngắn mỗi ngày có tác dụng đáng kể lên sức khỏe tinh thần.',
      content: `<p>Nghiên cứu được công bố trên tạp chí Nature Mental Health cho thấy chỉ cần thiền định 10 phút mỗi ngày trong 8 tuần có thể giảm mức cortisol (hormone stress) xuống 50%.</p>
<h2>Phương pháp nghiên cứu</h2>
<p>Nghiên cứu theo dõi 2,000 người tham gia trong 12 tháng, chia thành nhóm thiền định và nhóm đối chứng. Nhóm thiền định sử dụng app hướng dẫn thiền định 10 phút mỗi sáng.</p>
<h2>Kết quả ấn tượng</h2>
<p>Ngoài giảm stress, nhóm thiền định còn cải thiện chất lượng giấc ngủ 35%, tăng khả năng tập trung 25% và giảm triệu chứng lo âu 45%.</p>
<p>Các chuyên gia khuyến cáo nên bắt đầu với 5 phút/ngày và tăng dần. Nhiều app miễn phí như Insight Timer và Medito có thể hỗ trợ người mới bắt đầu.</p>`,
    },
  ],
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function seed() {
  console.log('🌱 Bắt đầu seed data...\n')

  // Insert categories
  console.log('📁 Tạo categories...')
  const { data: cats, error: catError } = await supabase
    .from('categories')
    .insert(categories)
    .select()

  if (catError) {
    console.error('❌ Lỗi tạo categories:', catError.message)
    process.exit(1)
  }
  console.log(`✅ Đã tạo ${cats.length} categories\n`)

  // Build slug → id map
  const catMap = new Map(cats.map((c: any) => [c.slug, c.id]))

  // Insert articles
  console.log('📝 Tạo articles...')
  let totalArticles = 0

  for (const [catSlug, articles] of Object.entries(articleTemplates)) {
    const categoryId = catMap.get(catSlug)
    if (!categoryId) {
      console.error(`⚠️  Không tìm thấy category: ${catSlug}`)
      continue
    }

    const rows = articles.map((a, i) => ({
      title: a.title,
      slug: generateSlug(a.title),
      excerpt: a.excerpt,
      content: a.content,
      category_id: categoryId,
      is_published: true,
      published_at: new Date(Date.now() - (articles.length - i) * 3600000).toISOString(),
    }))

    const { data, error } = await supabase.from('articles').insert(rows).select()

    if (error) {
      console.error(`❌ Lỗi tạo articles cho ${catSlug}:`, error.message)
    } else {
      totalArticles += data.length
      console.log(`  ✅ ${catSlug}: ${data.length} bài`)
    }
  }

  // Add some view counts for "Most Viewed Today"
  console.log('\n👀 Tạo view counts...')
  const { data: allArticles } = await supabase
    .from('articles')
    .select('id')
    .eq('is_published', true)

  if (allArticles) {
    for (const article of allArticles) {
      const views = Math.floor(Math.random() * 200) + 10
      await supabase.rpc('increment_view', { p_article_id: article.id })
      // Add more views for some randomness
      for (let i = 0; i < Math.floor(views / 10); i++) {
        await supabase.rpc('increment_view', { p_article_id: article.id })
      }
    }
    console.log(`✅ Đã tạo view counts cho ${allArticles.length} bài\n`)
  }

  console.log(`🎉 Seed hoàn tất! ${categories.length} categories, ${totalArticles} articles`)
}

seed().catch(console.error)
