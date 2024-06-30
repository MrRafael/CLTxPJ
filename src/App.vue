<script setup lang="ts">
import { ref } from 'vue'
import CurrencyInput from '@/components/CurrencyInput.vue';
import { calcCLT, calcPjFatorR, calcPj } from '@/calc'
import { type ResultadoCLT, type ResultadoPJFatorR, type ResultadoPJ } from '@/types'

const salarioCLT = ref(0)
const salarioPJ = ref(0)
const planoSaude = ref(0)
const gastoContador = ref(0)
const dependentes = ref(0)
const vaVr = ref(0)
const plr = ref(0)
const outro = ref(0)

const resultCLT = ref<ResultadoCLT | {}>({});
const resultPJFatorR = ref<ResultadoPJFatorR | {}>({});
const resultPJ = ref<ResultadoPJ | {}>({});

const handleClac = () => {
  resultCLT.value = calcCLT(salarioCLT.value, dependentes.value, vaVr.value, planoSaude.value, plr.value, outro.value);
  resultPJFatorR.value = calcPjFatorR(salarioPJ.value, dependentes.value, gastoContador.value,);
  resultPJ.value = calcPj(salarioPJ.value, gastoContador.value,);
}

</script>

<template>
  <div class="container">
    <section class="hero is-link">
      <div class="hero-body">
        <p class="title">CLT x PJ</p>
        <p class="subtitle">Desenvolvedores de Software</p>
      </div>
    </section>

    <div class="box">
      <div class="columns">
        <div class="column is-one-third">
          <p>
            Por lei um programador não pode ser MEI, então o mesmo teria que optar por ser ME e utilizar o <a
              href="https://www.gov.br/pt-br/servicos/optar-pelo-simples-nacional" target="_blank">Simples nacional</a>
            como forma de tributação. Dentro do sistema Simples nacional existem 5 anexos/tabelas de alíquotas, cada uma
            delas destinada para um segmento de atuação, programadores se enquadram no Anexo V, porém ao utilizarem o
            <a href="https://www.jusbrasil.com.br/artigos/simples-nacional-tudo-que-voce-precisa-saber-sobre-o-fator-r/1301188234"
              target="_blank">Fator R</a>, podem se enquadrar no Anexo III onde as taxas são menores. Essa calculadora
            é destinada para
            profissionais de TI mas se encaixa para todos profissionais que se enquadram no Anexo V.
            <br>
            Observações:
            <br>
            <span class="is-size-7">
              - Em alguns cenários um benefício pode ser encarado como gasto ou desnecessário, Ex: Plano de saúde para
              um
              recém formado, indivíduo muito novo, saúde de ferro, praticamente não usa o plano e caso não tivesse não
              contrataria por conta, nesse cenário para esse indivíduo, o que é priorizado seria o valor líquido que
              entra
              todo mês, então para comparação mais apropriada nesse cenário, utilize o "salário líquido" no lugar de
              "salário líquido + benefícios" da sessão CLT e, some o que achar mais apropriado como FGTS.
            </span>
          </p>
        </div>
        <div class="column">
          <div class="columns">
            <div class="column">
              <currency-input v-model="salarioCLT" label="Salário CLT" />
              <currency-input v-model="vaVr" label="VA + VR" />
              <currency-input v-model="planoSaude" label="Plano de Saúde"
                infoText="Preencha o plano de saúde da seguinte forma: caso fosse contratar um plano de saúde similar ao que possui, quanto gastaria? algum valor é descontado para o plano de saúde? deduza do valor informado. Ex: Para contratar meu plano atual pagaria 800 reais, porém tenho desconto em folha de 250 reais, informe 800 - 250 = 550" />
              <currency-input v-model="plr" label="PLR" />
              <currency-input v-model="outro" label="Outros benefícios"
                infoText="Utilize o campo outros para incluir plano de auxílio a medicamentos, bônus que não seja PLR ou coisas do tipo, esse campo será somado integralmente ao valor mensal. Diferente do campo de PLR, este sendo valor anual passará por desconto IRRF e será dividido por 12." />
              <div class="field">
                <label class="label">Dependentes</label>
                <div class="control">
                  <input class="input" type="number" placeholder="Dependentes" v-model="dependentes" />
                </div>
              </div>
            </div>
            <div class="column">
              <currency-input v-model="salarioPJ" label="Salário PJ" />
              <currency-input v-model="gastoContador" label="Gasto com contador" />
            </div>
          </div>
        </div>
      </div>
      <div class="is-flex is-justify-content-center">
        <button class="button is-link" @click="handleClac">Calcular</button>
      </div>
      <div class="columns mt-1">
        <div class="column">
          <div class="content" v-if="(resultCLT as ResultadoCLT).salLiqBeneficios">
            <h3>Valor líquido entregue CLT</h3>
            <p class="is-size-3">{{ (resultCLT as ResultadoCLT).salLiqBeneficios?.toLocaleString('pt-BR', {
                style: 'currency', currency:
                  'BRL'
              }) }}</p>
            <span class="is-flex is-flex-direction-column">
              <span>
                <b>Salário Bruto: </b> {{ (resultCLT as ResultadoCLT).salarioBruto?.toLocaleString('pt-BR', {
                style:
                  'currency', currency: 'BRL'
              }) }}
              </span>
              <span>
                <b>INSS: </b> - {{ (resultCLT as ResultadoCLT)?.inss?.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }) }}
              </span>
              <span>
                <b>IRRF: </b> - {{ (resultCLT as ResultadoCLT)?.irrf?.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }) }}
              </span>
              <span>
                <b>Salário Líquido: </b> {{ (resultCLT as ResultadoCLT).salarioLiquido?.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }) }}
              </span>
              <span>
                <b>FGTS: </b> {{ (resultCLT as ResultadoCLT).fgts?.toLocaleString('pt-BR', {
                style: 'currency', currency:
                  'BRL'
              }) }}
              </span>
              <span>
                <b>Décimo Terceiro p/ mês: </b> {{ (resultCLT as
                ResultadoCLT).decimoTerceiroMes?.toLocaleString('pt-BR',
                  {
                    style:
                      'currency', currency: 'BRL'
                  }) }}
              </span>
              <span>
                <b>Ferias + Terço de ferias p/ mês:
                  <span class="icon has-text-info"
                    title="Férias são encaradas aqui como um décimo quarto salário, então o valor do salário passa pelo desconto é somado o 1/3 de férias, dividido por 12 e adicionado como um benefício, no caso da sua negociação PJ incluir férias, faça o seguinte, pegue o salário negociado, divida por 12 e some ao salário informado Ex: Negociei férias como no regime CLT e salário de 12k irei informar 12k + (12k + 12k/3)/12 = R$ 13.333,00.">
                    <i class="fas fa-info-circle"></i>
                  </span> </b> {{ (resultCLT as ResultadoCLT).feriasMes?.toLocaleString('pt-BR', {
                style:
                  'currency', currency: 'BRL'
              }) }}
              </span>
              <span>
                <b>VR + VA: </b> {{ (resultCLT as ResultadoCLT).vaVr?.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }) }}
              </span>
              <span>
                <b>Plano de Saúde: </b> {{ (resultCLT as ResultadoCLT).planoSaude?.toLocaleString('pt-BR', {
                style: 'currency', currency:
                  'BRL'
              }) }}
              </span>
              <span>
                <b>PLR p/ mês: </b> {{ (resultCLT as ResultadoCLT).plrMes?.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })
                }}
              </span>
              <span>
                <b>Outros Benefícios: </b> {{ (resultCLT as ResultadoCLT).outros?.toLocaleString('pt-BR', {
                style: 'currency', currency:
                  'BRL'
              }) }}
              </span>
              <span>
                <b>Salário Líquido + Benefícios: </b> {{ (resultCLT as
                ResultadoCLT).salLiqBeneficios?.toLocaleString('pt-BR', {
                  style:
                    'currency', currency: 'BRL'
                }) }}
              </span>
            </span>
          </div>
        </div>
        <div class="column">
          <div class="content" v-if="(resultPJFatorR as ResultadoPJFatorR)?.liquidoPJMes">
            <h3>Salário líquido PJ(c/ Fator R)</h3>
            <p class="is-size-3">
              {{
                (resultPJFatorR as ResultadoPJFatorR).liquidoPJMes?.toLocaleString('pt-BR', {
                  style: 'currency', currency:
                    'BRL'
                }) }}
            </p>
            <span class="is-flex is-flex-direction-column">
              <span>
                <b>Encargo Simples Nacional Mês: </b> {{ ((resultPJFatorR as ResultadoPJFatorR).descontoPJ /
                12)?.toLocaleString('pt-BR', {
                  style:
                    'currency', currency: 'BRL'
                }) }}
              </span>
              <span>
                <b>INSS: </b> {{ (resultPJFatorR as ResultadoPJFatorR).resultCltFatorR?.inss?.toLocaleString('pt-BR', {
                style:
                  'currency', currency: 'BRL'
              }) }}
              </span>
              <span>
                <b>IRRF (Incluso IRRF 13º Salário): </b> {{ (((resultPJFatorR as
                ResultadoPJFatorR).resultCltFatorR?.irrf
                * 13) /
                12)?.toLocaleString('pt-BR', {
                  style:
                    'currency', currency: 'BRL'
                }) }}
              </span>
              <span>
                <b>Contador: </b> {{ (resultPJFatorR as ResultadoPJFatorR).gastoContador?.toLocaleString('pt-BR', {
                style:
                  'currency', currency: 'BRL'
              }) }}
              </span>
            </span>
          </div>
        </div>
        <div class="column">
          <div class="content" v-if="(resultPJ as ResultadoPJ).liquidoPJMes">
            <h3>Salário líquido PJ</h3>
            <p class="is-size-3">
              {{
                (resultPJ as ResultadoPJ).liquidoPJMes?.toLocaleString('pt-BR', {
                  style: 'currency', currency:
                    'BRL'
                }) }}
            </p>
            <span class="is-flex is-flex-direction-column">
              <span>
                <b>Desconto Simples Nacional Mês: </b> {{ ((resultPJ as ResultadoPJ).descontoPJ /
                12)?.toLocaleString('pt-BR', {
                  style:
                    'currency', currency: 'BRL'
                }) }}
              </span>
              <span>
                <b>Contador: </b> {{ ((resultPJ as ResultadoPJ).gastoContador)?.toLocaleString('pt-BR', {
                style:
                  'currency', currency: 'BRL'
              }) }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="is-flex is-justify-content-space-between">
      <p>Encontrou algo errado? abre um issue <a href="https://github.com/MrRafael/CLTxPJ/issues" target="_blank"
          rel="noopener noreferrer">aqui</a>.</p>

      <p>
        Feito por: <a href="https://www.linkedin.com/in/devrafa/" target="_blank" rel="noopener noreferrer"><i
            class="fab fa-linkedin"></i></a>
        &nbsp
        <a href="https://github.com/MrRafael" target="_blank" rel="noopener noreferrer"><i
            class="fab fa-github"></i></a>
      </p>
    </div>

  </div>

</template>

<style scoped>
section {
  margin-bottom: 2rem;
}
</style>
