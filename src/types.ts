export interface DescontosCLT {
    salarioBruto: number,
    inss: number,
    irrf: number,
    salarioLiquido: number,
}

export interface ResultadoCLT extends DescontosCLT {
    fgts: number,
    plrMes: number,
    decimoTerceiroMes: number,
    feriasMes: number,
    vaVr: number,
    planoSaude: number,
    outros: number,
    salLiqBeneficios: number,
};

export interface ResultadoPJ {
    salarioBruto: number,
    descontoPJ: number,
    gastoContador: number,
    liquidoPJMes: number,
    aliquota: number
}

export interface ResultadoPJFatorR extends ResultadoPJ {
    resultCltFatorR: ResultadoCLT,
}