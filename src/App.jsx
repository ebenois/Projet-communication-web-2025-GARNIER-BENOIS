import { useState } from 'react';
import './App.css';

function Connexion() {
  const [identifiant, setIdentifiant] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');
  const [resultats, setResultats] = useState([]);
  const [moyenne, setMoyenne] = useState(0);
  const [estConnecte, setEstConnecte] = useState(false);

  const handleConnexion = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost/APItraitementnote.php?identifiant=${identifiant}&motDePasse=${motDePasse}`);
      const data = await response.json();

      if (data.length > 0) {
        setResultats(data);
        setMessage('');
        setEstConnecte(true);
        let total = 0;
        data.forEach(element => {
          total += parseFloat(element.note);
        });
        setMoyenne((total / data.length).toFixed(2));
      } else {
        setMessage("Identifiant ou mot de passe incorrect.");
      }
    } catch (error) {
      setMessage("Erreur lors de la connexion.");
    }
  };


  if (estConnecte) {
    return (
      <div class="text-gray-900 bg-gray-200">
        <div class="p-4 flex">
          <h1 class="text-3xl">Récapitulatif</h1>
        </div>
        <div class="px-3 py-4 flex justify-center">
          <table class="w-full text-md bg-white shadow-md rounded mb-4">
            {resultats.some(r => r.job === "eleve") && (
              <>
                <tbody>
                  <tr class="border-b">
                    <th class="text-left p-3 px-5">Matières</th>
                    <th class="text-left p-3 px-5">Notes</th>
                  </tr>
                  {resultats.map((note, index) => (
                    <tr class="border-b hover:bg-orange-100 bg-gray-100" key={index}>
                      <td class="p-3 px-5">{note.nom_matiere}</td>
                      <td class="p-3 px-5">{note.note}</td>
                    </tr>
                  ))}
                  <tr class="border-b hover:bg-orange-100 bg-gray-100">
                    <td class="p-3 px-5">Moyenne</td>
                    <td class="p-3 px-5">{moyenne}</td>
                  </tr>
                </tbody>
              </>
            )}
            {resultats.some(r => r.job === "prof") && (
              <>
                <tbody>
                  <tr class="border-b">
                    <th class="text-left p-3 px-5">Matières</th>
                    <th class="text-left p-3 px-5">Nom</th>
                    <th class="text-left p-3 px-5">Notes</th>
                    <th></th>
                  </tr>
                {resultats.map((note, index) => (
                  <tr class="border-b hover:bg-orange-100 bg-gray-100" key={index}>
                    <td class="p-3 px-5">{note.nom_matiere}</td>
                    <td class="p-3 px-5">{note.utilisateur_nom} {note.utilisateur_prenom}</td>
                    <td class="p-3 px-5">{note.note}</td>
                  </tr>
                ))}
                  <Notes/>
                </tbody>
              </>
            )}
          </table>
        </div>
      </div>
    );
  }

  // Sinon, afficher le formulaire
  return (
    <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div class="relative py-3 sm:max-w-xl sm:mx-auto">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div class="max-w-md mx-auto">
            <div>
              <h1 class="text-2xl font-semibold">Connexion</h1>
            </div>
            <form onSubmit={handleConnexion} class="divide-y divide-gray-200">
              <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div class="relative">
                  <input onChange={(e) => setIdentifiant(e.target.value)} required value={identifiant} autocomplete="off" id="identifiant" name="identifiant" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="identifiant" />
                  <label for="identifiant" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Identifiant</label>
                </div>
                <div class="relative">
                  <input onChange={(e) => setMotDePasse(e.target.value)} minLength="8" required value={motDePasse} autocomplete="off" id="pass" name="pass" type="password" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="pass" />
                  <label for="pass" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Mot de passe</label>
                </div>
                <div class="relative">
                  <input type="submit" value="Se connecter" class="bg-blue-500 text-white rounded-md px-2 py-1"/>
                </div>
              </div>
            </form>
            {message && <p style={{ color: 'red' }}>{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

//dump
let nextId = 0;

function Infos({ id, data, onChange, Supprimer }) {
  const [modification, setModification] = useState(false);
  const modifier = () => setModification(!modification);
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(id, { ...data, [name]: name === "note" ? parseFloat(value) || 0 : value });
  };
  return (
    <>
      <td class="p-3 px-5">
        <input
          list="matiere"
          type="text"
          name="matiere"
          value={data.matiere}
          onChange={handleChange}
          disabled={modification}
        />
        <datalist id="matiere">
          <option value="Maths" />
          <option value="Physique" />
        </datalist>
      </td>
      <td class="p-3 px-5">
        <input
            list="eleve"
            type="text"
            name="eleve"
            value={data.eleve}
            onChange={handleChange}
            disabled={modification}
          />
        <datalist id="eleve">
          <option value="GARNIER Mathis" />
          <option value="BENOIS Elian" />
        </datalist>
      </td>
      <td class="p-3 px-5">
        <input
          type="number"
          name="note"
          value={data.note}
          onChange={handleChange}
          disabled={modification}
          min="0" 
          max="20"
        />
      </td>
      <td class="p-3 px-5 flex justify-end">
        <button class="mr-3 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline" type="button" onClick={modifier}>{modification ? 'modifier' : 'enregistrer'}</button>
        <button class="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => Supprimer(id)}>Supprimer</button>
      </td>
    </>
  );
}

function Notes() {
  const [liste, setListe] = useState([]);
  const ajouterProduit = () => {
    const nouveauProduit = {
      id: nextId++,
      nom: '',
      prix: 0,
      quantite: 1,
    };
    setListe([...liste, nouveauProduit]);
  };
  const SupprimerProduit = (idASupprimer) => {
    setListe(liste.filter((produit) => produit.id !== idASupprimer));
  };
  const mettreAJourProduit = (id, nouvelleValeur) => {
    setListe(liste.map(p => (p.id === id ? nouvelleValeur : p)));
  };

  const soumission = async (e) => {
    /*e.preventDefault();
    const data = {
      liste: liste,
    };
    try {
    const reponse = await fetch('http://localhost/traitement.php', {
      mode: 'no-cors',
      method: "post",
      headers: {
           "Content-Type": "application/json"
      },
    body: JSON.stringify(data),
    });
    console.log(data);
    const result = await reponse.text();
    console.log('Réponse du serveur :', result);
    } catch (erreur) {
    console.error('Erreur lors de l\'envoi des données :', erreur);
    }*/
    };

  return (
    <>
        {liste.map((produit) => (
          <tr class="border-b hover:bg-orange-100 bg-gray-100" key={produit.id}>
            <Infos
              id={produit.id}
              data={produit}
              onChange={mettreAJourProduit}
              Supprimer={SupprimerProduit}
            />
          </tr>
        ))}
      <button onClick={ajouterProduit}>Ajouter une nouvelle note</button>
      <button onClick={soumission}>Envoyer</button>
    </>
  );
}

function App() {
  return (
    <Connexion />
  );
}

export default App;
