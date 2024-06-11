import { inssAliquota, irrfAliquota, descontoDependente, irrfPLR, anexoTres, anexoCinco } from '@/consts'

const calcDescontoAliquotas = (valor: number, aliquotas: { de: number, ate: number, desconto: number, aDeduzir: number }[]) => {
    const aliquota = aliquotas.find(a => valor >= a.de && valor < a.ate)!;

    return valor * aliquota.desconto - aliquota.aDeduzir;
}

const calcINSS = (salario: number) => {
    const salarioACalcular = Math.min(salario, inssAliquota[inssAliquota.length - 1].ate - 0.01)
    return calcDescontoAliquotas(salarioACalcular, inssAliquota);
}

const calcIRRF = (salario: number, INSS: number, dependentes: number) => {
    const descontoBaseCalc = Math.max((Math.max(dependentes, 0) * descontoDependente) + INSS, irrfAliquota[0].ate * 0.25)
    const baseCalc = Math.max(salario - descontoBaseCalc, 0);
    return calcDescontoAliquotas(baseCalc, irrfAliquota);
}

const calcDescontosCLT = (salario: number, dependentes: number) => {
    const inss = calcINSS(salario);
    const irrf = calcIRRF(salario, inss, dependentes);
    return {
        salarioBruto: salario,
        inss,
        irrf,
        salarioLiquido: salario - inss - irrf
    }
}

export const calcCLT = (salario: number, dependentes: number, vaVr = 0, planoSaude = 0, plr = 0, outros = 0) => {
    const cltDescontos = calcDescontosCLT(salario, dependentes);
    const plrMes = (plr - calcDescontoAliquotas(plr, irrfPLR)) / 12;
    const fgts = cltDescontos.salarioBruto * 0.08;
    const decimoTerceiroMes = cltDescontos.salarioLiquido / 12;
    const feriasMes = ((cltDescontos.salarioBruto / 3) + cltDescontos.salarioLiquido) / 12;

    return {
        ...cltDescontos,
        fgts,
        plrMes,
        decimoTerceiroMes,
        feriasMes,
        vaVr: vaVr,
        planoSaude: planoSaude,
        outros: outros,
        salLiqBeneficios: cltDescontos.salarioLiquido + fgts + plrMes + decimoTerceiroMes + feriasMes + vaVr + planoSaude + outros
    };
}

export const calcPjFatorR = (salario: number, dependentes: number, gastoContador = 0) => {
    const valorParaFolha = salario * 12 * 0.28;
    const folhaAnoParaBrutoMesCoef = 0.0955473098330241;
    const salBrutoCltFatorR = (valorParaFolha / 13) * (1 - folhaAnoParaBrutoMesCoef);
    const resultCltFatorR = calcCLT(salBrutoCltFatorR, dependentes);
    const descontoPJ = calcDescontoAliquotas(salario * 12, anexoTres);
    const descontoCLT = resultCltFatorR.inss * 12 + resultCltFatorR.irrf * 13;

    return {
        resultCltFatorR,
        descontoPJ,
        gastoContador,
        liquidoPJMes: (salario * 12 - descontoPJ - descontoCLT) / 12 - gastoContador
    }
}

export const calcPj = (salario: number, gastoContador = 0) => {
    const descontoPJ = calcDescontoAliquotas(salario * 12, anexoCinco);

    return {
        descontoPJ,
        gastoContador,
        liquidoPJMes: (salario * 12 - descontoPJ) / 12 - gastoContador
    }
}