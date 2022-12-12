import type { NextApiRequest, NextApiResponse } from "next";
import type { ResponseDefaultMsg } from "../../../types/ResponseDefaultMsg";
import { connectMongoDB } from "../../../middlewares/connectMongoDB";
import { validateTokenJWT } from "../../../middlewares/validateTokenJWT";
import { BuyModel } from "../../../models/BuyModel";

import { policyCors } from "../../../middlewares/policyCors";

const buysUserEndpoint = async (req: NextApiRequest, res: NextApiResponse<ResponseDefaultMsg | any>) => {
  try {
    if (req.method != 'GET') {
      return res.status(405).json({ error: 'Método informado não é válido!' });
    }

    const { id } = req?.query;
    if (id) {
      const buysOfUser = await BuyModel.find({ userId: id }).sort({date: -1}).limit(5);
      if (!buysOfUser) {
        return res.status(400).json({ error: 'Compra não encontrada!' });
      }
      
      return res.status(200).json(buysOfUser);
    } else {
      const buys = await BuyModel.find({ deliver: false }).sort({date: -1});
      if (!buys) {
        return res.status(400).json({ error: 'Compra não encontrada!' });
      }
      
      return res.status(200).json(buys);
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: 'Não foi possível obter o histórico de compras!' });
  }
}

export default policyCors(validateTokenJWT(connectMongoDB(buysUserEndpoint)));