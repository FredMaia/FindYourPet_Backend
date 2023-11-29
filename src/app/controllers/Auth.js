import { Router } from "express";
import bcrypt from "bcryptjs";
import authConfig from "../../config/Auth.js"
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../schemas/User.js";
import Mailer from "../../modules/Mailer.js"
import AuthMiddleware from '../middlewares/Auth.js'
import isAdm from '../middlewares/isAdm.js'
import Multer from '../middlewares/MulterUsers.js'

const router = new Router();

const generateToken = params => {
    return jwt.sign(
        params,
        authConfig.secret,
        {
            expiresIn: 86400,
        },
    );
}

router.post("/register", (req, res) => {
    const { email, password, name, phoneNumber, state, city } = req.body;

    User.findOne({ email }).then(userData => {
        if (userData) {
            return res.status(400).send({ error: 'User already exists' });
        } else {
            User.create({ email, password, name, phoneNumber, state, city })
                .then(user => {
                    user.password = undefined;
                    return res.send({ user });
                }).catch(err => {
                    console.error("erro ao salvar usuario");
                    return res.status(400).send({ error: 'registration failed' });
                })
        }
    }).catch(err => {
        console.error("erro ao registrar usuario");
        res.status(500).send({ error: 'registration failed' });
    })
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email })
        .select('+password')
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password)
                    .then(result => {
                        if (result) {
                            const token = generateToken({
                                uid: user.id,
                                isAdm: user.isAdm
                            })

                            return res.send({
                                token: token,
                                tokenExpiration: '1d',
                                id: user.id,
                                img: user.userProfilePhoto,
                                state: user.state,
                                city: user.city,
                                username: user.name,
                                phoneNumber: user.phoneNumber,

                            })
                            // user.password = undefined;
                            // return res.send({user});
                        } else {
                            return res.status(400).send({ error: 'invalid password' })
                        }
                    }).catch(err => {
                        console.error('erro ao verificar senha', err);
                        return res.status(500).send({ error: 'internal server error' })
                    })
            } else {
                return res.status(404).send({ error: "user not found" })
            }
        }).catch(error => {
            console.error("Erro ao logar", error);
            return res.status(500).send({ err: "internal server error" })
        })
});

router.post("/forgot-password", (req, res) => {
    const { email } = req.body;
    User.findOne({ email })
        .then(user => {
            if (user) {
                const token = crypto.randomBytes(20).toString('hex');
                const expiration = new Date();
                expiration.setHours(new Date().getHours() + 3);

                User.findByIdAndUpdate(user.id, {
                    $set: {
                        passwordResetToken: token,
                        passwordResetTokenExpiration: expiration
                    }
                }).then(() => {
                    Mailer.sendMail({
                        to: email,
                        from: "webmaster@testeexpress.com",
                        template: 'auth/forgot_password',
                        context: { token }
                    }, err => {
                        if (err) {
                            console.error("Erro ao enviar email", err);
                            return res.status(400).send({ error: "erro ao enviar email" })
                        } else {
                            return res.send();
                        }
                    })
                }).catch(error => {
                    console.error("erro ao salvar token", error)
                    return res.status(500).send({ error: 'usuario nao encontrado' })
                })
            }
        }).catch(error => {
            console.error("Erro", error);
            return res.status(500).send({ error: "internal server error" })
        })
});

router.post("/reset-password", (req, res) => {
    const { email, token, newPassword } = req.body;

    User.findOne({ email })
        .select('+passwordResetToken passwordResetTokenExpiration')
        .then(user => {
            if (user) {
                if (token != user.passwordResetToken || new Date().now > user.passwordResetTokenExpiration) {
                    return res.status(400).send({ error: 'invalid token' })
                } else {
                    user.passwordResetToken = undefined;
                    user.passwordResetTokenExpiration = undefined;
                    user.password = newPassword;

                    user.save()
                        .then(() => {
                            res.send({ message: 'senha trocada com sucesso' })
                        })
                        .catch((err => {
                            console.error('erro ao salvar senha', err);
                            return res.status(500).send({ error: 'internal server error' })
                        }))
                }
            } else {
                return res.status(404).send({ error: 'User not found' })
            }
        }).catch(error => {
            console.error("Erro", error);
            return res.status(500).send({ error: "internal server error" })
        })
});

// router.post(
//     "/featured-image/:postId",
//     [AuthMiddleware, Multer.single('featuredImage')],
//     (req, res) => {
//         const { file } = req;
//         if (file) {
//             User.findByIdAndUpdate(req.params.postId, {
//                 $set: {
//                     userProfilePhoto: file.path
//                 }
//             }, { new: true }).then(user => {
//                 res.send({ user });
//             }).catch(error => {
//                 console.error("Erro ao associar imagem ao projeto", error);
//                 res.status(500).send({ error: 'Ocorreu um erro, tente novamente' })
//             })
//         } else {
//             res.status(400).send({ error: "nenhuma imagem enviada" })
//         }
//     })

router.get("/profile", [AuthMiddleware], (req, res) => {
    const id = req.uid;
    if (!id) {
        return res.json({ message: "nao autorizado" })
    }

    User.findById(id)
        .then(user => {
            res.send(user);
        }).catch(error => {
            console.error("erro ao salvar projeto no banco" + error);
            res.status(400).send({ error: "nao foi possivel obter os dados do projeto" })
        })
})

router.get("/profile/adm", [AuthMiddleware, isAdm], (req, res) => {
    return res.status(200).send({
        message: "true"
    });
})

export default router;