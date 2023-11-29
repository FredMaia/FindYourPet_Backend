import { Router } from "express";
import Post from "../schemas/Post.js";
import AuthMiddleware from '../middlewares/Auth.js'
import isAdmMiddleware from '../middlewares/isAdm.js'
import Multer from '../middlewares/MulterPosts.js'

const router = new Router();

router.get("/", (req, res) => {
    Post.find()
        .then(data => {
            const posts = data.map(post => {
                return {
                    description: post.description,
                    featuredImage: post.featuredImage,
                    username: post.username,
                    state: post.state,
                    city: post.city,
                    createdAt: post.createdAt,
                    id: post.id,
                    userPhoto: post.userPhoto,
                    petName: post.petName,
                    userNumber: post.userNumber
                }
            });
            res.send(posts);
        }).catch(error => {
            console.error("erro ao salvar projeto no banco");
            res.status(400).send({ error: "nao foi possivel obter os dados do projeto" })
        })
})

router.get("/id/:postId", (req, res) => {
    Post.findById(req.params.postId)
        .then(post => {
            res.send(post);
        }).catch(error => {
            console.error("erro ao salvar projeto no banco");
            res.status(400).send({ error: "nao foi possivel obter os dados do projeto" })
        })
})

router.post("/", AuthMiddleware, (req, res) => {
    const { description, username, city, state, userPhoto, petName, userNumber } = req.body;

    Post.create({ description, username, city, state, userPhoto, petName, userNumber })
        .then(post => {
            res.status(200).send(post);
        })
        .catch(error => {
            console.error("erro ao salvar projeto no banco", error);
            res.status(400).send({ error: "nao foi possivel salvar o projeto" })
        })
})

router.put("/:postId", [AuthMiddleware, isAdmMiddleware], (req, res) => {
    console.log(req.body)
    const { description } = req.body;
   
    Post.findByIdAndUpdate(req.params.postId, { description }, { new: true })
        .then(post => {
            res.status(200).send(post);
        })
        .catch(error => {
            console.error("erro ao salvar projeto no banco");
            res.status(400).send({ error: "nao foi possivel atualizar o projeto" })
        })
})

router.delete("/:postId", AuthMiddleware, (req, res) => {
    Post.findByIdAndRemove(req.params.postId).then(() => {
        res.send("projeto removido com sucesso");
    }).catch(err => {
        console.error("erro ao remover projeto", err);
        res.status(400).send({ message: "erro ao remover projeto" })
    })
})

router.post(
    "/featured-image/:postId",
    [AuthMiddleware, Multer.single('featuredImage')],
    (req, res) => {
        const { file } = req;
        if (file) {
            Post.findByIdAndUpdate(req.params.postId, {
                $set: {
                    featuredImage: file.path
                }
            }, { new: true }).then(post => {
                res.send({ post });
            }).catch(error => {
                console.error("Erro ao associar imagem ao projeto", error);
                res.status(500).send({ error: 'Ocorreu um erro, tente novamente' })
            })
        } else {
            res.status(400).send({ error: "nenhuma imagem enviada" })
        }
    })


router.post(
    "/userPhoto/:postId",
    [AuthMiddleware, Multer.single('featuredImage')],
    (req, res) => {
        const { file } = req;
        if (file) {
            Post.findByIdAndUpdate(req.params.postId, {
                $set: {
                    featuredImage: file.path
                }
            }, { new: true }).then(post => {
                res.send({ post });
            }).catch(error => {
                console.error("Erro ao associar imagem ao projeto", error);
                res.status(500).send({ error: 'Ocorreu um erro, tente novamente' })
            })
        } else {
            res.status(400).send({ error: "nenhuma imagem enviada" })
        }
    })

router.post("/images/:postId", Multer.array('images'), (req, res) => {
    const { files } = req;

    if (files && files.length > 0) {
        const images = [];
        files.forEach(file => {
            images.push(file.path);
        })

        Post.findByIdAndUpdate(req.params.postId,
            {
                $set: { images }
            },
            { new: true }
        ).then(post => {
            res.send({ post });
        }).catch(error => {
            console.error("Erro ao associar imagens ao projeto", error);
            res.status(500).send({ error: 'Ocorreu um erro, tente novamente' })
        })
    } else {
        res.status(400).send({ error: "nenhuma imagem enviada" })
    }
})

export default router; 