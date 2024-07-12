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
        window.location.href  = "/result-url";
      } else if (response.status == 201) {
        let infoUrl = await response.json ();
        console.log(infoUrl);
      }
      
      console.log(response);
    } catch (error) {
      
    }
}

// J’écoute l’évenement submi sur le formulaire des URLs
formUrl.addEventListener ("submit", (event) => {
    // Je reinitialise le comportement par défaut de la cible
    event.preventDefault ();
    // Je récupere la cible de l’évenement
    const cible = event.target;
    // Je crée l’objet FormData pour recuperer les  entré du formulaire 
    const formData = new FormData(formUrl);
    // Je récupere les entré sous forme d’objet grace a la méthode fromentries()
    const champs = Object.fromEntries(formData.entries());
    // Je déstructure cet objet afin de récuperer l’url fournit par l’utilisateur
    const {urlLong} = champs;
    // J’encode l’url pour la rendre transportable via la requette
    // let vraiUrl = encodeURIComponent (urlLong);
    // J’envoie la réquette au serveur avec les donnée réceuillit via le navigateur
    // window.location.href = `/traitementUrl/${vraiUrl}`;
    sendReq (champs, "/pageAcceuil");
    // Je reinitialise le formulaire
    formUrl.reset ();

})