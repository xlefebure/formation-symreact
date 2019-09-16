import React, {useContext, useState} from 'react';
import AuthAPI from "../services/AuthAPI";
import AuthContext from "../contexts/AuthContext";

const LoginPage = ({history}) => {

    const {setIsAuthenticated} = useContext(AuthContext);

    const [credentials, setCredentiales] = useState({
       username: "test@sym.com",
       password: "password"
    });

    const [error, setError] = useState("");

    /**
     * Gestion des champs
     *
     * @param currentTarget
     */
    const handleChange = ({currentTarget}) => {
      const {value, name} = currentTarget;

      setCredentiales({...credentials, [name]: value});
    };

    /**
     * Gestion submit
     *
     * @param event
     * @returns {Promise<void>}
     */
    const handleSubmit = async (event) => {
      event.preventDefault();

      try {
        await AuthAPI.authenticate(credentials);
        setError("");
        setIsAuthenticated(true);
        history.replace("/customers");
      } catch (error) {
          setError("Aucun compte ne possède cette adresse email ou les informations ne correspondent pas");
      }
    };

    return (
        <>
            <h1>Connexion à l'application</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Adresse email</label>
                    <input
                        value={credentials.username}
                        onChange={handleChange}
                        type="email"
                        placeholder="Adresse email de connexion"
                        name="username"
                        id="username"
                        className={"form-control" + (error && " is-invalid")}
                    />
                    { error && <p className="invalid-feedback">{error}</p> }
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        value={credentials.password}
                        onChange={handleChange}
                        type="password"
                        placeholder="Mot de passe"
                        name="password"
                        id="password"
                        className="form-control"
                        />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Je me connecte</button>
                </div>
            </form>
        </>
    );
};

export default LoginPage ;