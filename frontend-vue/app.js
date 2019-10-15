const vm = new Vue({
    el: "#app",
    data: {
        produtos: [],
        produto: false,
        carrinho: [],
        mensagemAlerta: "Item adicionado!",
        alertaAtivo: false,
        carrinhoAtivo: false
    },
    methods: {
        fetchProdutos() {
            fetch("./api/produtos.json")
                .then(response => response.json())
                .then(response => {
                    this.produtos = response;
                })
        },
        fetchProduto(id) {
            fetch(`./api/produtos/${id}/dados.json`)
                .then(response => response.json())
                .then(response => {
                    this.produto = response;
                });
        },
        fecharModal(event) {
            if (event.target === event.currentTarget) {
                this.produto = false;
            }
        },
        abrirModal(id) {
            this.fetchProduto(id);

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        },
        adicionarItem() {
            this.produto.estoque--;
            this.carrinho.push(this.produto);

            this.alerta(`${this.produto.nome} adicionado ao carrinho`);
        },
        removerItem(index) {
            this.carrinho.splice(index, 1);
        },
        salvarCarrinho() {
            localStorage.setItem('carrinho', JSON.stringify(this.carrinho));
        },
        checarLocalStorage() {
            if (localStorage.carrinho) {
                this.carrinho = JSON.parse(localStorage.carrinho);
            }
        },
        alerta(mensagem) {
            this.mensagemAlerta = mensagem;
            this.alertaAtivo = true;

            setTimeout(() => {
                this.alertaAtivo = false;
            }, 1000);
        },
        handleRoutes() {
            document.title = this.produto.nome || "Techno";
            const hash = this.produto.id || "";
            history.pushState(null, null, `#${hash}`);
        },
        verifyRouter() {
            const hash = document.location.hash;
            if (hash) {
                this.fetchProduto(hash.replace('#', ''));
            }
        },
        clickForaCarrinho(event) {
            if (event.target === event.currentTarget) {
                this.carrinhoAtivo = false;
            }
        },
        compararEstoque() {
            const itens = this.carrinho.filter((item) => {
                if (item.id === this.produto.id) {
                    return true;
                }
            });

            this.produto.estoque -= itens.length;
        }
    },
    filters: {
        toPrice(value) {
            return value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });
        }
    },
    computed: {
        carrinhoTotal() {
            let total = 0;
            if (this.carrinho.length > 0) {
                this.carrinho.forEach((item) => {
                    total += item.preco;
                });
            }
            return total;
        }
    },
    watch: {
        carrinho() {
            this.salvarCarrinho();
        },
        produto() {
            this.handleRoutes();

            if (this.produto) {
                this.compararEstoque();
            }
        }
    },
    created() {
        this.fetchProdutos();
        this.verifyRouter();
        this.checarLocalStorage();
    }
})