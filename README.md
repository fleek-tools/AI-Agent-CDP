# AI Agent on Fleek with CDP

This repository demonstrates the usage of Coinbase Developer Platform (CDP) Agentkit and related tools to build autonomous blockchain agents. These agents can interact with on-chain environments, perform blockchain-specific tasks, and respond intelligently to user requests. The project showcases integrations with LangChain, a powerful AI framework, to enable seamless natural language interactions.

[Built with references from this project](https://replit.com/@KevinLeffew1/AgentKitjs-Quickstart-xAI-1?v=1)

## Features
- Blockchain Agent: Interact with on-chain environments using CDP's tools.
- Autonomous Mode: Run the agent autonomously with periodic blockchain interactions.
- Customizable Configuration: Modify LLM (Large Language Model) configurations, network settings, and tools.
- Simulated Blockchain Actions: Demonstrate balance checking, transactions, and other common blockchain tasks.
- Memory Persistence: Store conversation history for continuity across interactions.

## Requirements
- Node.js: >=18.x
- NPM or Yarn: Latest version recommended
- [Fleek Account](https://app.fleek.xyz)
- [CDP Account](https://www.coinbase.com/developer-platform)
- [xAI Account](https://docs.x.ai/docs)
- Environment variables:
  - VITE_XAI_API_KEY
  - VITE_NETWORK_ID
  - VITE_CDP_API_KEY_NAME
  - VITE_CDP_API_KEY_PRIVATE_KEY

## Installation
1. Clone the repository:

```bash
git clone https://github.com/g4titanx/cdp-agent-demo.git
cd cdp-agent-demo
```

2. Install dependencies:

``` bash
npm install
```

3. Create an .env file with the required environment variables:

```bash
touch .env
```
Add the following:

```plaintext
  VITE_XAI_API_KEY = ***
  VITE_NETWORK_ID = ***
  VITE_CDP_API_KEY_NAME = ***
  VITE_CDP_API_KEY_PRIVATE_KEY = ***
```

4. Run the project: 
```bash
npm run dev
```

## Configuration
Modify the following configurations to suit your needs:

### Agentkit Settings:

```javascript
const config = {
  cdpWalletData: "{...}", // Add wallet data here
  networkId: "base-sepolia",
};
```

### Thought Process: 
Adjust the thought variable in runAutonomousMode for custom agent actions:


```javascript
const thought = "Perform creative blockchain actions...";
```


## Contributing
Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: git checkout -b feature-name.
3. Commit your changes: git commit -m "Add feature-name".
4. Push to the branch: git push origin feature-name.
5. Submit a pull request.


Support
For questions or issues, please create a GitHub issue.

Happy Coding! 🚀
