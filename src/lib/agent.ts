import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

// Simulate CDP capabilities for the demo
const simulateBlockchainAction = async (action: string, address: string) => {
  // For demo purposes, return structured responses based on common blockchain actions
  if (action.toLowerCase().includes('balance')) {
    return `I can help you check the balance for ${address}. In a full implementation, I would use CDP's tools to fetch the actual balance.`;
  }
  if (action.toLowerCase().includes('transaction') || action.toLowerCase().includes('transfer')) {
    return `I can help you with transactions. With CDP integration, I would be able to help you send transactions from ${address}.`;
  }
  return `I understand you want to ${action}. In the full version with CDP integration, I would be able to perform this action onchain.`;
};

export async function getAgentResponse(message: string, address: string): Promise<string> {
  try {
    const llm = new ChatOpenAI({
      model: "grok-beta",
      apiKey: import.meta.env.VITE_XAI_API_KEY,
      configuration: {
        baseURL: "https://api.x.ai/v1"
      }
    });

    // First, get AI's understanding of the request
    const response = await llm.invoke([
      new HumanMessage(
        `You are an AI assistant specializing in blockchain interactions. You have these capabilities:
        1. Check wallet balances
        2. Help with transactions
        3. Provide blockchain information
        4. Explain crypto concepts
        
        Format your response to clearly indicate any blockchain actions needed.
        
        Connected wallet: ${address}
        User message: ${message}
        
        Respond in a helpful and knowledgeable way, explaining what onchain actions you would take.`
      )
    ]);

    // Then simulate the blockchain action based on the AI's response
    const aiResponse = response.content.toString();
    const simulatedAction = await simulateBlockchainAction(message, address);

    return `${aiResponse}\n\nDemonstration of onchain capability:\n${simulatedAction}`;
  } catch (error) {
    console.error('Agent response error:', error);
    throw error;
  }
}
