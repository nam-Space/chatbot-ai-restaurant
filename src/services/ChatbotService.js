require("dotenv").config();
import request from "request";

let PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const IMAGE_GET_STARTED = "https://bit.ly/nam-bot-1";
const IMAGE_DOCTORS = "https://bit.ly/nam-bot-3";
const IMAGE_BOOKING = "https://bit.ly/nam-bot-4";
const IMAGE_SPECIALTY = "https://bit.ly/nam-bot-5";

const IMAGE_LIST_PHD = [
    "https://bit.ly/3PCJSod",
    "https://bit.ly/48g6ySr",
    "https://bit.ly/3rfbwOK",
];

const IMAGE_YOUNG_DOCTOR = ["https://bit.ly/48eI9wA", "https://bit.ly/46fzI2p"];

const IMAGE_BACK_SERVICE = "https://bit.ly/3PDcwFN";

function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        recipient: {
            id: sender_psid,
        },
        message: response,
    };

    // Send the HTTP request to the Messenger Platform
    request(
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

let getStartedTemplate = () => {
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
                                type: "postback",
                                title: "ĐẶT LỊCH KHÁM BỆNH",
                                payload: "BOOKING",
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

            let response2 = getStartedTemplate();

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
                                type: "postback",
                                title: "ĐẶT LỊCH KHÁM BỆNH",
                                payload: "BOOKING",
                            },
                        ],
                    },
                    {
                        title: "Các chuyên khoa phổ biến",
                        subtitle: "Các chuyên khoa nổi bật của chúng tôi",
                        image_url: IMAGE_SPECIALTY,
                        buttons: [
                            {
                                type: "postback",
                                title: "CHI TIẾT",
                                payload: "SHOW_ROOMS",
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

let handleBackToService = async (sender_psid) => {
    await handleSightseeing(sender_psid);
};

module.exports = {
    handleGetStarted,
    handleSightseeing,
    handleShowPHD,
    handleShowYoungDoctor,
    handleBackToService,
};
