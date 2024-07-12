// Je selectionne le formulaire qui récevra l’url
const formUrl = document.querySelector ("#formUrl"),
// Formulaire de connexion
formConnexion = document.querySelector ("#formConnexion"),
// Formulaire d’inscription
formInscription = document.querySelector ("#formInscription"),



// Je récupere l’url de la page actuel pour masquer les onglets dans la page de connexion
pageUrl = window.location.pathname;
// Je check si il s’agit de la racine pour masquer les onglets 
if (pageUrl === "/") {
  // Je sélectione le bloc des url
  let onglets = document.querySelector ("#navigation");
  // masque les onglets
  onglets.style.display = "none";
} else if (pageUrl === "/inscription") {
  // Je sélectione le bloc des url
  let onglets = document.querySelector ("#navigation");
  // masque les onglets
  onglets.style.display = "none";
}




// Je crée une fonction asynchrone afin d’envoyer des requette au serveur
async function sendReq (data, cibleLink) {
    try {
      const response = await fetch(cibleLink, {
        method: "POST", 
        body:JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      })
  
      if (response.ok) {
        console.log ("Utilisateur trouvée");
      } else if (response.status === 404) {
        console.log("Aucun utilisateur trouvée");
      }
      
      console.log(response);
    } catch (error) {
      
    }
}

// J’écoute les évenement sur le formulaire de connexion
formConnexion.addEventListener ("submit", (event) => {
    // Je reinitialise le comportement par défaut du formulaire
    event.preventDefault ();
    // Je récupere la cible de l’évenement
    const cible = event.target;
    // Je crée l’objet FormData pour recuperer les  entré du formulaire 
    const formData = new FormData(formConnexion);
    // Je récupere les entré sous forme d’objet grace a la méthode fromentries()
    const champs = Object.fromEntries(formData.entries());
    // Je déstructure cet objet afin de récuperer l’e-mail et le mot de passe de l’utilisateur
    const {email, mdp } = champs;
    // Je traite les donnée du récu
    if (email !== "" && mdp !== "" && mdp.length >= 8) {
        // J’envoie la requette au seveur
        sendReq (champs, "/connexion");
        formConnexion.reset ();
    }

})

// J’ecoute la soumission du formulaire d’inscription
formInscription.addEventListener ("submit", (event) => {
  event.preventDefault ();
  const cible = event.target;
  // Je crée l’objet FormData pour recuperer les  entré du formulaire 
  const formData = new FormData(formInscription);
  // Je récupere les entré sous forme d’objet grace a la méthode fromentries()
  const champs = Object.fromEntries(formData.entries());
  // Je déstructure cet objet afin de récuperer l’e-mail et le mot de passe de l’utilisateur
  const {nom, email, mdp } = champs;
  if (nom !== "" && email !== "" && mdp !== "" && mdp.length >= 8) {
    // J’envoie la requette au seveur
    sendReq (champs, "/inscription");
    formInscription.reset ();
  }
})

