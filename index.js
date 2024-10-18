import { SMTPServer } from "smtp-server";
import { simpleParser } from "mailparser";
import { saveNewMail } from "./controllers/mail.js";
import mongoose from "mongoose";
import "dotenv/config";

mongoose
  .connect(process.env.MONGO_URI)
  .then(console.log("MongoDB connected!!"))
  .catch((error) => console.error({ error }));

const server = new SMTPServer({
  allowInsecureAuth: true,
  authOptional: true,
  onConnect(session, callback) {
    if (session.remoteAddress === "127.0.0.1") {
      return callback(new Error("No connections from localhost allowed"));
    }
    return callback();
  },

  onMailFrom(address, session, callback) {
    console.log("onMailFrom", address.address, session.id);
    callback();
  },

  onRcptTo(address, session, callback) {
    if (address.address !== "neel@mail-room.site") {
      return callback(
        new Error("Only neel@mail-room.site is allowed to receive mail")
      );
    }
    callback();
  },

  onData(stream, session, callback) {
    stream.on("data", (data) => console.log(`onData ${data.toString()}`));
    simpleParser(stream, {}, async (err, parsed) => {
      const savedMail = await saveNewMail(parsed);
      console.log("Mail saved successfully!", { savedMail });
    });
    stream.on("end", callback);
  },

  onClose(session) {},
});
server.listen(25, () => console.log("Server running at port: 25"));
server.on("error", (error) => console.log(error.message));
