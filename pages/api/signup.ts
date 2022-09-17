import type { NextApiRequest, NextApiResponse } from "next";
import type { ResponseDefaultMsg } from "../../types/ResponseDefaultMsg";
import type { UserRequest } from "../../types/UserRequest";
import { UserModel } from "../../models/UserModel";
import { connectMongoDB } from "../../middlewares/connectMongoDB";

import md5 from "md5";

const endpointSignup = async (req: NextApiRequest, res: NextApiResponse<ResponseDefaultMsg>) => {
  if (req.method === 'POST') {
    const user = req.body as UserRequest;

    // verificar os dados (regex)
    if (!user.name || user.name.length < 2) {
      return res.status(400).json({error : 'Nome de usuário inválido!'});
    }
    if (!user.email || user.email.length < 6 || !user.email.includes('@') || !user.email.includes('.')) {
      return res.status(400).json({error : 'E-mail de usuário inválido!'});
    }
    if (!user.password || user.password.length < 6) {
      return res.status(400).json({error : 'Senha de usuário inválida!'});
    }

    // verificar duplicidade
    const verifyUserEmail = await UserModel.find({email : user.email});
    if (verifyUserEmail && verifyUserEmail.length > 0) {
      return res.status(400).json({error : 'E-mail de usuário já cadastrado!'});
    }

    // criptografar a senha antes de salvar
    user.password = md5(user.password)

    // salvar usuário no banco de dados
    await UserModel.create(user);
    return res.status(200).json({msg : 'Usuário cadastrado com sucesso!'});
  }
    return res.status(405).json({error : 'Método informado não é válido!'});
}

export default connectMongoDB(endpointSignup);