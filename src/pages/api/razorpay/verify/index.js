import { Mongoose } from "mongoose";
import { getSession } from "next-auth/react";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";

const Razorpay = require("razorpay");
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

export default async function handler(req, res) {
  console.log(req.body);

  if (req.method === "POST") {
    const crypto = require("crypto");
    const session = await getSession({ req });
    const user_id = session && session?.user?.id;
    console.log(user_id);
    let text = req.body.razorpay_payment_id + "|" + req.body.subscription_id;
    let secret = process.env.RAZORPAY_SECRET;
    console.log(secret);
    let algorithm = "sha256";
    let hash, hmac;
    hmac = crypto.createHmac(algorithm, secret);
    hmac.update(text);
    hash = hmac.digest("hex");
    console.log(hash, req.body.razorpay_signature);
    if (hash == req.body.razorpay_signature) {
      // instance.payments.capture(
      //   req.body.razorpay_payment_id,
      //   req.body.amount,
      //   req.body.currency
      // );
      await dbConnect();
      User.schema.add({
        paymentDetails: {
          type: Object,
          subscription_id: { type: String, required: true },
          razorpay_payment_id: { type: String, required: true },
          razorpay_signature: { type: String, required: true },
          createdAt: { type: Date, required: true },
        },
        // paymentHistory: {
        //   type: Array,
        // },
      });

      const data = {
        premiumUser: true,
        paymentDetails: {
          subscription_id: req.body.subscription_id,
          razorpay_payment_id: req.body.razorpay_payment_id,
          razorpay_signature: req.body.razorpay_signature,
          createdAt: req.body.createdAt,
        },
      };

      // await instance.invoices.all(
      //   {
      //     subscription_id: req.body.subscription_id,
      //   },
      //   (err, res) => {
      //     if (err) console.log(err);
      //     if (res) {
      //       console.log(res);
      //       paymentData.paymentHistory.push(res);
      //     }
      //   }
      // );

      const updateUser = await User.findByIdAndUpdate(user_id, data).exec();
      if (!updateUser) {
        return res.status(400).json({});
      }
      // const updatePaymentHistory = await User.findByIdAndUpdate(
      //   { _id: user_id },
      //   { $push: { paymentHistory: paymentData.paymentHistory } }
      // ).exec();
      // if (!updatePaymentHistory) {
      //   return res.status(401).json({});
      // }
      return res.status(200).json({ message: "Success" });
    } else {
      try {
        instance.subscriptions.cancel(
          req.body.subscription_id,
          false,
          (err, res) => {
            console.log(err, res);
          }
        );
      } catch (err) {
        console.log(err);
      }

      console.log("Payment Failed");
      return res.status(500).json({ message: "Payment Failed" });
    }
    // return res.status(400).json({
    //   message: "Something Went Wrong",
    // });
  }
}