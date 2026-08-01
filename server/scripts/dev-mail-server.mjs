// Local SMTP sink for development. Captures emails sent by the app and prints
// them to the console so the full verification flow can be tested without a
// real email provider.
//
// Run with: npm run mail:dev  (or via the root `npm run dev:all`)
// The app sends to SMTP_HOST=localhost / SMTP_PORT=1025 (see server/.env).
import { SMTPServer } from "smtp-server";

const PORT = Number(process.env.SMTP_PORT || 1025);

const server = new SMTPServer({
  authOptional: true,
  disabledCommands: ["STARTTLS"],
  onAuth(auth, _session, callback) {
    // Accept any credentials — this sink is for local development only.
    callback(null, { user: auth.username });
  },
  onData(stream, session, callback) {
    let body = "";
    stream.on("data", (chunk) => (body += chunk.toString()));
    stream.on("end", () => {
      const rcpt = session.envelope.rcptTo?.[0]?.address || "unknown";
      const from = session.envelope.mailFrom?.address || "unknown";
      console.log("\n────────────────────────────────────────────");
      console.log(`📨 Email received (dev SMTP sink)`);
      console.log(`   From: ${from}`);
      console.log(`   To:   ${rcpt}`);
      console.log("────────────────────────────────────────────");
      console.log(body.trim());
      console.log("────────────────────────────────────────────\n");
      callback();
    });
  },
});

server.listen(PORT, () => {
  console.log(`📬 Dev mail sink listening on smtp://localhost:${PORT}`);
  console.log("   Emails sent by the app will appear here.");
});

server.on("error", (err) => {
  console.error("❌ Dev mail sink error:", err.message);
});
