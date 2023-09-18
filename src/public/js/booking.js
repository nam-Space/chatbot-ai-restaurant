(function (d, s, id) {
    var js,
        fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/messenger.Extensions.js";
    fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "Messenger");

let APP_ID = 112573741947641;

window.extAsyncInit = function () {
    // the Messenger Extensions JS SDK is done loading

    MessengerExtensions.getContext(
        APP_ID,
        function success(thread_context) {
            // success
            //set psid to input
            $("#psid").val(thread_context.psid);
            handleClickButtonBooking();
        },
        function error(err) {
            // error
            console.log(
                "Lỗi đặt lịch khám bệnh with MessengerExtensions.getContext: ",
                err
            );

            // run backup, get UserId from URL
            $("#psid").val(senderId);
            handleClickButtonBooking();
        }
    );
};

//validate inputs
function validateInputFields() {
    const EMAIL_REG =
        /[a-zA-Z][a-zA-Z0-9_\.]{1,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}/g;

    let email = $("#email");
    let phoneNumber = $("#phoneNumber");

    if (!email.val().match(EMAIL_REG)) {
        email.addClass("is-invalid");
        return true;
    } else {
        email.removeClass("is-invalid");
    }

    if (phoneNumber.val() === "") {
        phoneNumber.addClass("is-invalid");
        return true;
    } else {
        phoneNumber.removeClass("is-invalid");
    }

    return false;
}

function handleClickButtonBooking() {
    $("#btnBooking").on("click", function (e) {
        let check = validateInputFields(); //return true or false

        let data = {
            psid: $("#psid").val(),
            patientName: $("#patientName").val(),
            email: $("#email").val(),
            phoneNumber: $("#phoneNumber").val(),
        };

        if (!check) {
            //close webview
            MessengerExtensions.requestCloseBrowser(
                function success() {
                    // webview closed
                    callAjax(data);
                    $("#patientInfo").addClass("hidden");
                    $("#success").removeClass("hidden");
                },
                function error(err) {
                    // an error occurred
                    console.log(err);
                    callAjax(data);
                    $("#patientInfo").addClass("hidden");
                    $("#success").removeClass("hidden");
                }
            );
        }
    });
}

function callAjax(data) {
    //send data to node.js server
    $.ajax({
        url: `${window.location.origin}/booking-ajax`,
        method: "POST",
        data: data,
        success: function (data) {
            console.log(data);
        },
        error: function (error) {
            console.log(error);
        },
    });
}
