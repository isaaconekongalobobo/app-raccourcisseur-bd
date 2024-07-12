
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
        window.location.href = "/pageAcceuil";
      } else if (response.status == 404) {
        window.location.href = "/aucunUser";
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

    console.log(champs);
    sendReq (champs, "/connexion")
    // // Je déstructure cet objet afin de récuperer l’e-mail et le mot de passe de l’utilisateur
    // const {email, mdp } = champs;
    // // Je traite les donnée du récu
    // if (email !== "" && mdp !== "" && mdp.length >= 8) {
    //     // J’envoie la requette au seveur
    //     sendReq (champs, "/");
    //     formConnexion.reset ();
    // }

})