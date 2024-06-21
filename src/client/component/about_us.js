import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div className="container">
            <div className="s1024:max-w-[980px] mx-auto mt-[50px] pl-[10px] pr-[10px] s1024:p-0 s1024:flex gap-8">
                <div className="order-last">
                    <h3 className="text-[18px] underline underline-offset-4 decoration-2 decoration-red-600 mb-4">
                        THÔNG TIN KHÁC
                    </h3>

                    <div className="mb-2">
                        <Link to="/about-payment">Chính Sách Thanh Toán</Link>
                    </div>
                </div>
                <div className="shrink-0 s1024:w-[640px]">
                    <h1 className="text-[18px] underline underline-offset-4 decoration-2 decoration-red-600 mb-4 uppercase">
                        Chính Sách Riêng Tư
                    </h1>
                    <div className="page-content font-extralight">
                        <p className="ql-align-justify">
                         AnimeWeb tôn trọng và tận tâm bảo vệ sự riêng tư của người dùng. Chính sách Bảo vệ riêng tư này nhằm giải quyết những thông tin nhận biết cá nhân (sau đây gọi là "Dữ liệu") có thể được chúng tôi thu thập. Chính sách Bảo vệ riêng tư này không áp dụng đối với những bên tham gia mà chúng tôi không kiểm soát hoặc những người không phải nhân viên, đại lý của chúng tôi hoặc nằm trong quyền kiểm soát của chúng tôi. Xin vui lòng dành chút thời gian đọc kỹ Điều khoản sử dụng AnimeWeb để hiểu rõ hơn về các hành vi được phép và không được phép thực hiện tại hệ thống AnimeWeb.
                        </p>
                        <p className="ql-align-justify"><br /></p>
                         <h1 className="text-[18px] underline underline-offset-4 decoration-2 decoration-red-600 mb-4 uppercase">Thu thập Dữ liệu</h1>
                        <p>
                            Quy trình đăng ký của chúng tôi yêu cầu một thông tin nhận dạng người dùng không bị trùng lặp (user ID), một tên hiển thị (có thể trùng với user ID). Chúng tôi cũng yêu cầu bạn cung cấp một địa chỉ email được dùng trong trường hợp xác minh người dùng, nhận thông báo qua email khi quên mật khẩu truy cập. Việc cung cấp những thông tin khác cho chúng tôi hay không tùy thuộc vào quyết định của bạn. Vui lòng lưu ý rằng user ID hoặc những thông tin bạn cung cấp có thể chứa tên thật hoặc những thông tin cá nhân và vì vậy có thể xuất hiện trên website AnimeWeb.
                        </p>
                        <p>
                            Cũng giống như nhiều website khác, chúng tôi có thể tự động ghi nhận những thông tin chung nằm trong các tập tin trên máy chủ của chúng tôi như địa chỉ IP của bạn hoặc thông tin cookie.
                        </p>
                        <p><br /></p>
                        <h1 className="text-[18px] underline underline-offset-4 decoration-2 decoration-red-600 mb-4 uppercase">Sử dụng Dữ liệu</h1>
                        <p>
                            Chúng tôi có thể sử dụng Dữ liệu để tùy biến và cải tiến nhằm phục vụ bạn tốt hơn. Chúng tôi sẽ cố gắng để Dữ liệu của bạn không bị các bên thứ ba khai thác, ngoại trừ các trường hợp:
                        </p>
                        <ul>
                            <li>Được quy định khác trong bản Chính sách Bảo vệ Riêng tư này;</li>
                            <li>Chúng tôi được bạn chấp thuận, như đồng ý hoặc chấm dứt chia sẻ dữ liệu;</li>
                            <li>Một dịch vụ do website của chúng tôi cung cấp yêu cầu sự tương tác với một bên thứ ba hoặc do bên thứ ba cung cấp;</li>
                            <li>Theo các quy trình hành pháp hoặc luật pháp;</li>
                            <li>
                                Chúng tôi phát hiện việc bạn sử dụng website này vi phạm Chính sách riêng tư này, Điều khoản sử dụng AnimeWeb hoặc các hướng dẫn sử dụng khác do chúng tôi đặt ra nhằm bảo vệ quyền lợi và/hoặc tài sản hợp pháp của mình;
                            </li>
                            <li>
                                Website này được mua bởi một bên thứ ba và họ tiếp tục sử dụng Dữ liệu theo cách thức mà chúng tôi đã quy định trong bản Chính sách Bảo vệ Riêng tư này.
                            </li>
                        </ul>
                        <p>
                            Trong trường hợp bạn sử dụng liên kết trên site của chúng tôi để truy cập các website khác, đề nghị bạn đọc kỹ các chính sách bảo vệ sự riêng tư trên các website đó.
                        </p>
                        <p><br /></p>
                        <h1 className="text-[18px] underline underline-offset-4 decoration-2 decoration-red-600 mb-4 uppercase">Cookies</h1>
                        <p>
                            Cũng như nhiều website khác, chúng tôi thiết lập và sử dụng cookie để tìm hiểu thêm về cách bạn tương tác với nội dung của chúng tôi và giúp chúng tôi cải thiện trải nghiệm của bạn khi ghé thăm website của chúng tôi, cũng như duy trì thiết lập cá nhân của bạn... Website của chúng tôi có thể đăng quảng cáo, và trong trường hợp đó có thể thiết lập và truy cập các cookie trên máy tính của bạn và phụ thuộc vào chính sách bảo vệ sự riêng tư của các bên cung cấp quảng cáo. Tuy nhiên, các công ty quảng cáo không được truy cập vào cookie của chúng tôi. Những công ty đó thường sử dụng các đoạn mã riêng để theo dõi số lượt truy cập của bạn đến website của chúng tôi.
                        </p>
                        <p><br /></p>
                        <h1 className="text-[18px] underline underline-offset-4 decoration-2 decoration-red-600 mb-4 uppercase">Biên tập lại hoặc xóa thông tin Tài khoản</h1>
                        <p>
                            AnimeWeb cung cấp tính năng biên tập thông tin trong tài khoản cá nhân thông qua trang cấu hình cá nhân riêng của bạn. Bạn có thể yêu cầu xóa bỏ tài khoản của bạn bằng cách liên hệ theo địa chỉ <a href="/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="69080d040007291f1c000e010c47070c1d">[email&#160;protected]</a> hoặc nhấn vào đường dẫn này và làm theo hướng dẫn: <Link to="/user/delete" rel="noopener noreferrer" target="_blank">https://AnimeWeb.net/user/delete</Link>. Sau khi xác minh yêu cầu xoá tài khoản, chúng tôi sẽ tiến hành xoá thông tin người dùng của bạn. Lưu ý rằng nội dung hoặc các dữ liệu mà bạn đã cung cấp cho chúng tôi không nằm trong tài khoản cá nhân của bạn, chẳng hạn các bài viết (post) trên diễn đàn, có thể tiếp tục nằm trên website của chúng tôi ngay cả khi tài khoản của bạn đã bị xóa. Xin vui lòng đọc kỹ Điều khoản sử dụng AnimeWeb để có thêm thông tin.
                        </p>
                        <p><br /></p>
                        <h1 className="text-[18px] underline underline-offset-4 decoration-2 decoration-red-600 mb-4 uppercase">Thay đổi điều khoản</h1>
                        <p>
                            Chúng tôi có thể thay đổi các điều khoản của bản Chính sách bảo vệ riêng tư này cho phù hợp với điều kiện thực tế. Chúng tôi sẽ thông báo về những thay đổi lớn bằng cách đặt thông báo trên site của chúng tôi và được đặt trong thiết lập người dùng của bạn.
                        </p>
                        <p><br /></p>
                        <h1 className="text-[18px] underline underline-offset-4 decoration-2 decoration-red-600 mb-4 uppercase">Từ chối bảo đảm</h1>
                        <p>
                            Mặc dù Chính sách bảo vệ riêng tư đặt ra những tiêu chuẩn về Dữ liệu và chúng tôi luôn cố gắng hết mình để đáp ứng, chúng tôi không bị buộc phải bảo đảm những tiêu chuẩn đó. Có thể có những nhân tố vượt ra ngoài tầm kiểm soát của chúng tôi có thể dẫn đến việc Dữ liệu bị tiết lộ. Vì thế, chúng tôi không chịu trách nhiệm bảo đảm Dữ liệu luôn được duy trì ở tình trạng hoàn hảo hoặc không bị tiết lộ.
                        </p>
                        <p><br /></p>
                        <h1 className="text-[18px] underline underline-offset-4 decoration-2 decoration-red-600 mb-4 uppercase">Sự đồng ý của bạn</h1>
                        <p>
                            Khi sử dụng dịch vụ của AnimeWeb, bạn mặc nhiên chấp nhận điều khoản trong Chính sách bảo vệ riêng tư này. Muốn biết thêm thông tin, vui lòng liên lạc với chúng tôi tại địa chỉ <a href="/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="f697929b9f98b680839f919e93d8989382">[email&#160;protected]</a>. Chúng tôi hoạt động hoàn toàn trong khuôn khổ luật pháp Việt Nam và cam kết tuân thủ các pháp chế của Nhà nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Các điều khoản trên là phù hợp với luật pháp hiện hành và đảm bảo quyền lợi cao nhất cho người sử dụng dịch vụ của AnimeWeb.
                        </p>
                        <p><br /></p>
                        <h1 className="text-[18px] underline underline-offset-4 decoration-2 decoration-red-600 mb-4 uppercase">Thông tin liên hệ</h1>
                        <p>
                            Nếu bạn có thắc mắc về Chính sách bảo vệ sự riêng tư, vui lòng liên hệ với chúng tôi tại địa chỉ .
                        </p>
                        <p><br /></p>
                        <h1 className="text-[18px] underline underline-offset-4 decoration-2 decoration-red-600 mb-4 uppercase">Phụ lục: Giải thích các khái niệm</h1>
                        <p><br /></p>
                        <p><strong>a. Những thông tin gì được thu thập và thu thập như thế nào?</strong></p>
                        <p>
                            Mỗi máy tính nối mạng đều được xác định bởi một chuỗi số gọi là "Giao thức Internet" hay địa chỉ IP. Khi người dùng có một yêu cầu gửi đến máy chủ của AnimeWeb trong khi truy cập vào trang, máy chủ sẽ nhận ra người thông qua địa chỉ IP đó. Điều này sẽ không ảnh hưởng gì đến những thông tin cá nhân của bạn ngoài việc nhận ra một máy tính đang truy cập AnimeWeb. Chúng tôi dùng thông tin này để xác lập thống kê về lượng truy cập toàn cục, và để xem có sự lạm dụng băng thông hay không nhằm phối hợp với các chính sách pháp luật ban hành về an ninh mạng. Chúng tôi hoàn toàn không thu thập thông tin về một cá nhân cụ thể. Máy chủ của chúng tôi không tự động ghi nhận các địa chỉ email của người dùng.
                        </p>
                        <p><br /></p>
                        <p><strong>b. Cookies là gì?</strong></p>
                        <p>
                            Trong thời gian bạn truy cập AnimeWeb, AnimeWeb hoặc các nhà tài trợ có thể gửi "cookie" đến máy tính của bạn. Cookie là một mẩu nhỏ thông tin gửi đến trình duyệt Internet từ máy chủ và lưu lại trên ổ cứng. Cookie không thể đọc thông tin trên ổ cứng của bạn hay thông tin của các cookie được gửi đến bởi các trang Web khác. Cookie vô hại với hệ thống của bạn. Chúng tôi dùng Cookie để thống kê các trang thuộc hệ thống AnimeWeb mà các bạn đã truy cập, và trong lần ghé thăm kế tiếp của bạn, bạn sẽ truy cập những trang đó nhanh hơn. Các nhà tài trợ của chúng tôi cũng dùng cookie để chắc chắn về số lượt truy cập của các bạn tới các banner của họ trên AnimeWeb. Các nhà tài trợ có thể dùng thông tin này để thay đổi các chính sách quảng cáo trên AnimeWeb để đạt được hiệu quả cao nhất cho các chương trình của họ (Dựa vào trang có số lượng vào nhiều nhất để đặt banner là 1 ví dụ). Bạn có toàn quyền lựa chọn có cho phép cookie thay đổi thông tin về trình duyệt của bạn hay không. Bạn cũng có thể chọn từ chối tất cả các cookie được gửi đến. Nếu bạn chọn như vậy có thể một số tính năng của AnimeWeb cũng như các website khác, sẽ không hoạt động tốt.
                        </p>
                        <p><br /></p>
                        <p><strong>c. AnimeWeb dùng "ảnh gif điểm đơn " (single-pixel gifs) như thế nào?</strong></p>
                        <p>
                            AnimeWeb và các nhà tài trợ có thể sử dụng "ảnh gif điểm đơn", đôi khi được đề cập đến như các con bọ (beacon) hay cọc mốc trong trong môi trường Web, để đếm số trang được truy cập và thu thập một số thông tin thống kê chung. AnimeWeb không thu thập thông tin cá nhân thông qua việc sử dụng các ảnh này. Các nhà tài trợ của chúng tôi cũng chỉ theo dõi qua việc dùng ảnh này để xác nhận các thông số về banner quảng cáo.
                        </p>
                        <p><br /></p>
                        <p><strong>d. AnimeWeb thu thập thông tin gì khi người dùng đăng ký?</strong></p>
                        <p>
                            Với một số dịch vụ AnimeWeb yêu cầu người dùng phải đăng ký. Chúng tôi có thể dùng thông tin này để gửi thông báo cho bạn về các sản phẩm và dịch vụ thông qua thư điện tử hoặc thư bưu chính. Trong trường hợp bạn đăng ký sử dụng các dịch vụ giá trị gia tăng do các bên thứ ba cung cấp thì các thông tin đó có thể được chia sẻ với các khách hàng của AnimeWeb (Các nhà tài trợ) để họ có thể gửi thông tin hoặc đồ khuyến mãi tới người dùng liên quan đến các dịch vụ mà bạn đã đăng ký.
                        </p>
                        <p>
                            Chúng tôi có thể sẽ sử dụng các địa chỉ thư điện tử và thư bưu chính để tiến hành các cuộc điều tra (Ví dụ: thông báo thay đổi dịch vụ trên AnimeWeb, thông báo về các chương trình khuyến mại hay các hành động nhân đạo và xã hội khác). Chúng tôi duy trì chính sách "Không Spam" và không chia sẻ, bán hay để lọt email của các bạn cho các bên thứ ba khi không có sự chấp thuận của bạn.
                        </p>
                        <p>
                            Nếu bạn đồng ý với việc nhận các thông tin về các chương trình và dịch vụ của các hãng thứ 3 khi đăng ký, bạn sẽ có thể nhận được các thông tin thông qua thư điện tử hoặc thư bưu chính từ các hãng tài trợ này.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
