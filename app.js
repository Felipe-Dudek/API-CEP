//popup const
//const popupOverlay = document.getElementById('popupOverlay');
const popup = document.getElementById('popup');
const closePopup = document.getElementById('closePopup');
const emailInput = document.getElementById('emailInput');

//inputs const
const cepInput = document.getElementById("cep-resposta");
const estadoInput = document.getElementById("estado-resposta");
const cidadeInput = document.getElementById("cidade-resposta");
const bairroInput = document.getElementById("bairro-resposta");
const logradouroInput = document.getElementById("logradouro-resposta");
const complementoInput = document.getElementById("complemento-resposta");
const dddInput = document.getElementById("ddd-resposta");
const ibgeInput = document.getElementById("ibge-resposta");
const siafiInput = document.getElementById("siafi-resposta");
const giaInput = document.getElementById("gia-resposta");
const cep = document.getElementById("cep");

//buttons const
const salvarbutton = document.getElementById("salvar");

//table cosnt
const tablePrincipal = document.getElementById("table")

//json let
let jsonPesquisado = {};

function openPopup(){
    popupOverlay.style.display = 'block';
}

function closePopupFunc(){
    popupOverlay.style.display = 'none';
    limparConsulta();
}

closePopup.addEventListener('click', closePopupFunc);

/***popupOverlay.addEventListener('click', function (event) {
    if (event.target === popupOverlay) {
        closePopupFunc();
    }
});***/

function consultaCep() {
    const cep = document.querySelector('#cep').value 
    const retorno = document.querySelector('#retorno') 
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(resposta => resposta.json())
    .then(json => populaInput(json))
    .catch(function(error) {
        alert("Error", error);
    })
}

function limparConsulta(){
    cep.value = "";
    cepInput.value = "";
    estadoInput.value = "";
    cidadeInput.value = "";
    bairroInput.value = "";
    logradouroInput.value = "";
    complementoInput.value = "";
    dddInput.value = "";
    ibgeInput.value = "";
    siafiInput.value = "";
    giaInput.value = "";
    salvarbutton.disabled = true;
    jsonPesquisado = {};
}

function populaInput(json){
    if(json.cep === undefined){
        alert("O CEP não é válido");
        return;
    }
    cepInput.value = json.cep;
    estadoInput.value = json.uf;
    cidadeInput.value = json.localidade;
    bairroInput.value = json.bairro;
    logradouroInput.value = json.logradouro;
    complementoInput.value = json.complemento;
    dddInput.value = json.ddd;
    ibgeInput.value = json.ibge;
    siafiInput.value = json.siafi;
    giaInput.value = json.gia;
    salvarbutton.disabled = false;
    jsonPesquisado = json;
}

function recuperaDados(){
    const localStorage = window.localStorage;
    let ListaCEP = [];
    if (localStorage.getItem("cep-pesquisados") != null) {
        ListaCEP = JSON.parse(localStorage.getItem("cep-pesquisados"));
    }
    console.log(ListaCEP);
    return ListaCEP;
}

function criaLinhasTabela(){
    let dados = recuperaDados();
    tablePrincipal.innerHTML = `<tr>
                                    <th>CEP</th>
                                    <th>Estado</th>
                                    <th>Cidade</th>
                                    <th>Bairro</th>
                                    <th>Logradouro</th>
                                    <th>Complemento</th>
                                    <th>DDD</th>
                                    <th>IBGE</th>
                                    <th>Siafi</th>
                                    <th>Gia</th>
                                    <th>Excluir</th>
                                </tr>`
    dados.forEach(function(dado) {
        const novaLinha = document.createElement('tr');

        const cepDado = document.createElement('td');
        cepDado.innerText = dado.cep;
        novaLinha.appendChild(cepDado);

        const estadoDado = document.createElement('td');
        estadoDado.innerText = dado.uf;
        novaLinha.appendChild(estadoDado);

        const cidadeDado = document.createElement('td');
        cidadeDado.innerText = dado.localidade;
        novaLinha.appendChild(cidadeDado);

        const bairroDado = document.createElement('td');
        bairroDado.innerText = dado.bairro;
        novaLinha.appendChild(bairroDado);

        const logradouroDado = document.createElement('td');
        logradouroDado.innerText = dado.logradouro;
        novaLinha.appendChild(logradouroDado);

        const complementoDado = document.createElement('td');
        complementoDado.innerText = dado.complemento;
        novaLinha.appendChild(complementoDado);

        const dddDado = document.createElement('td');
        dddDado.innerText = dado.ddd;
        novaLinha.appendChild(dddDado);

        const ibgeDado = document.createElement('td');
        ibgeDado.innerText = dado.ibge;
        novaLinha.appendChild(ibgeDado);

        const siafiDado = document.createElement('td');
        siafiDado.innerText = dado.siafi;
        novaLinha.appendChild(siafiDado);

        const giaDado = document.createElement('td');
        giaDado.innerText = dado.gia;
        novaLinha.appendChild(giaDado);

        const deletarDado = document.createElement('td');
        deletarDado.innerHTML = `<a class='lixeira flex flex-center' onclick="excluirCEP('${dado.cep}')">🗑️</a>`;
        novaLinha.appendChild(deletarDado);

        tablePrincipal.appendChild(novaLinha);
    });
}

function excluirCEP(cepExcluir){
    console.log(cepExcluir);
    const localStorage = window.localStorage;
    let dadosLocalStorage = recuperaDados()
    if(confirm(`Você tem certeza que deseja excluir esse CEP ${cepExcluir}?`)){
        dadosLocalStorage.forEach((dados, index) => {
            if(dados.cep === cepExcluir){
                dadosLocalStorage.splice(index, 1)
                localStorage.setItem("cep-pesquisados", JSON.stringify(dadosLocalStorage));
                criaLinhasTabela();
                return;
            }
        });
    }
}

function salvarDadosLocalStorage(){
    let cepIgual = false;
    const localStorage = window.localStorage;
    let jsonAuxiliar = [];
    if (localStorage.getItem("cep-pesquisados") != null) {
        jsonAuxiliar = JSON.parse(localStorage.getItem("cep-pesquisados"));
        jsonAuxiliar.forEach(element => {
            if(element.cep === jsonPesquisado.cep){
                alert("Este CEP já está salvo em sua base de dados!!");
                cepIgual = true;
                return;
            }
        });
    }
    if(!cepIgual){
        jsonAuxiliar.push(jsonPesquisado);
        localStorage.setItem("cep-pesquisados", JSON.stringify(jsonAuxiliar));
        criaLinhasTabela();
        closePopupFunc();
    }
}

const inp = document.getElementById("cep");
inp.addEventListener("input", function(event) {
    //regex para verificar se a string dos inputs númericos estão recebendo só números decimais
    let regex = /^(\d+\.?\d*|\.\d+)$/;
    if (!regex.test(inp.value)) {
        inp.value = "";
    }
});

criaLinhasTabela();
