import { SMTPServer } from "smtp-server";
import { simpleParser } from "mailparser";
import { MongoClient } from "mongodb";
import { saveNewMail } from "./controllers/mail.js";

const client = new MongoClient(process.env.MONGO_URI);

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
  client.connect().then(console.log("Mongodb connected!"));
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
