import { useState, useEffect } from 'react';
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

  // Fonction pour mettre à jour une note côté serveur
  const enregistrerNote = async (idMatiere, idEleve, note) => {
    try {
      const res = await fetch("http://localhost/APIupdateNote.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_matiere: idMatiere, id_eleve: idEleve, note: note }),
      });
      const data = await res.json();
      if (!data.success) {
        console.error("Erreur serveur:", data.error);
      }
    } catch (err) {
      console.error("Erreur lors de l'enregistrement:", err);
    }
  };

  // Gérer la modification locale des notes
  const handleModificationNote = (idMatiere, idEleve, nouvelleNote) => {
    const updatedResults = resultats.map((note) => {
      if (note.id_matiere === idMatiere && note.id_eleve === idEleve) {
        return { ...note, note: nouvelleNote };
      }
      return note;
    });
    setResultats(updatedResults);
  };

  if (estConnecte) {
    return (
      <div>
        <table>
          <caption>Récapitulatif</caption>

          {/* Élève */}
          {resultats.some(r => r.job === "eleve") && (
            <>
              <thead>
                <tr>
                  <th scope="col">Matières</th>
                  <th scope="col">Notes</th>
                </tr>
              </thead>
              <tbody>
                {resultats.map((note, index) => (
                  <tr key={index}>
                    <th scope="row">{note.nom_matiere}</th>
                    <td>{note.note}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">Moyenne</th>
                  <td>{moyenne}</td>
                </tr>
              </tfoot>
            </>
          )}

          {/* Professeur */}
          {resultats.some(r => r.job === "prof") && (
            <>
              <thead>
                <tr>
                  <th scope="col">Matière</th>
                  <th scope="col">Nom</th>
                  <th scope="col">Note</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {resultats.map((note, index) => (
                  <LigneNoteProf
                    key={index}
                    noteData={note}
                    onUpdate={(newNote) => {
                      handleModificationNote(note.id_matiere, note.id_eleve, newNote);
                      enregistrerNote(note.id_matiere, note.id_eleve, newNote);
                    }}
                  />
                ))}
              </tbody>
            </>
          )}
        </table>
      </div>
    );
  }

  // Formulaire de connexion
  return (
    <div>
      <h3 style={{ textAlign: "center" }}>Connexion</h3>
      <form onSubmit={handleConnexion}>
        <div>
          <label htmlFor="identifiant">Identifiant</label><br />
          <input
            type="text"
            id="identifiant"
            value={identifiant}
            onChange={(e) => setIdentifiant(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label htmlFor="pass">Mot de passe</label><br />
          <input
            type="password"
            id="pass"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            minLength="8"
            required
          />
        </div>
        <br />
        <input type="submit" value="Se connecter" />
      </form>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
}

function LigneNoteProf({ noteData, onUpdate }) {
  const [modification, setModification] = useState(true);
  const [note, setNote] = useState(noteData.note);

  const handleToggle = () => {
    if (!modification) {
      onUpdate(note);
    }
    setModification(!modification);
  };

  return (
    <tr>
      <td>{noteData.nom_matiere}</td>
      <td>{noteData.utilisateur_nom} {noteData.utilisateur_prenom}</td>
      <td>
        <input
          type="number"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={modification}
          style={{ width: "60px" }}
        />
      </td>
      <td>
        <button onClick={handleToggle}>
          {modification ? "Modifier" : "Enregistrer"}
        </button>
      </td>
    </tr>
  );
}

function App() {
  return (
    <div>
      <div className="ENSC-image"></div>
      <div className="container">
        <div className='connexion'>
          <Connexion />
        </div>
      </div>
    </div>
  );
}

export default App;
