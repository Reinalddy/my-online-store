import type { NextApiRequest, NextApiResponse } from "next";
import { signUp } from "@/lib/firebase/service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method === 'POST') {
    await signUp(req.body, (status) => {
      console.log(status);
      if(status.status === true) {
        res.status(200).json({status: true, message: 'register success'});

      } else {
        res.status(400).json({status: status.status, message: status.message});
      }
    });
  } else {
    res.status(405).json({status: false,statusCode: 405,  message: 'Who are you?'});
  }



}