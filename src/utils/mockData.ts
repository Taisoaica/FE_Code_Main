import {  Clinic, clinicService } from './interfaces/interfaces';
import { Service } from './interfaces/ClinicRegister/Clinic';

export const clinicServices: clinicService[] = [
    { serviceId: '1', serviceName: "Khám tổng quát" },
    { serviceId: '2', serviceName: "Răng sứ thẩm mỹ" },
    { serviceId: '3', serviceName: "Cấy ghép Implant" },
    { serviceId: '4', serviceName: "Niềng răng trong suốt" },
    { serviceId: '5', serviceName: "Tẩy trắng răng bằng laser" },
    { serviceId: '6', serviceName: "Điều trị nha chu chuyên sâu" },
    { serviceId: '7', serviceName: "Phẫu thuật nha chu" },
    { serviceId: '8', serviceName: "Phẫu thuật chỉnh nha" },
    { serviceId: '9', serviceName: "Bọc răng toàn sứ cao cấp" },
    { serviceId: '7', serviceName: "Phẫu thuật nha chu" },
    { serviceId: '8', serviceName: "Phẫu thuật chỉnh nha" },
    { serviceId: '9', serviceName: "Bọc răng toàn sứ cao cấp" },
];

// export const clinicData: Clinic[] = [
//     {
//         clinic_id: 1,
//         logo: '/asia-logo.png',
//         images: [
//             '/asia-dental-clinic.jpg',
//             '/asia-pic1.png',
//             '/asia-pic2.png',
//             '/asia-pic3.png',
//         ],
//         imageToShow: '/asia-dental-clinic.jpg',
//         name: 'Phòng khám nha khoa Asia',
//         address: '105/10 Nguyễn Thị Tú, Phường Bình Hưng Hòa B, Quận Bình Tân, TP. Hồ Chí Minh',
//         phone: '0123456789',
//         email: 'example@email.com',
//         open_hour: '8h00',
//         close_hour: '20h00',
//         description: `Nha khoa Asia được thành lập ngày 03 tháng 01 năm 2010,
//         hiện tại đang là một trong những nha khoa quốc tế lớn hàng đầu tại khu vực TP. Hồ Chí Minh.
//         Thấu hiểu tầm quan trọng của việc chăm sóc răng miệng,
//         nha khoa Asia mang trong mình sứ mệnh NÂNG CAO CHẤT LƯỢNG NỤ CƯỜI VIỆT",
//         trong suốt hơn 1 thập kỷ Nha khoa Asia đã không ngừng nỗ lực mang đến trên
//         2000 nụ cười hoàn hảo cho người Việt với chất lượng chuyên môn quốc tế.
//         Để hiện thực hóa tiêu chí “Nha khoa chất lượng quốc tế”, nha khoa Asia hiện đang sở hữu cở vật chất hiện đại,
//         được trang công nghệ chuẩn đoán, điều trị hàng đầu hiện nay như máy CT Cone beam, Scan Itero 5D,
//         máy nhổ răng bằng sóng siêu âm Piezotome … và đáp ứng đầy đủ các tiêu chí: Đội ngũ bác sĩ nhiều kinh nghiệm,
//         tay nghề cao - Thiết bị máy móc hiện đại - Hệ thống được thanh trùng`,
//         services: [
//             { serviceId: '1', serviceName: "Răng sứ thẩm mỹ" },
//             { serviceId: '2', serviceName: "Cấy ghép Implant" },
//             { serviceId: '3', serviceName: "Niềng răng trong suốt" },
//             { serviceId: '4', serviceName: "Tẩy trắng răng bằng laser" },
//             { serviceId: '5', serviceName: "Điều trị nha chu chuyên sâu" },
//             { serviceId: '6', serviceName: "Phẫu thuật nha chu" },
//             { serviceId: '7', serviceName: "Phẫu thuật chỉnh nha" },
//             { serviceId: '8', serviceName: "Bọc răng toàn sứ cao cấp" },
//         ],
//     },
//     {
//         clinic_id: 2,
//         logo: '',
//         images: [],
//         imageToShow: '/saigon-dental-clinic.jpg',
//         name: 'Phòng khám nha khoa Sài Gòn',
//         address: '50 Nguyễn Văn Trỗi, Phường 15, Quận Phú Nhuận, TP. Hồ Chí Minh',
//         phone: '0938765432',
//         email: 'contact@saigondental.com',
//         open_hour: '8h00',
//         close_hour: '20h00',
//         description: `Phòng khám nha khoa Sài Gòn được thành lập năm 2012,
//         là một trong những phòng khám nha khoa hiện đại và uy tín tại TP. Hồ Chí Minh.
//         Chúng tôi cung cấp các dịch vụ chăm sóc răng miệng chuyên nghiệp,
//         sử dụng công nghệ và thiết bị tiên tiến nhất nhằm mang lại nụ cười tự tin và khỏe mạnh cho khách hàng.
//         Với đội ngũ bác sĩ nha khoa giàu kinh nghiệm và tay nghề cao,
//         phòng khám nha khoa Sài Gòn cam kết đem đến chất lượng dịch vụ tốt nhất cho bệnh nhân.`,
//         services: [
//             { serviceId: '1', serviceName: "Khám và tư vấn răng miệng" },
//             { serviceId: '2', serviceName: "Cạo vôi và đánh bóng răng" },
//             { serviceId: '3', serviceName: "Nhổ răng không đau" },
//             { serviceId: '4', serviceName: "Chỉnh nha và niềng răng" },
//             { serviceId: '5', serviceName: "Phục hình răng sứ" }
//         ]
//     },
//     {
//         clinic_id: 3,
//         logo: '/vietphap-logo.png',
//         images: [
//             '/vietphap-pic-1.png',
//             '/vietphap-pic-2.png',
//             '/vietphap-pic-3.png',
//             '/vietphap-pic-4.png'
//         ],
//         imageToShow: '/vietphap-dental-clinic.jpg',
//         name: 'Phòng khám nha khoa Việt Pháp',
//         address: '100 Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
//         phone: '0901234567',
//         email: 'info@vietphapdental.com',
//         open_hour: '8h00',
//         close_hour: '20h00',
//         description: `Phòng khám nha khoa Việt Pháp được thành lập vào năm 2015,
//         tự hào là một trong những phòng khám nha khoa hàng đầu với tiêu chuẩn quốc tế tại TP. Hồ Chí Minh.
//         Chúng tôi chuyên cung cấp các dịch vụ chăm sóc răng miệng toàn diện,
//         bao gồm từ khám tổng quát đến các dịch vụ chuyên sâu như chỉnh nha, cấy ghép Implant và làm răng thẩm mỹ.
//         Phòng khám nha khoa Việt Pháp cam kết sử dụng các vật liệu và trang thiết bị hiện đại,
//         đảm bảo mang lại kết quả tốt nhất và an toàn nhất cho khách hàng.`,
//         services: [
//             { serviceId: '1', serviceName: "Khám và chẩn đoán tổng quát" },
//             { serviceId: '2', serviceName: "Chỉnh nha và niềng răng" },
//             { serviceId: '3', serviceName: "Cấy ghép Implant" },
//             { serviceId: '4', serviceName: "Làm răng sứ thẩm mỹ" },
//             { serviceId: '5', serviceName: "Tẩy trắng răng" },
//             { serviceId: '6', serviceName: "Điều trị bệnh lý nha chu" },
//             { serviceId: '7', serviceName: "Nhổ răng khôn không đau" }
//         ]
//     },
//     {
//         clinic_id: 4,
//         logo: '',
//         images: [],
//         imageToShow: '/kim-dental-clinic.jpg',
//         name: 'Phòng khám nha khoa Kim',
//         address: '270 Quang Trung, P.10, Q.Gò Vấp, TP.HCM',
//         phone: '0123456789',
//         email: 'example@email.com',
//         open_hour: '8h00',
//         close_hour: '20h00',
//         description: `Mô tả nội dung cho phòng khám nha khoa Kim.`,
//         services: [
//             // Điền thông tin dịch vụ cho phòng khám này
//         ],
//     },
//     {
//         clinic_id: 5,
//         logo: '',
//         images: [],
//         imageToShow: '/paris-dental-clinic.jpg',
//         name: 'Phòng khám nha khoa Paris',
//         address: '357 Phan Xích Long, P.1, Q.Phú Nhuận, TP.HCM',
//         phone: '0123456789',
//         email: 'example@email.com',
//         open_hour: '8h00',
//         close_hour: '20h00',
//         description: `Mô tả nội dung cho phòng khám nha khoa Paris.`,
//         services: [
//             // Điền thông tin dịch vụ cho phòng khám này
//         ],
//     },
//     {
//         clinic_id: 6,
//         logo: '',
//         images: [],
//         imageToShow: '/tam-anh-dental-clinic.jpg',
//         name: 'Phòng khám nha khoa Tâm Anh',
//         address: '46A Võ Văn Ngân, P.Trường Thọ, TP.Thủ Đức',
//         phone: '0123456789',
//         email: 'example@email.com',
//         open_hour: '8h00',
//         close_hour: '20h00',
//         description: `Mô tả nội dung cho phòng khám nha khoa Tâm Anh.`,
//         services: [
//             // Điền thông tin dịch vụ cho phòng khám này
//         ],
//     },
//     {
//         clinic_id: 7,
//         logo: '',
//         images: [],
//         imageToShow: '/hoa-dental-clinic.jpg',
//         name: 'Phòng khám nha khoa Bác sĩ Hóa',
//         address: '03 Trần Não, P.An Khánh, Q.2, TP.Thủ Đức',
//         phone: '0123456789',
//         email: 'example@email.com',
//         open_hour: '8h00',
//         close_hour: '20h00',
//         description: `Mô tả nội dung cho phòng khám nha khoa Bác sĩ Hóa.`,
//         services: [
//             // Điền thông tin dịch vụ cho phòng khám này
//         ],
//     },
//     {
//         clinic_id: 8,
//         logo: '',
//         images: [],
//         imageToShow: '/rang-xinh-dental-clinic.jpg',
//         name: 'Phòng khám nha khoa Răng xinh',
//         address: '369A Nguyễn Ảnh Thủ, P.Trung Mỹ Tây, Q.12, TP.HCM',
//         phone: '0123456789',
//         email: 'example@email.com',
//         open_hour: '8h00',
//         close_hour: '20h00',
//         description: `Mô tả nội dung cho phòng khám nha khoa Răng xinh.`,
//         services: [
//             // Điền thông tin dịch vụ cho phòng khám này
//         ],
//     },
//     {
//         clinic_id: 9,
//         logo: '',
//         images: [],
//         imageToShow: '/tan-mai-dental-clinic.jpg',
//         name: 'Phòng khám nha khoa Tân Mai',
//         address: '285 Cách Mạng Tháng Tám, P.12, Q.10, TP.HCM',
//         phone: '0123456789',
//         email: 'example@email.com',
//         open_hour: '8h00',
//         close_hour: '20h00',
//         description: `Mô tả nội dung cho phòng khám nha khoa Tân Mai.`,
//         services: [
//             // Điền thông tin dịch vụ cho phòng khám này
//         ],
//     },

// ];



export const servicesData: Service[] = [
    { serviceId: 19, serviceName: 'Bọc răng toàn sứ cao cấp' },
    { serviceId: 1, serviceName: 'Cạo vôi răng' },
    { serviceId: 2, serviceName: 'Cầu răng' },
    { serviceId: 3, serviceName: 'Cấy ghép implant' },
    { serviceId: 4, serviceName: 'Chỉnh nha' },
    { serviceId: 5, serviceName: 'Chữa sâu răng' },
    { serviceId: 6, serviceName: 'Chữa viêm nướu' },
    { serviceId: 16, serviceName: 'Điều trị nha chu chuyên sâu' },
    { serviceId: 7, serviceName: 'Điều trị tủy răng' },
    { serviceId: 8, serviceName: 'Khám răng tổng quát' },
    { serviceId: 9, serviceName: 'Làm răng sứ' },
    { serviceId: 10, serviceName: 'Nhổ răng' },
    { serviceId: 14, serviceName: 'Niềng răng trong suốt' },
    { serviceId: 18, serviceName: 'Phẫu thuật chỉnh nha' },
    { serviceId: 17, serviceName: 'Phẫu thuật nha chu' },
    { serviceId: 13, serviceName: 'Răng sứ thẩm mỹ' },
    { serviceId: 11, serviceName: 'Tẩy trắng răng' },
    { serviceId: 15, serviceName: 'Tẩy trắng răng bằng laser' },
    { serviceId: 12, serviceName: 'Trám răng' }
];