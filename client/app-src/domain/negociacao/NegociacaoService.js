import { HttpService } from '../../util/HttpService.js';
import { Negociacao }  from './Negociacao.js';
import { ApplicationException } from '../../util/ApplicationException.js';

export class NegociacaoService {
    constructor() {
        this._http = new HttpService();
    }

    obterNegociacoesDaSemana() {
        return this._http.get(`${SERVICE_URL}/negociacoes/semana`)
            .then(
                dados => {
                    const negociacoes = dados.map(objeto => 
                        new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));

                    return negociacoes;
                },
                err => {
                    throw new ApplicationException('Não foi possível obter nas negociações da semana');
                }
            );
    }

    obterNegociacoesDaSemanaAnterior() {
        return this._http.get(`${SERVICE_URL}/negociacoes/anterior`)
            .then(
                dados => {
                    const negociacoes = dados.map(objeto => 
                        new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));

                    return negociacoes;
                },
                err => {
                    throw new ApplicationException('Não foi possível obter nas negociações da semana anterior');
                }
            );
    }

    obterNegociacoesDaSemanaRetrasada() {
        return this._http.get(`${SERVICE_URL}/negociacoes/retrasada`)
            .then(
                dados => {
                    const negociacoes = dados.map(objeto => 
                        new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));

                    return negociacoes;
                },
                err => {
                    throw new ApplicationException('Não foi possível obter nas negociações da semana retrasada');
                }
            );
    }

    async obterNegociacoesDoPeriodo() {
        return await Promise.all([
            this.obterNegociacoesDaSemana(),
            this.obterNegociacoesDaSemanaAnterior(),
            this.obterNegociacoesDaSemanaRetrasada()
        ])
        .then(periodo => periodo
                            .reduce((novoArray, item) => novoArray.concat(item), [])
                            .sort((a, b) => b.data.getTime() - a.data.getTime())
        )
        .catch(err => {
            console.log(err);
            throw new ApplicationException('Não foi possível obter as negociações do período');
        });
    }
}