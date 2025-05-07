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
    console.log(resultats);
    return (
      <div>
        <table>
          <caption>
            Récapitulatif
          </caption>
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
          {resultats.some(r => r.job === "prof") && (
            <>
              <thead>
                <tr>
                  <th scope="col">Matières</th>
                  <th scope="col">Nom</th>
                  <th scope="col">Notes</th>
                </tr>
              </thead>
              <tbody>
              {resultats.map((note, index) => (
                <tr key={index}>
                  <th scope="row">{note.nom_matiere}</th>
                  <td>{note.utilisateur_nom} {note.utilisateur_prenom}</td>
                  <td>{note.note}</td>
                </tr>
              ))}
              <tr>
                <th scope="row">
                  <input list="matieres" type="text" required/>
                  <datalist id="matieres">
                    <option value="Maths" />
                    <option value="Physique" />
                  </datalist>
                </th>
                <td>
                <input list="nom" type="text" required/>
                  <datalist id="nom">
                    <option value="GARNIER Mathis" />
                    <option value="BENOIS Elian" />
                  </datalist>
                </td>
                <td>
                  <input type="number" min="0" max="20" required/>
                </td>
              </tr>
              </tbody>
            </>
          )}
        </table>
      </div>
    );
  }

  // Sinon, afficher le formulaire
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
