// Chave utilizada para salvar no localStorage do tablet
const STORAGE_KEY = 'adriano_apolinario_animais';

// Array principal de animais
let animaisCadastrados = [];
let alteracoesNaoSalvas = false;

// Inicializa o sistema carregando os dados salvos anteriormente
window.onload = function() {
    carregarDadosLocais();
};

// 1. CARREGAR DADOS DO LOCALSTORAGE
function carregarDadosLocais() {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY);
    if (dadosSalvos) {
        animaisCadastrados = JSON.parse(dadosSalvos);
        console.log("Dados carregados com sucesso:", animaisCadastrados.length, "animais encontrados.");
    }
}

// 2. FUNÇÃO PARA SALVAR ALTERAÇÕES (Botão do Topo)
function salvarAlteracoes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(animaisCadastrados));
    alteracoesNaoSalvas = false;
    alert("Alterações salvas com sucesso na memória do tablet!");
}

// Alerta ao tentar fechar a aba/aplicativo sem salvar
window.addEventListener('beforeunload', function (e) {
    if (alteracoesNaoSalvas) {
        e.preventDefault();
        e.returnValue = 'Você tem alterações não salvas. Deseja sair mesmo assim?';
    }
});

// 3. VALIDAÇÃO DE DUPLICIDADE PELO REGISTRO
function verificarRegistroDuplicado(registro) {
    const animalExistente = animaisCadastrados.find(a => a.registro === registro);
    if (animalExistente) {
        alert("Atenção: Este registro já está cadastrado! Os dados foram preenchidos automaticamente.");
        // Preenche automaticamente os campos caso já exista
        document.getElementById('regNome').value = animalExistente.nome;
        document.getElementById('regSexo').value = animalExistente.sexo;
        document.getElementById('regTipo').value = animalExistente.tipo;
        document.getElementById('regRaca').value = animalExistente.raca;
        document.getElementById('regVariacao').value = animalExistente.variacao;
        document.getElementById('regLactacao').value = animalExistente.lactacao || '';
        document.getElementById('regPremiacoes').value = animalExistente.premiacoes || '';
        document.getElementById('regObs').value = animalExistente.obs || '';
        
        controlarLactacao(animalExistente.sexo);
        return true;
    }
    return false;
}

// 4. CADASTRAR NOVO ANIMAL
function cadastrarAnimal(event) {
    event.preventDefault();

    const registro = document.getElementById('regRegistro').value.trim();
    const nome = document.getElementById('regNome').value.trim();
    const sexo = document.getElementById('regSexo').value;
    const tipo = document.getElementById('regTipo').value;
    const raca = document.getElementById('regRaca').value;
    const variacao = document.getElementById('regVariacao').value;
    const lactacao = document.getElementById('regLactacao').value;
    const premiacoes = document.getElementById('regPremiacoes').value;
    const obs = document.getElementById('regObs').value;

    // Verifica se já existe pelo registro
    const index = animaisCadastrados.findIndex(a => a.registro === registro);

    const novoAnimal = { registro, nome, sexo, tipo, raca, variacao, lactacao, premiacoes, obs };

    if (index >= 0) {
        // Atualiza animal existente
        animaisCadastrados[index] = novoAnimal;
        alert("Animal atualizado com sucesso!");
    } else {
        // Adiciona novo animal
        animaisCadastrados.push(novoAnimal);
        alert("Animal cadastrado com sucesso!");
    }

    alteracoesNaoSalvas = true; // Marca que há alterações pendentes para salvar
    closeModalCadastro();
    document.getElementById('formCadastro').reset();
}

// 5. CONTROLE CONDICIONAL DE LACTAÇÃO (Apenas para Fêmeas)
function controlarLactacao(sexo) {
    const grupoLactacao = document.getElementById('grupoLactacao');
    if (sexo === 'Femea') {
        grupoLactacao.style.display = 'flex';
    } else {
        grupoLactacao.style.display = 'none';
        document.getElementById('regLactacao').value = '';
    }
}

// 6. CONTROLE DO MODAL
function openModalCadastro() {
    document.getElementById('modalCadastro').style.display = 'flex';
}

function closeModalCadastro() {
    document.getElementById('modalCadastro').style.display = 'none';
}

// 7. DESTAQUE NA ÁRVORE GENEALÓGICA AO CLICAR
function destacarAnimal(elementoNode) {
    // Remove o destaque de todos os nós
    document.querySelectorAll('.node').forEach(n => n.classList.remove('highlighted'));
    // Adiciona o destaque no nó clicado
    elementoNode.classList.add('highlighted');
}

// 8. PESQUISA RÁPIDA DE ANIMAIS
function pesquisarAnimal() {
    const termo = document.getElementById('searchInput').value.toLowerCase();
    const nos = document.querySelectorAll('.node');

    nos.forEach(node => {
        const textoNode = node.innerText.toLowerCase();
        if (termo === '') {
            node.style.opacity = '1';
        } else if (textoNode.includes(termo)) {
            node.style.opacity = '1';
            node.classList.add('highlighted');
        } else {
            node.style.opacity = '0.3';
            node.classList.remove('highlighted');
        }
    });
}

// 9. ADICIONAR NOVO TIPO DE ANIMAL
function adicionarNovoTipo() {
    const novoTipo = prompt("Digite o novo tipo de animal (ex: Asininos, Búfalos, etc.):");
    if (novoTipo && novoTipo.trim() !== "") {
        const selectTipo = document.getElementById('regTipo');
        const opt = document.createElement('option');
        opt.value = novoTipo;
        opt.textContent = novoTipo;
        selectTipo.appendChild(opt);
        selectTipo.value = novoTipo;
        alert(`Tipo "${novoTipo}" adicionado com sucesso!`);
    }
}
