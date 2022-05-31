import { NextApiRequest, NextApiResponse } from "next";

export default function getClientById(req: NextApiRequest, res: NextApiResponse){


    res.json({byId : req.query.id, message:"getClientById"})


}