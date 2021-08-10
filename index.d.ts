
export type Param = {
    internalType: string,
    name: string,
    type: string,
}

export type ConstructorType = {
    type: 'constructor',
    inputs: Param[],
    stateMutability: string
}

export type EventType = {
    type: 'event',
    name: string,
    inputs: Param[],
    anonymous: boolean,
}

export type FunctionType = {
    type: 'function',
    name: string,
    inputs: Param[],
    outputs: Param[],
    stateMutability: string
}

export const RFOXCollection: {
    contractName: string,
    abi: (ConstructorType | EventType | FunctionType)[],
    metadata: string,
    bytecode: string,
    deployedBytecode: string,
    linkReferences: any,
    deployedLinkReferences: any,
};
