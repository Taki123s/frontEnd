import React from 'react';
import { Link } from 'react-router-dom';

const PaymentPolicy = () => {
    return (
        <div className="container">
            <div className="s1024:max-w-[980px] mx-auto mt-[50px] pl-[10px] pr-[10px] s1024:p-0 s1024:flex gap-8">
                <div className="order-last">
                    <h3 className="text-[18px] underline underline-offset-4 decoration-2 decoration-red-600 mb-4">
                        THÔNG TIN KHÁC
                    </h3>
                    <div className="mb-2">
                        <Link to="/about-us">Chính Sách Riêng Tư</Link>
                    </div>

                </div>
                <div className="shrink-0 s1024:w-[640px]">
                    <h1 className="text-[18px] underline underline-offset-4 decoration-2 decoration-red-600 mb-4 uppercase">
                        Chính Sách Thanh Toán
                    </h1>
                    <div className="page-content font-extralight">
                        <p className="ql-align-justify">
                            AnimeWeb cung cấp các gói dịch vụ theo tuần, tháng, và năm nhằm đáp ứng nhu cầu đa dạng của người dùng. Để thuận tiện cho việc thanh toán, chúng tôi chấp nhận phương thức thanh toán qua PayPal. Dưới đây là chi tiết về chính sách thanh toán của chúng tôi.
                        </p>
                        <p className="ql-align-justify"><br /></p>
                        <h1 className="text-[18px] underline underline-offset-4 decoration-2 decoration-red-600 mb-4 uppercase">Các gói dịch vụ</h1>
                        <ul>
                            <li><strong>Gói tuần:</strong> Thanh toán hàng tuần với các lợi ích và quyền truy cập đầy đủ trong 7 ngày.</li>
                            <li><strong>Gói tháng:</strong> Thanh toán hàng tháng, tiết kiệm chi phí hơn so với gói tuần và cung cấp quyền truy cập trong 30 ngày.</li>
                            <li><strong>Gói năm:</strong> Thanh toán hàng năm, tiết kiệm chi phí đáng kể so với gói tháng và cung cấp quyền truy cập trong 365 ngày.</li>
                        </ul>
                        <p><br /></p>
                        <h1 className="text-[18px] underline underline-offset-4 decoration-2 decoration-red-600 mb-4 uppercase">Phương thức thanh toán qua PayPal</h1>
                        <p>
                            Chúng tôi sử dụng PayPal, một trong những cổng thanh toán trực tuyến phổ biến và an toàn nhất, để xử lý các khoản thanh toán của bạn. Để thực hiện thanh toán, bạn cần có một tài khoản PayPal hoặc có thể sử dụng thẻ tín dụng/thẻ ghi nợ thông qua PayPal mà không cần tài khoản PayPal.
                        </p>
                        <p><br /></p>
                        <h1 className="text-[18px] underline underline-offset-4 decoration-2 decoration-red-600 mb-4 uppercase">Quy trình thanh toán</h1>
                        <ol>
                            <li>Chọn gói dịch vụ bạn muốn đăng ký (tuần, tháng, năm).</li>
                            <li>Nhấn vào nút "Mua ngay".</li>
                            <li>Đăng nhập vào tài khoản PayPal của bạn hoặc chọn phương thức thanh toán bằng thẻ tín dụng/thẻ ghi nợ.</li>
                            <li>Xác nhận thanh toán.</li>
                            <li>Sau khi thanh toán thành công, bạn sẽ nhận được email xác nhận từ PayPal và quyền truy cập vào gói dịch vụ đã chọn sẽ được kích hoạt ngay lập tức.</li>
                        </ol>
                        <p><br /></p>
                        <h1 className="text-[18px] underline underline-offset-4 decoration-2 decoration-red-600 mb-4 uppercase">Chính sách hoàn tiền</h1>
                        <p>
                            Chúng tôi cam kết mang lại sự hài lòng cho khách hàng. Trong trường hợp bạn không hài lòng với dịch vụ, bạn có thể yêu cầu hoàn tiền trong vòng 7 ngày kể từ ngày thanh toán. Yêu cầu hoàn tiền sẽ được xử lý trong vòng 5-10 ngày làm việc.
                        </p>
                        <p><br /></p>
                        <h1 className="text-[18px] underline underline-offset-4 decoration-2 decoration-red-600 mb-4 uppercase">Bảo mật thông tin thanh toán</h1>
                        <p>
                            Chúng tôi không lưu trữ bất kỳ thông tin tài chính nào của khách hàng trên hệ thống của chúng tôi. Mọi giao dịch thanh toán đều được xử lý trực tiếp qua PayPal với các biện pháp bảo mật tiên tiến.
                        </p>
                        <p><br /></p>
                        <h1 className="text-[18px] underline underline-offset-4 decoration-2 decoration-red-600 mb-4 uppercase">Liên hệ</h1>
                        <p>
                            Nếu bạn có bất kỳ câu hỏi nào về chính sách thanh toán của chúng tôi, vui lòng liên hệ với chúng tôi tại địa chỉ .
                        </p>
                        <p><br /></p>
                        <h1 className="text-[18px] underline underline-offset-4 decoration-2 decoration-red-600 mb-4 uppercase">Thay đổi điều khoản</h1>
                        <p>
                            Chúng tôi có thể thay đổi các điều khoản của bản Chính sách thanh toán này cho phù hợp với điều kiện thực tế. Chúng tôi sẽ thông báo về những thay đổi lớn bằng cách đặt thông báo trên website của chúng tôi và được đặt trong thiết lập người dùng của bạn.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPolicy;
