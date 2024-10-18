import Mail from "../models/mail.js";

const saveNewMail = async (mailData) => {
  const res = await Mail.create({
    from: mailData.from.text,
    to: mailData.to.text,
    subject: mailData.subject,
    body: mailData.text,
    attachments: mailData.attachments,
  });
  return res;
};

export { saveNewMail };
