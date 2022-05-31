import { NextApiRequest, NextApiResponse } from "next";

export default function getAllClients(req: NextApiRequest, res: NextApiResponse){


    res.json({hello : "world", method:req.method})


}