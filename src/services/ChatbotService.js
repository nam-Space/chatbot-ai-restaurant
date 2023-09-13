require("dotenv").config();
import request from "request";

let PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const IMAGE_GET_STARTED = "https://bit.ly/3RkPcOi";

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

let handleGetStarted = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let username = await getUsername(sender_psid);
            let response1 = {
                text: `Chào mừng bạn ${username} đến với Booking Care của Nam Nguyễn`,
            };

            let response2 = sendGetStartedTemplate();

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

let sendGetStartedTemplate = () => {
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
                                title: "THAM QUAN CÁC BÁC SĨ NỔI BẬT",
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

module.exports = {
    handleGetStarted,
};
