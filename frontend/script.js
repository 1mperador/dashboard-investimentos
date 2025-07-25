const API = "http://localhost:5000";

// Login
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const senha = document.getElementById("login-senha").value;

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha })
  });

  const data = await res.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } else {
    alert(data.error || "Erro no login");
  }
});

// Cadastro
document.getElementById("register-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("register-email").value;
  const senha = document.getElementById("register-senha").value;

  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha })
  });

  const data = await res.json();
  alert(data.message || data.error);
});

// Dashboard
async function carregarInvestimentos() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/investimentos`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  const lista = document.getElementById("lista-investimentos");
  lista.innerHTML = "";

  data.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.tipo} - R$${item.valor} (${item.descricao})`;
    const btn = document.createElement("button");
    btn.textContent = "Excluir";
    btn.onclick = () => deletarInvestimento(item._id);
    li.appendChild(btn);
    lista.appendChild(li);
  });
}

async function deletarInvestimento(id) {
  const token = localStorage.getItem("token");
  await fetch(`${API}/investimentos/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  carregarInvestimentos();
}

document.getElementById("investimento-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const tipo = document.getElementById("tipo").value;
  const valor = parseFloat(document.getElementById("valor").value);
  const descricao = document.getElementById("descricao").value;
  const token = localStorage.getItem("token");

  await fetch(`${API}/investimentos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ tipo, valor, descricao })
  });

  document.getElementById("investimento-form").reset();
  carregarInvestimentos();
});

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

if (window.location.pathname.includes("dashboard.html")) {
  carregarInvestimentos();
}

//  GRAFICO PIZZA
function renderizarGraficoAcoes(investimentos) {
    const acoes = investimentos.filter(inv => inv.tipo.toLowerCase().includes("acao") || inv.tipo.toUpperCase().endsWith("3"));

    if (acoes.length === 0) return;

    const tipos = acoes.map(a => a.tipo);
    const valores = acoes.map(a => a.valor);

    const ctx = document.getElementById("graficoAcoes").getContext("2d");

    fetch("http://localhost:5000/investimentos")
    .then(res => res.json())
    .then(data => {
        // lógica para exibir a lista...
        renderizarGraficoAcoes(data);
    });

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: tipos,
            datasets: [{
                label: 'Distribuição de Ações',
                data: valores,
                backgroundColor: [
                    '#0074D9', '#FF4136', '#2ECC40', '#FF851B',
                    '#7FDBFF', '#B10DC9', '#FFDC00', '#001f3f'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const lista = document.getElementById("lista-investimentos");
    const form = document.getElementById("investimento-form");
    const token = localStorage.getItem("token");

    async function carregarInvestimentos() {
        const resposta = await fetch("http://localhost:5000/investimentos", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const investimentos = await resposta.json();

        lista.innerHTML = "";
        investimentos.forEach(inv => {
            const li = document.createElement("li");
            li.textContent = `${inv.tipo}: R$${inv.valor} - ${inv.descricao}`;
            lista.appendChild(li);
        });

        desenharGrafico(investimentos);
    }

    async function desenharGrafico(investimentos) {
        const porTipo = {};
        investimentos.forEach(inv => {
            if (!porTipo[inv.tipo]) {
                porTipo[inv.tipo] = 0;
            }
            porTipo[inv.tipo] += inv.valor;
        });

        const tipos = Object.keys(porTipo);
        const valores = Object.values(porTipo);

        const ctx = document.getElementById("graficoAcoes").getContext("2d");
        new Chart(ctx, {
            type: "pie",
            data: {
                labels: tipos,
                datasets: [{
                    label: "Distribuição de Investimentos",
                    data: valores,
                    backgroundColor: [
                        "#007bff", "#28a745", "#ffc107", "#dc3545", "#6f42c1", "#20c997"
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const tipo = document.getElementById("tipo").value;
        const valor = document.getElementById("valor").value;
        const descricao = document.getElementById("descricao").value;

        await fetch("http://localhost:5000/investimentos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ tipo, valor, descricao }),
        });

        form.reset();
        carregarInvestimentos();
    });

    carregarInvestimentos();
});

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

const paginas = document.querySelectorAll(".pagina");

function navegar(id) {
    paginas.forEach(p => p.classList.remove("ativa"));
    document.getElementById(id).classList.add("ativa");

    if (id === 'noticias') {
        carregarNoticias();
    }
}

function carregarNoticias() {
    const noticias = [
        { titulo: "Selic permanece em 10,5%", resumo: "O Banco Central decidiu manter a taxa de juros básica da economia." },
        { titulo: "Ibovespa fecha em alta", resumo: "Principal índice da bolsa brasileira subiu 1,5% nesta sexta-feira." },
        { titulo: "Petrobras anuncia dividendos", resumo: "Estatal anuncia pagamento de dividendos no segundo semestre." }
    ];

    const lista = document.getElementById("lista-noticias");
    lista.innerHTML = "";
    noticias.forEach(n => {
        const div = document.createElement("div");
        div.innerHTML = `<h4>${n.titulo}</h4><p>${n.resumo}</p>`;
        lista.appendChild(div);
    });
}
