import axios from "axios";

function findAll() {
    return axios
        .get("http://127.0.0.1:8000/api/invoices")
        .then(response => response.data['hydra:member'])
}

function find(id) {
    return axios
        .get("http://127.0.0.1:8000/api/invoices/" + id)
        .then(response => response.data);
}

function update(id, invoice) {
    return axios.put("http://127.0.0.1:8000/api/invoices/" + id, {...invoice, customer: `/api/customers/${invoice.customer}`});
}

function create(invoice) {
    return axios.post("http://127.0.0.1:8000/api/invoices", {...invoice, customer: `/api/customers/${invoice.customer}`});
}

function deleteInvoice(id) {
    axios
        .delete("http://127.0.0.1:8000/api/invoices/" + id)
}

export default {
    findAll,
    delete: deleteInvoice,
    find,
    update,
    create
};