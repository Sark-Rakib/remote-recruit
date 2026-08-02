import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: new URL("../.env", import.meta.url) });

const uri = process.env.MONGO_URI;

async function inspect(db, label) {
  const coll = db.collection("users");
  const found = await coll
    .find({ email: { $regex: /mdrakibsarkar/i } })
    .toArray();
  console.log(`--- ${label} ---`);
  if (!found.length) {
    console.log("(no mdrakibsarkar* users)");
    return;
  }
  for (const u of found) {
    console.log(
      `${u.email} | role=${u.role} | verified=${u.isVerified} | type=${u.accountType} | hasPass=${!!u.password} | passPrefix=${String(u.password).slice(0, 7)}`
    );
  }
}

try {
  const conn = await mongoose.createConnection(uri, { dbName: "remote_recruit" });
  await conn.asPromise();
  await inspect(conn.db, "remote_recruit");
  await conn.close();
} catch (e) {
  console.error("remote_recruit failed:", e.message);
}

try {
  const conn = await mongoose.createConnection(uri, { dbName: "test" });
  await conn.asPromise();
  await inspect(conn.db, "test");
  await conn.close();
} catch (e) {
  console.error("test failed:", e.message);
}

process.exit(0);
