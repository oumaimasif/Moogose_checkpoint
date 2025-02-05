import { error } from "console";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const mongoose = require("mongoose");
const uri = "mongodb+srv://Omaima134:Omaima134@cluster0.paelt.mongodb.net/dbPerson?retryWrites=true&w=majority&appName=Cluster0";

//connection en base de donner
const connectToDataBase = async () => {
    mongoose.connect(uri, {})
        .then(() => {
            console.log(" Connecté à MongoDB");
        })
        .catch((err) => {
            console.error("Échec de la connexion à MongoDB", err);
        }
        )
};

await connectToDataBase();

//Créer une personne avec ce prototype :
const personSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    age: Number,
    favoriteFoods: [String]
});

const createPr = [
    { name: "Sally", age: 25, favoriteFoods: ["pizza"] },
    { name: "ali", age: 25, favoriteFoods: ["pizza", "burritos"] },
    { name: "Ahmed", age: 30, favoriteFoods: ["pizza", "Sushi", "Kebab"] },
    { name: "Noor", age: 37, favoriteFoods: ["Taco", "Hamburger"] }
];
//la creation d'un instance

const Person = mongoose.model('Person', personSchema);

async function createPersons(persons) {
    try {
        const docs = await Person.insertMany(persons);
        console.log('Personnes enregistrer:', docs);
    } catch (err) {
        console.error('Erreur lors de l\'enregistrement des personnes :', err);
    }
}
await createPersons(createPr);

//Trouver un persone par nom
const findPerson = async (person) => {
    try {
        const result = await Person.find({ name: person });
        console.log("Personne trouvee par nom : ", result);
    } catch (err) {
        console.error("Error fetching person:", err);

    }
};
await findPerson("Ahmed");

//Toruver une personne par ID

const FindById = async (id) => {
    try {
        const result = await Person.findById(id);
        console.log("Personne trouvee par ID : ", result);
    }
    catch (err) {
        console.error("Error fetching person by ID:", err);
    }
}
await FindById("67a2b2e904251130b5e975a6");

//trouver une personne par aliment
const FindFood = async (food) => {
    try {
        const rst = await Person.findOne({ favoriteFoods: food });
        console.log("Personne trouvee est : ", rst);
    } catch (err) {
        console.error("Aucun personnes ", err);

    }
}
await FindFood("pizza");

// Mettre à jour un document  
const upDateInfo = async (personId) => {
    try {
        const update = await Person.findOneAndUpdate(
            { _id: personId },
            { $push : {favoriteFoods: "hamburger" }},
            { new: true }
        );
        console.log("Personne mise à jour", update);
    } catch (error) {
        console.error("Erreur de la mise à jour :", err);
    }

}
await upDateInfo('67a2b2e904251130b5e975a3');


//mettre à jour l'age d'une personne
const upDateAge = async (pname) => {
    try {
        const newPerson = await Person.findOneAndUpdate(
            { name: pname },
            { age: 20 },
            { new: true })
        console.log("Mettre à jour de l'age :", newPerson);
    } catch (error) {
        console.error("Erreur de la mise à jour :", err);
    }

};

await upDateAge('Ahmed');

//Suppression d'un document par _id
const RemoveByid = async (id) => {
    try {
        const remove = await Person.findByIdAndDelete(id);
        console.log("Bien supprimer :",remove);
    } catch (err) {
        console.error(err);
    }
};
RemoveByid('67a2b2e904251130b5e975a6');


//Crée Mary & Supprime la
const createOne = async () => {

    try {
        const personMary = new Person({ name: "Mary", age: 19, favoriteFoods: ["Crepes", "Pizza"] });
        personMary.save();
        console.log("bien cree :", personMary);
    } catch (error) {
      console.log(error);
    }
};
createOne();

//Supprimez toutes les personnes dont le nom est "Mary"
const removeMary = async ()=>{
    try {
        const remove= await Person.deleteMany({name:"Mary"});
        console.log("bien supprimer ",remove);
    } catch (err) {
        console.error(err);
        
    }
}
await removeMary();

//Trouvez des personnes qui aiment les burritos
const burritosFind = async () => {
    try {
        const result = await Person.find({ favoriteFoods: 'burritos' })
            .sort({ name: 1 })
            .limit(2)
            .select('-age')
            .exec();
        console.log('Voila le resultat :', result);
    } catch (err) {
        console.error(err);
    }
};

await burritosFind();

mongoose.connection.close();
