import { Negociacoes, Negociacao} from '../domain';
import { NegociacoesView, MensagemView, Mensagem, DateConverter }  from '../ui';
import { getNegociacaoDao, Bind, getExceptionMessage, debounce, controller, bindEvent }  from '../util';

@controller('#data', '#quantidade', '#valor')
export class NegociacaoController {
    constructor(inputData, inputQuantidade, inputValor) {
        
        this._inputData = inputData;
        this._inputQuantidade = inputQuantidade;
        this._inputValor = inputValor;
        
        // guardando uma referência 
        // para a instância de NegociacaoController
        //const self = this;
                                
        // agora é um proxy!
        /*this._negociacoes = new Proxy(new Negociacoes(), {
            get(target, prop, receiver) {
                if(typeof(target[prop]) == typeof(Function) && ['adiciona', 'esvazia'].includes(prop)) {
                    return function() {
                        console.log(`"${prop}" disparou a armadilha`);
                        target[prop].apply(target, arguments);
                        
                        // AGORA USA SELF!
                        self._negociacoesView.update(target);
                    }
                } else {
                    return target[prop];
                }
            }
        });*/

        this._negociacoes = new Bind(
            new Negociacoes(),
            new NegociacoesView('#negociacoes'),
            'adiciona', 'esvazia');

        this._mensagem = new Bind(
            new Mensagem(),
            new MensagemView('#mensagemView'),
            'texto');

        this._init();
    }

    async _init() {
        
        try {
            const dao = await getNegociacaoDao();
            const negociacoes = await dao.listaTodos();
                
            negociacoes.forEach(negociacao =>
                this._negociacoes.adiciona(negociacao));

        } catch (err) {

            this._mensagem.texto = getExceptionMessage(err);
        }
    }

    @bindEvent('submit', '.form')
    @debounce()
    async adiciona(event) {

        try {
            const negociacao = this._criaNegociacao()
            const dao = await getNegociacaoDao();
            await dao.adiciona(negociacao);

            this._negociacoes.adiciona(negociacao);

            this._mensagem.texto = 'Negociação adicionada com sucesso';

            this._limpaFormulario();
        
        } catch(err) {

            this._mensagem.texto = getExceptionMessage(err);
        }
    }

    _limpaFormulario() {
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0
        this._inputData.focus();
    }

    _criaNegociacao() {
        // retorna uma instância de negociação
        return new Negociacao(
            DateConverter.paraData(this._inputData.value),
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value)
        );        
    }

    @bindEvent('click', '#botao-importa')
    @debounce(1500)
    async importaNegociacoes() {
        /*const negociacoes = [];

        this._service.obterNegociacoesDaSemana()
            .then(semana => {
                negociacoes.push(...semana);

                return this._service.obterNegociacoesDaSemanaAnterior();
            })
            .then(anterior => {
                negociacoes.push(...anterior);

                return this._service.obterNegociacoesDaSemanaRetrasada();
            })
            .then(retrasada => {
                negociacoes.push(...retrasada);

                negociacoes.forEach(negociacao => this._negociacoes.adiciona(negociacao));
                
                this._mensagem.texto = 'Negociações importadas com sucesso';
            })
            .catch(err => this._mensagem.texto = err);*/

        try {

            const { NegociacaoService } = await import('../domain/negociacao/NegociacaoService');

            const service = new NegociacaoService();

            const negociacoes = await service.obterNegociacoesDoPeriodo()
                
            negociacoes
                .filter(novaNegociacao =>
                    !this._negociacoes.paraArray().some(negociacaoExistente =>
                        novaNegociacao.equals(negociacaoExistente)))
                
                .forEach(negociacao => this._negociacoes.adiciona(negociacao));
            
            this._mensagem.texto = 'Negociações importadas com sucesso';
        
        } catch(err) {

            this._mensagem.texto = getExceptionMessage(err);
        }
    }

    @bindEvent('click', '#botao-apaga')
    async apaga() {

        try {
            const dao = await getNegociacaoDao();

            await dao.apagaTodos();

            this._negociacoes.esvazia();
            this._mensagem.texto = 'Negociações apagadas com sucesso';
        
        } catch(err) {

            this._mensagem.texto = getExceptionMessage(err);
        }
    }
}