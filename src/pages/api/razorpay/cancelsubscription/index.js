import { getSession } from "next-auth/react";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";

const razorpay = require("razorpay");

const instance = new razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});
export default async function handler(req, res) {
  const session = await getSession({ req });
  const email = session && session.user.email;

  await dbConnect();
  try {
    await User.findOne({ email: email })
      .then((user) => {
        if (user) {
          const data = JSON.parse(JSON.stringify(user));
          let subId = data.paymentDetails.subscription_id;

          if (data) {
            instance.subscriptions.cancel(subId, false, (err, order) => {
              // instance.subscriptions.fetch(subId, (err, order) => {
              if (err) {
                console.log(err);
                return res.status(400).json({
                  message: "Something Went Wrong",
                });
              }
              if (order) {
                console.log(order);
                return res.status(200).json(order);
              }
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          message: "Something Went Wrong",
        });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something Went Wrong",
    });
  }
}
