import Pet from "../../schemas/Pet";

async function getPets(req, res) {
    try {
        const data = await Pet.find();
        const pets = data.map(pet => {
            return {
                petName: pet.petName,
                petOwner: pet.petOwner,
                petImage: pet.petImage,
                createdAt: pet.createdAt,  // Corrected the property name to 'createdAt'
            };
        });
        res.send(pets);
    } catch (err) {
        console.error("Erro ao mostrar pets que foram salvos", err);
        res.status(400).send({ error: "Não foi possível obter os dados dos pets" });
    }
}

async function savePet(req, res) {
    const { petName, petOwner, petImage, createdAt } = req.body;

    try {
        const pet = await Pet.create({ petName, petOwner, petImage, createdAt });
        res.status(200).send(pet);
    } catch (err) {
        console.error("Nao foi possivel adicionar o pet aos pets adicionados", err);
        res.status(400).send({ error: "nao foi possivel salvar o projeto" });
    }
}
jest.mock('../../schemas/Pet.js', () => ({
    find: jest.fn(),
    create: jest.fn(),
}));

describe('Função savePet', () => {

    it('deve criar um novo pet e retornar status 200 com dados válidos', async () => {
        const req = {
            body: {
                petName: 'TestPet',
                petOwner: 'TestOwner',
                petImage: 'test-image-url.jpg',
                createdAt: '2023-11-25T12:00:00Z',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        await savePet(req, res);

        expect(Pet.create).toHaveBeenCalledWith({
            petName: 'TestPet',
            petOwner: 'TestOwner',
            petImage: 'test-image-url.jpg',
            createdAt: '2023-11-25T12:00:00Z',
        });
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('deve retornar status 400 com dados inválidos', async () => {
        const req = {
            body: {
                petName: 'TestPet',
                petOwner: 'TestOwner',
                // petImage: 'test-image-url.jpg',
                createdAt: '2023-11-25T12:00:00Z',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        jest.spyOn(Pet, 'create').mockRejectedValueOnce(new Error('Mocked error during pet creation'));

        await savePet(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({ error: 'nao foi possivel salvar o projeto' });
    });
});


describe('Função asiudhusadh', () => {

    it('deve retornar a lista de pets ao executar com sucesso', async () => {
        const petData = [
            {
                petName: 'TestPet1',
                petOwner: 'TestOwner1',
                petImage: 'test-image-url1.jpg',
                createdAt: '2023-11-25T12:00:00Z',
            },
            {
                petName: 'TestPet2',
                petOwner: 'TestOwner2',
                petImage: 'test-image-url2.jpg',
                createdAt: '2023-11-26T12:00:00Z',
            },
        ];

        const res = {
            send: jest.fn(),
        };

        Pet.find.mockResolvedValueOnce(petData);

        await getPets({}, res);

        expect(res.send).toHaveBeenCalledWith(petData);

    });

    it('deve retornar status 400 em caso de erro ao obter os dados dos pets', async () => {
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        Pet.find.mockRejectedValueOnce(new Error('Mocked Error'));

        await getPets({}, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({ error: 'Não foi possível obter os dados dos pets' });
    });
});
