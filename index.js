import { SMTPServer } from "smtp-server";
import { simpleParser } from "mailparser";
import { saveNewMail } from "./controllers/mail.js";
import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://Neel:neel2904@mail-room.m24vx.mongodb.net/";

try {
  const server = new SMTPServer({
    allowInsecureAuth: true,
    authOptional: true,
    onConnect(session, cb) {
      console.log("onConnect", session.id);
      cb(); //Accept connection
    },

    onMailFrom(address, session, cb) {
      console.log("onMailFrom", address.address, session.id);
      cb();
    },

    onRcptTo(address, session, cb) {
      console.log("onRcptTo", address.address, session.id);
      cb();
    },

    onData(stream, session, cb) {
      stream.on("data", (data) => console.log(`onData ${data.toString()}`));
      simpleParser(stream, {}, async (err, parsed) => {
        const savedMail = await saveNewMail(parsed);
        console.log("Mail saved successfully!", { savedMail });
      });
      stream.on("end", cb);
    },
  });
  mongoose.connect(MONGO_URI).then(console.log("MongoDB connected!!"));
  const savedMail = await saveNewMail({
    from: "Neel",
    to: "Neel",
    subject: "Anything",
    body: "Test",
    attachments: [],
  });
  console.log({ savedMail });
  server.listen(25, () => console.log("Server running at port: 25"));
} catch (error) {
  throw new Error(error?.message);
}
