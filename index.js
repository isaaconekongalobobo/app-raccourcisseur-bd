// J’importe les differents modules dont aurra besoins le projet
const { log } = require("console");
const express = require ("express"),

// // Appel du fichier de connexion
// db = require ("./connexionDb"),

tinyURL = require ("shefin-tinyurl"),
// Module pour le QR code
qrCode = require('qrcode'),
// Module fs pour la gestion des fichiers
fs = require ("fs"),


// Fichier des donnée des utilisateur
dbUser = require("./data/dbUser.json");
// Fichier pour stocker les urls
dbUrl = require("./data/dbUrl.json");
// Fichier pour stocker les urls
dbSession = require("./data/dbSession.json");



// Le port sur lequel va tourner le serveur
port = 3001;
// Je crée l’application 
const app = express ();

// Je parametre ejs comme moteur de template du projet
app.set ("view engine", "ejs");
// Je place le dossier par défaut pour les templates
app.set("views", __dirname + "/views");
// Je définis le dossier pour les fichiers statique tel que le css et le js
app.use (express.static ("public"));
app.use(express.json());
// Je parametre express pour encoder les url envoyé avec les réquettes
app.use (express.urlencoded({extended : true}))

// ------------------------------------------   CONFIGURATION DE POSTGRE    -----------------------------------------------------------------

const { Client } = require('pg');

const client = new Client({
  user: 'onekdev',
  password: 'onekonga22',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'db-url-shortener'
});

client.connect();





// -------------------------------------    CRÉATION DES ROUTES GET     --------------------------------------
// Page de connexion pour l’utilisateur
app.get ("/", (req, res) => {
    // J’affecte a la reponse un status code de 200
    res.statusCode = 200;
    // Je réecrit l’en-tete de la reponse
    res.set ("Content-Type", "text/html");
    // Je donne un rendu 
    res.redirect ("/pageAcceuil")
})

// Page pour le résultat de la génération d’une url
app.get ("/result-url", (req, res) => {
    const urlInfo = dbUrl.at (-1);
    // J’affecte a la reponse un status code de 200
    res.statusCode = 200;
    // Je réecrit l’en-tete de la reponse
    res.set ("Content-Type", "text/html");
    // Je donne un rendu 
    res.render ("./pages/resultUrl", {urlCourt : urlInfo.urlCourt, urlLong : urlInfo.urlLong, qrCode : urlInfo.qrCode});
})


// Page d’acceuil de l’application
app.get ("/pageAcceuil", (req, res) => {
    res.statusCode = 200;
    res.set ("Content-Type", "text/html");
    res.render ("./pages/acceuil");
})

// Page d’inscription pour l’utilisateur
app.get ("/inscription", function (req, res) {
    // J’affecte a la reponse un status code de 200
    res.statusCode = 200;
    // Je réecrit l’en-tete de la reponse
    res.set ("Content-Type", "text/html");
    // Je donne un rendu 
    res.render ("./pages/inscription");
})



// -------------------------    Route POST pour le traitement des URL et leurs raccourcissement ----------------------
app.post ("/pageAcceuil", (req, res) => {
    // Je récupere l’url envoyé par l’utilisteur via les parametre de l’url
    let {urlLong} = req.body;

    // Je vérifie si il se trouve dans la bdd des urls une qui correspond a celle envoyé par l’utilisateur
    let urlExist = dbUrl.find((url) => url.urlLong == urlLong ); 
    if (urlExist) {

        res.statusCode = 201;
        res.set ("Content-Type", "text/html");                                                                                                                                                                                                                                                                            
        console.log("Url existant");
        // Je renvoie a l’utilisateur l’URL court et le QR code appartenant a celle-ci
        res.send ();
        // res.render ("./pages/resultUrl", {result : urlExist.urlCourt, url : urlExist.qrCode});

    } else {
        if (dbSession.length === 1) {
            tinyURL.shorten (urlLong, (urlReduit, error) => {
                if (error) {
                    console.log("Erreur de Raccourcissement");
                } else {

                    console.log(urlReduit);
                    // Je genere le QR code avec la méthode toDataURL()
                    qrCode.toDataURL(urlReduit, function (err, qrCode) {
                        if (err) {
                            console.log("Erreur QR code");
                        } else {
                            console.log(qrCode);
                            let date = new Date
                            // Je rajoute l’objet contenant les informations sur l’url géneréé
                            dbUrl.push({
                                urlLong,
                                urlCourt : urlReduit,
                                qrCode,
                                user : { email : dbSession.email, mdp : dbSession.mdp},
                                urlDate : date.getDate(),
                                nbClic : 0,
                            });
                            // J’écrase le contenue du fichier dbUrl et le réécrit avec le tableau nouvellement affecté
                            fs.writeFileSync("./data/dbUrl.json", JSON.stringify(dbUrl, null, 2));
                            res.statusCode = 200;
                            res.setHeader('Content-Type', "text/html");
                            res.send ();
                        }                        
                    })


                }
            })
        }
    }

})




// --------------------------------------   Route POST pour l’inscription des utilisateur   --------------------------------------
app.post ("/inscription", async (req, res) => {
    // Je récupere dans un objet les données contenu dans le corp de la requette
    let dataInscription = req.body;
    // Je déstructure cet objet afin de récuperer le champs par leurs id
    let {nom, email, mdp } = dataInscription;
    const reqVerification = `SELECT * FROM public."user" WHERE nom='${nom}'AND email='${email}'`;
    const reqInsertion = `INSERT INTO public."user"(nom, email, "motDePasse") VALUES ('${nom}', '${email}', '${mdp}')`;
    // je verifie s’il y a un utilisteur avec ces identifiant dans la base de donnée
    try {
        const result = await client.query(reqVerification, (err, reponse) => {
            if (err) {
                console.log("Erreur lors de la requette de verification");
                console.log(err);
            } else {
                let result = reponse.rows
                if (result.length === 0) {
                    
                    // Si aucun utilisateur n’est trouvé

                    // J’insere les information de l’utilisateur dans la bdd
                    try {
                        const result = client.query(reqInsertion, (err, reponse) => {
                            if (err) {
                                console.log("Erreur lors de l’insertion");
                                console.log(err);
                            } else {
                                console.log ("Utilisateur ajouté");
                                // Je rajoute l’objet contenant les informations de l’utilisateur dans le tableau instancié
                                dbSession.push(dataInscription);
                                // J’écrase le contenue du fichier dbUser et le réécrit avec le tableau nouvellement affecté
                                fs.writeFileSync("./data/dbSession.json", JSON.stringify(dbSession, null, 2));
                                // Je donne un rendu du méssage de succée
                                res.render ("./pages/messageSuccee");
                            }
                        });
                        // client.end ();
                    } catch (err) {
                        console.log(err);
                    }
                } else {

                    // S’il y a un utilisateur trouvé avec ces identifiants 
                    console.log ("Il y’a des utilisateurs avec ces identifiants");
                    res.redirect ("/userExistant");
                }
            }
        });
    } catch (err) {
        console.log(err);
    }
})





// Page pour les historiques de l’utilisateur connecté
app.get ("/historique", (req, res) => {
    // Je selectionne tout les url généré par cet utilisateur
    if ( dbSession.length === 1) {
        // Si l’utilisateur est connecté
        let email = dbSession[0].email, 
        nom = dbSession[0].nom;

        // Je recupere tout l’id de l’utilisateur connecté
        let reqIdUser = `SELECT * FROM public."user" WHERE nom='${nom}'AND email='${email}'`;

        try {
            const result = client.query(reqIdUser, (err, reponse) => {
                if (err) {
                    console.log("Erreur lors de la requette de recherche");
                    console.log(err);
                } else {
                    const result = reponse.rows
                    const idUser = result[0].idUser;

                    // Je selectionne toute les historique de cet utilisateur
                    const reqHistorique = `SELECT * FROM public."historique" WHERE "idUser"='${idUser}'`;
                    const reponseHistorique = client.query (reqHistorique, (err, result) => {
                        if (err) {
                            console.log("Erreur lors de la recherche des historique");
                            console.log(err);
                        } else {
                            console.log("Requette éxecuté");
                            if (result.rows.length === 0) {
                                // Si aucunne historique n’a été trouvée
                                res.render ("./pages/pageHistorique", 
                                    {
                                        historiqueUrl : {},
                                        message : "Vous n’avez aucune historique",
                                    });  
                            } else {
                                // Je rédirige l’utilisateur vers la page des historiques
                                res.render ("./pages/pageHistorique", 
                                    {
                                        historiqueUrl : result.rows[0],
                                        message : ""
                                    }); 
                            }
                        }
                    })
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

})

// je mets le serveur sur écoute grace a la méthode listen()
app.listen (port, (erreur) => {
    // Je test s’il y a eu erreur lors de la connexion
    if (erreur) {
        // J’affiche le méssage de l’érreur dans la console
        console.log(erreur.message);
    } else {
        // J’affiche un méssage indiquant le port sur lequel tourne le serveur
        console.log(`Le serveur tourne sur le port ${port}`);
    }
})