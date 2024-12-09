import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";

interface AgentConfig {
  configurable: {
    thread_id: string;
  };
}

interface BlockchainAction {
  action: string;
  address: string;
}

async function initializeAgent() {
  try {
    const apiKey = import.meta.env.VITE_XAI_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_XAI_API_KEY environment variable is not set');
    }

    const llm = new ChatOpenAI({
      model: "grok-beta",
      apiKey,
      configuration: {
        baseURL: "https://api.x.ai/v1"
      },       
    });    

    const config = {
      cdpWalletData: import.meta.env.VITE_CDP_WALLET_DATA || undefined,
      networkId: "base-sepolia",
    };

    const agentkit = await CdpAgentkit.configureWithWallet(config);
    const cdpToolkit = new CdpToolkit(agentkit);
    const tools = cdpToolkit.getTools();

    const agentConfig: AgentConfig = { 
      configurable: { 
        thread_id: "CDP Agentkit Chatbot Example!" 
      } 
    };

    const agent = createReactAgent({
      llm,
      tools,
      stateModifier: `
        You are a helpful agent that can interact onchain using the Coinbase Developer Platform Agentkit.
        You are empowered to interact onchain using your tools.
        If you need funds on base-sepolia, you can request them from the faucet.
        Otherwise, provide wallet details and request funds from the user.
        If a requested action isn't available with current tools, indicate this and direct users to docs.cdp.coinbase.com.
        Be concise and helpful. Only explain tools when explicitly asked.
      `,
    });

    return { agent, config: agentConfig };
  } catch (error) {
    console.error("Failed to initialize agent:", error instanceof Error ? error.message : error);
    throw error;
  }
}

async function runAutonomousMode(
  agent: ReturnType<typeof createReactAgent>, 
  config: AgentConfig, 
  interval = 10
) {
  console.log("Starting autonomous mode...");

  while (true) {
    try {
      const thought = 
        "Be creative and do something interesting on the blockchain. " +
        "Choose an action or set of actions that highlights your abilities.";

      const stream = await agent.stream(
        { messages: [new HumanMessage(thought)] },
        config
      );

      for await (const chunk of stream) {
        if ("agent" in chunk) {
          console.log("Agent:", chunk.agent.messages[0].content);
        } else if ("tools" in chunk) {
          console.log("Tools:", chunk.tools.messages[0].content);
        }
        console.log("-------------------");
      }

      await new Promise(resolve => setTimeout(resolve, interval * 1000));
    } catch (error) {
      console.error("Autonomous mode error:", error instanceof Error ? error.message : error);
      break;
    }
  }
}

export const tryAutonomous = async () => {
  try {
    const { agent, config } = await initializeAgent();
    await runAutonomousMode(agent, config);
  } catch (error) {
    console.error("Failed to run autonomous mode:", error instanceof Error ? error.message : error);
  }
};

const simulateBlockchainAction = async ({ action, address }: BlockchainAction): Promise<string> => {
  const normalizedAction = action.toLowerCase();
  
  if (normalizedAction.includes('balance')) {
    return `Simulated balance check for ${address}`;
  }
  if (normalizedAction.includes('transaction') || normalizedAction.includes('transfer')) {
    return `Simulated transaction from ${address}`;
  }
  return `Simulated blockchain action: ${action} for ${address}`;
};

export async function getAgentResponse(message: string, address: string): Promise<string> {
  try {
    const apiKey = import.meta.env.VITE_XAI_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_XAI_API_KEY environment variable is not set');
    }

    const llm = new ChatOpenAI({
      model: "grok-beta",
      apiKey,
      configuration: {
        baseURL: "https://api.x.ai/v1"
      }
    });

    const response = await llm.invoke([
      new HumanMessage(`
        You are a blockchain interaction specialist with these capabilities:
        - Check wallet balances
        - Help with transactions
        - Provide blockchain information
        - Explain crypto concepts
        
        Connected wallet: ${address}
        User message: ${message}
        
        Please provide a clear explanation of the required blockchain actions.
      `)
    ]);

    const simulatedAction = await simulateBlockchainAction({ 
      action: message, 
      address 
    });

    return `${response.content}\n\nSimulation Result:\n${simulatedAction}`;
  } catch (error) {
    console.error('Agent response error:', error instanceof Error ? error.message : error);
    throw error;
  }
}