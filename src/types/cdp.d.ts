declare module '@coinbase/cdp-agentkit-core' {
  export class CdpAgentkit {
    static configureWithWallet(config: any): Promise<any>;
  }
}

declare module '@coinbase/cdp-langchain' {
  export class CdpToolkit {
    constructor(agentkit: any);
    getTools(): any[];
  }
}