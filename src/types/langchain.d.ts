declare module '@langchain/openai' {
  export class ChatOpenAI {
    constructor(config: any);
    invoke(messages: any[]): Promise<any>;
  }
}

declare module '@langchain/core/messages' {
  export class HumanMessage {
    constructor(content: string);
    content: string;
  }
}