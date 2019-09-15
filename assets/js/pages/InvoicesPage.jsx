import React, { useEffect, useState } from 'react';
import Pagination from "../components/Pagination";
import moment from "moment"
import InvoicesAPI from "../services/InvoicesAPI";

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
};

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
};

const InvoicesPage = (props) => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const itemsPerPage = 10;

    /**
     * Permet d'aller récupérer les invoices
     *
     * @returns {Promise<void>}
     */
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesAPI.findAll();
            setInvoices(data);
        } catch (error) {
            console.log(error.response)
        }
    };

    /**
     * Au chargement du composant, on va chercher les composents
     */
    useEffect(() => {
        fetchInvoices()
    }, []);

    /**
     * Gestion du changement de page
     *
     * @param page
     */
    const handlePageChange = (page) => setCurrentPage(page);

    /**
     * Gestion de la recherche
     *
     * @param event
     */
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget);
        setCurrentPage(1);
    };

    /**
     * Gestion de la suppression d'une invoice
     *
     * @param id
     * @returns {Promise<void>}
     */
    const handleDelete =  async (id) => {

        const originalInvoices = [...invoices];

        setInvoices(invoices.filter(customer => customer.id !== id));

        try {
            await InvoicesAPI.delete(id);
        } catch (error) {
            setInvoices(originalInvoices);
            console.log(error.response);
        }
    };

    /**
     * Gestion du format de date
     *
     * @param str
     * @returns {string}
     */
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    /**
     * Filtrage des invoices en fonction de la recherche
     */
    const filteredInvoices = invoices.filter(i =>
        i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
        i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
        i.amount.toString().toLowerCase().startsWith(search.toLowerCase()) ||
        STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    );

    /**
     * Pagination des données
     */
    const paginatedInvoices = Pagination.getData(filteredInvoices, currentPage, itemsPerPage);

    return (
        <>
            <h1>Liste des factures</h1>

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher ..."/>
            </div>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Numéro</th>
                    <th>Client</th>
                    <th className="text-center">Date d'envoi</th>
                    <th className="text-center">Statut</th>
                    <th className="text-center">Montant</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {paginatedInvoices.map(invoice =>
                    <tr key={invoice.id}>
                        <td>{invoice.chrono}</td>
                        <td><a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a></td>
                        <td className="text-center">{formatDate(invoice.sentAt)}</td>
                        <td className="text-center">
                            <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                        </td>
                        <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                        <td>
                            <button className="btn btn-sm btn-primary mr-1">Éditer</button>
                            <button onClick={() => handleDelete(invoice.id)} className="btn btn-sm btn-danger">Supprimer</button>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChanged={handlePageChange} length={filteredInvoices.length} />
        </>
    );
};

export default InvoicesPage ;