import { useState, useRef, useEffect } from 'react';
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
      const response = await fetch(`https://ebenois.zzz.bordeaux-inp.fr/APItraitementnote.php?identifiant=${encodeURIComponent(identifiant)}&motDePasse=${encodeURIComponent(motDePasse)}`);
      const dataRaw = await response.json();

      if (dataRaw.length > 0) {
        const data = dataRaw.map(({ utilisateur_nom, utilisateur_prenom, ...rest }) => ({
          ...rest,
          nom_eleve: `${utilisateur_nom || ''} ${utilisateur_prenom || ''}`.trim()
        }));
        setResultats(data);
        setMessage('');
        setEstConnecte(true);
        console.log(data)

        const notes = data.filter(d => d.job === "eleve");
        const total = notes.reduce((acc, curr) => acc + parseFloat(curr.note), 0);
        setMoyenne((total / notes.length).toFixed(2));
      } else {
        setMessage("Identifiant ou mot de passe incorrect.");
      }
    } catch (error) {
      setMessage("Erreur lors de la connexion.");
    }
  };

  if (estConnecte) {
    const estProf = resultats.some(r => r.job === "prof");

    return (
      <div className="text-gray-900 bg-gray-200">
        <div className="p-4 flex">
          <h1 className="text-3xl">Récapitulatif</h1>
        </div>
        <div className="px-3 py-4">
          {!estProf && (
            <table className="w-full text-md bg-white shadow-md rounded mb-4">
              <tbody>
                <tr className="border-b">
                  <th className="text-left p-3 px-5">Matières</th>
                  <th className="text-left p-3 px-5">Notes</th>
                </tr>
                {resultats.map((note, index) => (
                  <tr className="border-b hover:bg-orange-100 bg-gray-100" key={index}>
                    <td className="p-3 px-5">{note.nom_matiere}</td>
                    <td className="p-3 px-5">{note.note}</td>
                  </tr>
                ))}
                <tr className="border-b hover:bg-orange-100 bg-gray-100">
                  <td className="p-3 px-5"><b>Moyenne</b></td>
                  <td className="p-3 px-5"><b>{moyenne}</b></td>
                </tr>
              </tbody>
            </table>
          )}
          {estProf && <Recapitulatif notesInitiales={resultats.filter(r => r.job === "prof")} />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Connexion</h1>
            </div>
            <form onSubmit={handleConnexion} className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <input onChange={(e) => setIdentifiant(e.target.value)} required value={identifiant} autoComplete="off" id="identifiant" name="identifiant" type="text" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none" placeholder="identifiant" />
                  <label htmlFor="identifiant" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Identifiant</label>
                </div>
                <div className="relative">
                  <input onChange={(e) => setMotDePasse(e.target.value)} minLength="8" required value={motDePasse} autoComplete="off" id="pass" name="pass" type="password" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none" placeholder="pass" />
                  <label htmlFor="pass" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Mot de passe</label>
                </div>
                <div className="relative">
                  <input type="submit" value="Se connecter" className="bg-blue-500 text-white rounded-md px-2 py-1" />
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

function Recapitulatif({ notesInitiales }) {
  const [recap, setRecap] = useState([]);
  const nextId = useRef(0);
  const profId = notesInitiales[0]?.utilisateur_id || 0;

  useEffect(() => {
    const notesAvecIds = notesInitiales.map(note => ({
      ...note,
      id: note.id || `${note.utilisateur_id}${nextId.current++}`,  // Combine utilisateur_id du prof avec nextId
    }));
    setRecap(notesAvecIds);
  }, [notesInitiales]);

  const ajouterNote = () => {
    const nouvelleNote = {
      id: `${profId}${nextId.current++}`,  // Convertir profId en chaîne
      nom_matiere: '',
      nom_eleve: '',
      note: 0,
      utilisateur_id: profId,
    };
    setRecap([...recap, nouvelleNote]);
    console.log(nouvelleNote)
  };

  const SupprimerNote = async (idASupprimer) => {
      setRecap(recap.filter((note) => note.id !== idASupprimer));
  }
  
  const mettreAJourNote = (id, nouvelleValeur) => {
    setRecap(recap.map(p => (p.id === id ? nouvelleValeur : p)));  // Mise à jour de l'état des notes
  };

  const soumission = async () => {
    const notesFormatees = recap.map(note => ({
      nom_matiere: note.nom_matiere,
      nom_eleve: note.nom_eleve,
      note: note.note,
      utilisateur_id: note.utilisateur_id
    }));
  
    const profId = recap[0]?.utilisateur_id;
    
    try {
      // 1. Supprimer toutes les notes existantes du professeur
      const suppression = await fetch('https://ebenois.zzz.bordeaux-inp.fr/APIenregistrementnote.php', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ supprimer_toutes_notes_prof: profId }),
      });
  
      const supprResult = await suppression.text();
      console.log('Résultat de la suppression :', supprResult);
  
      // 2. Insérer les nouvelles notes
      const reponse = await fetch('https://ebenois.zzz.bordeaux-inp.fr/APIenregistrementnote.php', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ notes: notesFormatees }),
      });
  
      const result = await reponse.text();
      console.log('Réponse du serveur :', result);
      alert('Notes envoyées avec succès !');
    } catch (erreur) {
      console.error('Erreur lors de l\'envoi des données :', erreur);
      alert('Erreur lors de l\'envoi des données');
    }
  };  

  return (
    <>
      <table className="w-full text-md bg-white shadow-md rounded mb-4">
        <tbody>
          <tr className="border-b">
            <th className="text-left p-3 px-5">Matières</th>
            <th className="text-left p-3 px-5">Nom</th>
            <th className="text-left p-3 px-5">Notes</th>
            <th></th>
          </tr>
          {recap.map((note) => (
            <tr className="border-b hover:bg-orange-100 bg-gray-100" key={note.id}>
              <Note
                id={note.id}
                data={note}
                onChange={mettreAJourNote}
                Supprimer={SupprimerNote}
              />
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex">
        <button className="mr-3 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded" type="button" onClick={ajouterNote}>Ajouter une nouvelle note</button>
        <button className={`mr-3 text-sm bg-green-600 hover:bg-green-800 text-white py-1 px-2 rounded`}
          type="button"
          onClick={soumission}
        >Envoyer les modifications</button>
      </div>
    </>
  );
}

function Note({ id, data, onChange, Supprimer }) {
  const [matieres, setMatieres] = useState([]); // Liste des matières
  const [eleves, setEleves] = useState([]); // Liste des élèves

  // Récupérer les matières et les élèves depuis l'API
  useEffect(() => {
    fetch('https://ebenois.zzz.bordeaux-inp.fr/APIrecuperationListes.php')
      .then(res => res.json())
      .then(data => {
        setMatieres(data.matieres || []);
        setEleves(data.eleves || []);
      })
      .catch(err => console.error("Erreur récupération des listes :", err));
  }, []);

  // Gérer les changements des champs et mettre à jour l'état dans le parent
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...data, [name]: value };

    // Validation pour la note
    if (name === 'note') {
      // Assurer que la note est entre 0 et 20
      if (value < 0 || value > 20) return;
    }

    onChange(id, updatedData);  // Envoie les nouvelles données au parent pour mise à jour de l'état
  };

  // Gérer l'événement où l'utilisateur essaie d'écrire dans un champ ayant une datalist
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Si la valeur ne correspond à aucune option dans la datalist, réinitialiser la valeur
    const options = name === 'nom_matiere' ? matieres : eleves;
    if (!options.includes(value)) {
      e.target.setCustomValidity("Veuillez choisir une option dans la liste.");
    } else {
      e.target.setCustomValidity("");
    }

    handleChange(e);
  };

  return (
    <>
      <td className="p-3 px-5">
        <input
          list="matiere"
          type="text"
          name="nom_matiere"
          value={data.nom_matiere || ''}  // Assurez-vous que la valeur est bien une chaîne vide si undefined
          onChange={handleInputChange}
          required
        />
        <datalist id="matiere">
          {matieres.map((matiere, index) => (
            <option key={index} value={matiere} />
          ))}
        </datalist>
      </td>
      <td className="p-3 px-5">
        <input
          list="eleve"
          type="text"
          name="nom_eleve"
          value={data.nom_eleve || ''}  // Valeur par défaut vide
          onChange={handleInputChange}
          required
        />
        <datalist id="eleve">
          {eleves.map((eleve, index) => (
            <option key={index} value={eleve} />
          ))}
        </datalist>
      </td>
      <td className="p-3 px-5">
        <input
          type="number"
          name="note"
          value={data.note || ''}  // Assurez-vous que la valeur est bien une chaîne vide si undefined
          onChange={handleChange}
          min="0"
          max="20"
          required
        />
      </td>
      <td className="p-3 px-5 flex justify-end">
        <button className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded" type="button" onClick={() => Supprimer(id)}>Supprimer la note</button>
      </td>
    </>
  );
}


function App() {
  return <Connexion />;
}

export default App;
