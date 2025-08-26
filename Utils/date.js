
/**
 * 
 * 
 * @returns dia, mes, ano, horas, minutos
 */
function Hoje() {

    const agora = new Date();
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = agora.getFullYear();

    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');

    return { dia, mes, ano, horas, minutos }
}


function formatDate(date) {
    const parter = date.split('-')
    return dataFormatada = `${parter[2]}/${parter[1]}/${parter[0]}`
}

module.exports = { Hoje, formatDate }
