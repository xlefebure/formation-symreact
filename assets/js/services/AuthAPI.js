import axios from "axios";
import jwtDecode from "jwt-decode";
import {LOGIN_API} from "../config";

/**
 * Déconnexion (suppression du token du localStorage & Axios
 */
function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

/**
 * Requête HTTP d'authentification et stockage du token dans le storage & Axios
 *
 * @param credentials
 * @returns {Promise<boolean | never>}
 */
function authenticate(credentials) {
    return axios
        .post(LOGIN_API, credentials)
        .then(response => response.data.token)
        .then(token => {
            // Je stocke le token dans mon localStorage
            window.localStorage.setItem("authToken", token);
            // On prévient axios qu'on a maintenant un header par défaut sur toutes nos futures requetes HTTP
            setAxiosToken(token);

            return true;
        });
}

/**
 * Positionne le token JWT dans Axios
 *
 * @param token
 */
function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Mise en place lors du chargement de l'application
 */
function setup() {
    const token = window.localStorage.getItem("authToken");
    if (token) {
        const {exp: expiration} = jwtDecode(token);

        if (expiration * 1000 > new Date().getTime()) {
            setAxiosToken(token);
        }
    }
}

/**
 * Permet de savoir si on est authentifié ou pas
 *
 * @returns {boolean}
 */
function isAuthenticated() {
    const token = window.localStorage.getItem("authToken");
    if (token) {
        const {exp: expiration} = jwtDecode(token);

        if (expiration * 1000 > new Date().getTime()) {
            return true;
        }
    }
    return false;
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
};