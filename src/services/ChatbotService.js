require("dotenv").config();
import request from "request";

let PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const IMAGE_GET_STARTED = "https://bit.ly/nam-bot-1";
const IMAGE_BACK_SERVICE = "https://bit.ly/3PDcwFN";

const IMAGE_DOCTORS = "https://bit.ly/nam-bot-3";
const IMAGE_BOOKING = "https://bit.ly/nam-bot-4";
const IMAGE_SPECIALTY = "https://bit.ly/nam-bot-5";

const IMAGE_LIST_PHD = [
    "https://bit.ly/3PCJSod",
    "https://bit.ly/48g6ySr",
    "https://bit.ly/3rfbwOK",
];

const IMAGE_YOUNG_DOCTOR = ["https://bit.ly/48eI9wA", "https://bit.ly/46fzI2p"];

const IMAGE_SHOW_SPECIALTIES = [
    "https://cdn.bookingcare.vn/fr/w300/2023/06/20/112457-co-xuong-khop.jpg",
    "https://cdn.bookingcare.vn/fr/w300/2023/06/20/113208-than-kinh.jpg",
    "https://cdn.bookingcare.vn/fr/w300/2023/06/20/113221-benh-viem-gan.jpg",
    "https://cdn.bookingcare.vn/fr/w300/2023/06/20/112550-tim-mach.jpg",
];

const IMAGE_SHOW_SPECIALTY_MUSCULOSKELETAL = [
    "https://cdn.bookingcare.vn/fr/w200/2017/12/22/155419nguyen-thi-kim-loan.jpg",
    "https://cdn.bookingcare.vn/fr/w200/2019/12/31/161832-bsckii-nguyen-thi-lan.jpg",
];

const IMAGE_SHOW_SPECIALTY_NERVE = [
    "https://cdn.bookingcare.vn/fr/w200/2017/12/23/170155nguyen-van-doanh.jpg",
    "https://cdn.bookingcare.vn/fr/w200/2019/11/21/104228-pgskd-hung.png",
];

const IMAGE_SHOW_SPECIALTY_DIGEST = [
    "https://cdn.bookingcare.vn/fr/w200/2019/12/31/155650-gs-ha-van-quyet.jpg",
    "https://cdn.bookingcare.vn/fr/w200/2020/01/03/084535-bsckii-le-tuyet-anh.jpg",
];

const IMAGE_SHOW_SPECIALTY_HEART = [
    "https://cdn.bookingcare.vn/fr/w200/2022/05/05/104945-nguyen-van-quynh-pgs.jpg",
    "https://cdn.bookingcare.vn/fr/w200/2018/12/06/150208bac-si-chuyen-khoa-ii-pham-xuan-hau.jpg",
];

let handleBackToService = async (sender_psid) => {
    await handleSightseeing(sender_psid);
};

let sendMarkReadMessage = (sender_psid) => {
    // Construct the message body
    let request_body = {
        recipient: {
            id: sender_psid,
        },
        sender_action: "mark_seen",
    };

    // Send the HTTP request to the Messenger Platform
    request(
        {
            uri: `https://graph.facebook.com/v17.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
            qs: { access_token: PAGE_ACCESS_TOKEN },
            method: "POST",
            json: request_body,
        },
        (err, res, body) => {
            if (!err) {
                console.log("sendMarkReadMessage sent!");
            } else {
                console.error("Unable to send sendMarkReadMessage:" + err);
            }
        }
    );
};

let sendTypingOn = (sender_psid) => {
    // Construct the message body
    let request_body = {
        recipient: {
            id: sender_psid,
        },
        sender_action: "typing_on",
    };

    // Send the HTTP request to the Messenger Platform
    request(
        {
            uri: `https://graph.facebook.com/v17.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
            qs: { access_token: PAGE_ACCESS_TOKEN },
            method: "POST",
            json: request_body,
        },
        (err, res, body) => {
            if (!err) {
                console.log("sendTypingOn sent!");
            } else {
                console.error("Unable to send sendTypingOn:" + err);
            }
        }
    );
};

async function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        recipient: {
            id: sender_psid,
        },
        message: response,
    };

    await sendMarkReadMessage(sender_psid);
    await sendTypingOn(sender_psid);
    // Send the HTTP request to the Messenger Platform
    await request(
        {
            uri: "https://graph.facebook.com/v2.6/me/messages",
            qs: { access_token: PAGE_ACCESS_TOKEN },
            method: "POST",
            json: request_body,
        },
        (err, res, body) => {
            if (!err) {
                console.log("message sent!");
            } else {
                console.error("Unable to send message:" + err);
            }
        }
    );
}

let getUsername = (sender_psid) => {
    return new Promise((resolve, reject) => {
        request(
            {
                uri: `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
                method: "GET",
            },
            (err, res, body) => {
                if (!err) {
                    let response = JSON.parse(body);
                    let username = `${response.last_name} ${response.first_name}`;
                    resolve(username);
                } else {
                    console.error("Unable to send message:" + err);
                    reject(err);
                }
            }
        );
    });
};

let getStartedTemplate = (sender_psid) => {
    let response = {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: [
                    {
                        title: "Xin chào bạn đến với fanpage của trang Booking Care",
                        subtitle: "Dưới đây là 1 số lựa chọn của bạn",
                        image_url: IMAGE_GET_STARTED,
                        buttons: [
                            {
                                type: "postback",
                                title: "THAM QUAN DỊCH VỤ",
                                payload: "SIGHTSEEING",
                            },
                            {
                                type: "web_url",
                                url: `${process.env.URL_WEB_VIEW_ORDER}/${sender_psid}`,
                                title: "ĐẶT LỊCH KHÁM BỆNH",
                                webview_height_ratio: "tall",
                                messenger_extensions: true,
                            },
                            {
                                type: "postback",
                                title: "HƯỚNG DẪN SỬ DỤNG BOT",
                                payload: "GUIDE_TO_USE",
                            },
                        ],
                    },
                ],
            },
        },
    };
    return response;
};

let handleGetStarted = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let username = await getUsername(sender_psid);
            let response1 = {
                text: `Chào mừng bạn ${username} đến với Booking Care của Nam Nguyễn`,
            };

            let response2 = getStartedTemplate(sender_psid);

            // send message
            await callSendAPI(sender_psid, response1);

            // send generic template
            await callSendAPI(sender_psid, response2);
            resolve("OK!");
        } catch (error) {
            reject(error);
        }
    });
};

let getSightseeingTemplate = () => {
    let response = {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: [
                    {
                        title: "Bác sĩ nổi bật",
                        subtitle: "Những bác sĩ nổi bật của chúng tôi",
                        image_url: IMAGE_DOCTORS,
                        buttons: [
                            {
                                type: "postback",
                                title: "TIẾN SĨ",
                                payload: "PHD",
                            },
                            {
                                type: "postback",
                                title: "BÁC SĨ TRẺ TUỔI",
                                payload: "YOUNG_DOCTOR",
                            },
                        ],
                    },
                    {
                        title: "Giờ mở cửa",
                        subtitle: "T2-T7 8:00AM - 5:00PM",
                        image_url: IMAGE_BOOKING,
                        buttons: [
                            {
                                type: "web_url",
                                url: `${process.env.URL_WEB_VIEW_ORDER}/${sender_psid}`,
                                title: "ĐẶT LỊCH KHÁM BỆNH",
                                webview_height_ratio: "tall",
                                messenger_extensions: true,
                            },
                        ],
                    },
                    {
                        title: "Các chuyên khoa nổi bật",
                        subtitle: "Các chuyên khoa nổi bật của chúng tôi",
                        image_url: IMAGE_SPECIALTY,
                        buttons: [
                            {
                                type: "postback",
                                title: "XEM CHUYÊN KHOA",
                                payload: "SHOW_SPECIALTIES",
                            },
                        ],
                    },
                ],
            },
        },
    };
    return response;
};

let handleSightseeing = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getSightseeingTemplate();

            // send message
            await callSendAPI(sender_psid, response1);

            resolve("OK!");
        } catch (error) {
            reject(error);
        }
    });
};

let getPHPTemplate = () => {
    let response = {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: [
                    {
                        title: "Tiến sĩ Hà Văn Quyết",
                        subtitle: "Tiến sĩ ưu tú",
                        image_url: IMAGE_LIST_PHD[0],
                        buttons: [
                            {
                                type: "postback",
                                title: "XEM CHI TIẾT",
                                payload: "HA_VAN_QUYET",
                            },
                        ],
                    },
                    {
                        title: "Tiến sĩ Nguyễn Thi Hùng",
                        subtitle: "Tiến sĩ ưu tú",
                        image_url: IMAGE_LIST_PHD[1],
                        buttons: [
                            {
                                type: "postback",
                                title: "XEM CHI TIẾT",
                                payload: "NGUYEN_THI_HUNG",
                            },
                        ],
                    },
                    {
                        title: "Tiến sĩ Vũ Thái Hà",
                        subtitle: "Tiến sĩ ưu tú",
                        image_url: IMAGE_LIST_PHD[2],
                        buttons: [
                            {
                                type: "postback",
                                title: "XEM CHI TIẾT",
                                payload: "VU_THAI_HA",
                            },
                        ],
                    },
                    {
                        title: "Quay trở lại",
                        subtitle: "Quay trở lại dịch vụ",
                        image_url: IMAGE_BACK_SERVICE,
                        buttons: [
                            {
                                type: "postback",
                                title: "QUAY TRỞ LẠI",
                                payload: "BACK_TO_SERVICE",
                            },
                        ],
                    },
                ],
            },
        },
    };
    return response;
};
let handleShowPHD = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getPHPTemplate();

            // send message
            await callSendAPI(sender_psid, response1);

            resolve("OK!");
        } catch (error) {
            reject(error);
        }
    });
};

let getYoungDoctorTemplate = () => {
    let response = {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: [
                    {
                        title: "Bác sĩ Lê Thị Thùy Trang",
                        subtitle: "Những bác sĩ xinh đẹp của chúng tôi",
                        image_url: IMAGE_YOUNG_DOCTOR[0],
                        buttons: [
                            {
                                type: "postback",
                                title: "XEM CHI TIẾT",
                                payload: "LE_THI_THUY_TRANG",
                            },
                        ],
                    },
                    {
                        title: "Bác sĩ Lương Thủy Thu",
                        subtitle: "Những bác sĩ xinh đẹp của chúng tôi",
                        image_url: IMAGE_YOUNG_DOCTOR[1],
                        buttons: [
                            {
                                type: "postback",
                                title: "XEM CHI TIẾT",
                                payload: "LUONG_THUY_THU",
                            },
                        ],
                    },
                    {
                        title: "Quay trở lại",
                        subtitle: "Quay trở lại dịch vụ",
                        image_url: IMAGE_BACK_SERVICE,
                        buttons: [
                            {
                                type: "postback",
                                title: "QUAY TRỞ LẠI",
                                payload: "BACK_TO_SERVICE",
                            },
                        ],
                    },
                ],
            },
        },
    };
    return response;
};
let handleShowYoungDoctor = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getYoungDoctorTemplate();

            // send message
            await callSendAPI(sender_psid, response1);

            resolve("OK!");
        } catch (error) {
            reject(error);
        }
    });
};

let getSpecialtiesTemplate = () => {
    let response = {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: [
                    {
                        title: "Cơ xương khớp",
                        subtitle: "Khoa cơ xương khớp",
                        image_url: IMAGE_SHOW_SPECIALTIES[0],
                        buttons: [
                            {
                                type: "postback",
                                title: "XEM CÁC BÁC SĨ CHUYÊN KHOA",
                                payload: "CO_XUONG_KHOP",
                            },
                        ],
                    },
                    {
                        title: "Thần kinh",
                        subtitle: "Khoa thần kinh",
                        image_url: IMAGE_SHOW_SPECIALTIES[1],
                        buttons: [
                            {
                                type: "postback",
                                title: "XEM CÁC BÁC SĨ CHUYÊN KHOA",
                                payload: "THAN_KINH",
                            },
                        ],
                    },
                    {
                        title: "Tiêu hoá",
                        subtitle: "Khoa tiêu hoá",
                        image_url: IMAGE_SHOW_SPECIALTIES[2],
                        buttons: [
                            {
                                type: "postback",
                                title: "XEM CÁC BÁC SĨ CHUYÊN KHOA",
                                payload: "TIEU_HOA",
                            },
                        ],
                    },
                    {
                        title: "Tim mạch",
                        subtitle: "Khoa tim mạch",
                        image_url: IMAGE_SHOW_SPECIALTIES[3],
                        buttons: [
                            {
                                type: "postback",
                                title: "XEM CÁC BÁC SĨ CHUYÊN KHOA",
                                payload: "TIM_MACH",
                            },
                        ],
                    },
                    {
                        title: "Quay trở lại",
                        subtitle: "Quay trở lại dịch vụ",
                        image_url: IMAGE_BACK_SERVICE,
                        buttons: [
                            {
                                type: "postback",
                                title: "QUAY TRỞ LẠI",
                                payload: "BACK_TO_SERVICE",
                            },
                        ],
                    },
                ],
            },
        },
    };
    return response;
};

// specialties
let handleShowSpecialties = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getSpecialtiesTemplate();

            // send message
            await callSendAPI(sender_psid, response1);

            resolve("OK!");
        } catch (error) {
            reject(error);
        }
    });
};

// doctor of specialties
let getMusculoskeletalTemplate = () => {
    let response = {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: [
                    {
                        title: "Bác sĩ Nguyễn Thị Kim Loan",
                        subtitle: "Được phong tặng Danh hiệu Thầy thuốc Ưu tú",
                        image_url: IMAGE_SHOW_SPECIALTY_MUSCULOSKELETAL[0],
                        buttons: [
                            {
                                type: "postback",
                                title: "XEM CHI TIẾT",
                                payload: "NGUYEN_THI_KIM_LOAN",
                            },
                        ],
                    },
                    {
                        title: "Bác sĩ Nguyễn Thị Lan",
                        subtitle: "Được phong tặng Danh hiệu Thầy thuốc Ưu tú",
                        image_url: IMAGE_SHOW_SPECIALTY_MUSCULOSKELETAL[1],
                        buttons: [
                            {
                                type: "postback",
                                title: "XEM CHI TIẾT",
                                payload: "NGUYEN_THI_LAN",
                            },
                        ],
                    },
                    {
                        title: "Quay trở lại",
                        subtitle: "Quay trở lại dịch vụ",
                        image_url: IMAGE_BACK_SERVICE,
                        buttons: [
                            {
                                type: "postback",
                                title: "QUAY TRỞ LẠI",
                                payload: "BACK_TO_SERVICE",
                            },
                        ],
                    },
                ],
            },
        },
    };
    return response;
};
let handleShowMusculoskeletal = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getMusculoskeletalTemplate();

            // send message
            await callSendAPI(sender_psid, response1);

            resolve("OK!");
        } catch (error) {
            reject(error);
        }
    });
};

let getNerveTemplate = () => {
    let response = {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: [
                    {
                        title: "Bác sĩ Nguyễn Văn Doanh",
                        subtitle:
                            "Bác sĩ có 40 năm kinh nghiệm làm việc chuyên khoa Nội Thần kinh",
                        image_url: IMAGE_SHOW_SPECIALTY_NERVE[0],
                        buttons: [
                            {
                                type: "postback",
                                title: "XEM CHI TIẾT",
                                payload: "NGUYEN_VAN_DOANH",
                            },
                        ],
                    },
                    {
                        title: "Tiến sĩ Kiều Đình Hùng",
                        subtitle:
                            "Trên 20 năm kinh nghiệm công tác ở khoa Phẫu thuật thần kinh - Bệnh viện Việt Đức",
                        image_url: IMAGE_SHOW_SPECIALTY_NERVE[1],
                        buttons: [
                            {
                                type: "postback",
                                title: "XEM CHI TIẾT",
                                payload: "KIEU_DINH_HUNG",
                            },
                        ],
                    },
                    {
                        title: "Quay trở lại",
                        subtitle: "Quay trở lại dịch vụ",
                        image_url: IMAGE_BACK_SERVICE,
                        buttons: [
                            {
                                type: "postback",
                                title: "QUAY TRỞ LẠI",
                                payload: "BACK_TO_SERVICE",
                            },
                        ],
                    },
                ],
            },
        },
    };
    return response;
};
let handleShowNerve = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getNerveTemplate();

            // send message
            await callSendAPI(sender_psid, response1);

            resolve("OK!");
        } catch (error) {
            reject(error);
        }
    });
};

let getDigestTemplate = () => {
    let response = {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: [
                    {
                        title: "Tiến sĩ Hà Văn Quyết",
                        subtitle:
                            "Chuyên gia trên 35 năm kinh nghiệm trong lĩnh vực bệnh lý Tiêu hóa",
                        image_url: IMAGE_SHOW_SPECIALTY_DIGEST[0],
                        buttons: [
                            {
                                type: "postback",
                                title: "XEM CHI TIẾT",
                                payload: "HA_VAN_QUYET",
                            },
                        ],
                    },
                    {
                        title: "Bác sĩ Lê Tuyết Anh",
                        subtitle:
                            "Nguyên bác sĩ Chuyên khoa II chuyên ngành Tiêu hóa, Bệnh viện Bạch Mai",
                        image_url: IMAGE_SHOW_SPECIALTY_DIGEST[1],
                        buttons: [
                            {
                                type: "postback",
                                title: "XEM CHI TIẾT",
                                payload: "LE_TUYET_ANH",
                            },
                        ],
                    },
                    {
                        title: "Quay trở lại",
                        subtitle: "Quay trở lại dịch vụ",
                        image_url: IMAGE_BACK_SERVICE,
                        buttons: [
                            {
                                type: "postback",
                                title: "QUAY TRỞ LẠI",
                                payload: "BACK_TO_SERVICE",
                            },
                        ],
                    },
                ],
            },
        },
    };
    return response;
};
let handleShowDigest = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getDigestTemplate();

            // send message
            await callSendAPI(sender_psid, response1);

            resolve("OK!");
        } catch (error) {
            reject(error);
        }
    });
};

let getHeartTemplate = () => {
    let response = {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: [
                    {
                        title: "Bác sĩ Nguyễn Văn Quýnh",
                        subtitle:
                            "Chuyên gia hàng đầu về nội tim mạch với hơn 30 năm kinh nghiệm",
                        image_url: IMAGE_SHOW_SPECIALTY_HEART[0],
                        buttons: [
                            {
                                type: "postback",
                                title: "XEM CHI TIẾT",
                                payload: "NGUYEN_VAN_QUYNH",
                            },
                        ],
                    },
                    {
                        title: "Tiến sĩ Nguyễn Lân Việt",
                        subtitle: "Nguyên Hiệu trưởng trường Đại học Y Hà Nội",
                        image_url: IMAGE_SHOW_SPECIALTY_HEART[1],
                        buttons: [
                            {
                                type: "postback",
                                title: "XEM CHI TIẾT",
                                payload: "NGUYEN_LAN_VIET",
                            },
                        ],
                    },
                    {
                        title: "Quay trở lại",
                        subtitle: "Quay trở lại dịch vụ",
                        image_url: IMAGE_BACK_SERVICE,
                        buttons: [
                            {
                                type: "postback",
                                title: "QUAY TRỞ LẠI",
                                payload: "BACK_TO_SERVICE",
                            },
                        ],
                    },
                ],
            },
        },
    };
    return response;
};
let handleShowHeart = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getHeartTemplate();

            // send message
            await callSendAPI(sender_psid, response1);

            resolve("OK!");
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    handleGetStarted,
    handleSightseeing,
    handleShowPHD,
    handleShowYoungDoctor,
    handleBackToService,
    handleShowSpecialties,
    handleShowMusculoskeletal,
    handleShowNerve,
    handleShowDigest,
    handleShowHeart,
    callSendAPI,
    getUsername,
};
