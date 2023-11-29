import { Router } from "express";
import Pet from "../schemas/Pet.js";
import AuthMiddleware from '../middlewares/Auth.js'
import Multer from '../middlewares/MulterPosts.js'

const router = new Router();

router.get("/", (req, res) => {
    Pet.find().then(data => {
        const pets = data.map(pet => {
            return {
                petName: pet.petName,
                petOwner: pet.petOwner,
                petImage: pet.petImage,
                createdAd: pet.createdAt,
            }
        })
        res.send(pets);
    }).catch(err => {
        console.error("erro ao mostrar pets que foram salvos", err);
        res.status(400).send({ error: "nao foi possivel obter os dados dos pets" })
    })
})

router.post("/saved",    (req, res) => {
    const { petName, petOwner, petImage, createdAt } = req.body;

    Pet.create({ petName, petOwner, petImage, createdAt }).then(pet => {
        res.status(200).send(pet);
    }).catch(err => {
        console.error("Nao foi possivel adicionar o pet aos pets adicionados", err);
        res.status(400).send({ error: "nao foi possivel salvar o projeto" })
    })
})


export default router; 