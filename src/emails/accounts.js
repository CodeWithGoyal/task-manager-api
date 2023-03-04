// const proxy = require("node-global-proxy").default;

// proxy.setConfig({
//   http: "http://172.16.199.20:8080"
// //   https: "http://172.16.199.20:8080",
// });
// proxy.start();

const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// sgMail.send({
//     to:"himanshugoel517@gmail.com",
//     from : "dhruvbajoria80@gmail.com",
//     subject: "this is my first creation",
//     text: "this is my first mail through send grid"
// })

const sendWelcomeMail = (email,name)=>{
    sgMail.send({
        to : email,
        from: "dhruvbajoria80@gmail.com",
        subject : "welcome",
        text : `welcome ${name}`
    })
}

const sendCancellationMail= (email,name)=>{
    sgMail.send({
        to : email,
        from :"dhruvbajoria80@gmail.com",
        subject: "user delete",
        text: `${email} user has been deleted successfully. thanks for using our services ${name}`

    })
}

module.exports = {
    sendWelcomeMail,
    sendCancellationMail
}