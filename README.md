<h1 align="center">AnonymizedGPT</h1>
<p align="center">
  An open-source AI chatbot app that anonymizes personal information.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#get-started"><strong>Get started</strong></a> ·
  <a href="#feedback"><strong>Feedback</strong></a>
</p>
<br/>

## Features

Detects and <strong>anonymizes 10 entities</strong> including person names, email adresses and phone numbers

Allows <strong>custom replacements</strong>, i.e. replacing entities that were not automatically detected

Offers <strong>custom allow list</strong>, i.e. allowing certain phrases that would otherwise be automatically replaced

Let's you <strong>preview your anonymization</strong> before actually sending the prompt

## Get started

### Using Docker

1. Copy the [`.env.example`](./chatbot/.env.example) in chatbot driectory, rename it to .env and **add your OpenAI Key**

2. Make sure you have [Docker](https://www.docker.com/products/docker-desktop/) installed and running. Type in the root directory:

```bash
docker-compose up
```

Your chatbot app should now be running on [localhost:3000](http://localhost:3000/).

### Without Docker

1. Copy the [`.env.example`](./chatbot/.env.example) in chatbot directory, rename it to .env and **add your OpenAI Key**

2. Start the chatbot. In the [chatbot directory](./chatbot/) type:

```bash
pnpm install
pnpm dev
```

3. Install dependencies for anonymization service. In the [anonymization_service directory](./anonymization_service) type:

```bash
pip install requirements.txt
```

4. Start the anonymization service. In the [anonymization_service directory](./anonymization_service) type:

```bash 
  fastapi dev
```

Your chatbot app should now be running on [localhost:3000](http://localhost:3000/).

## Feedback

If you want to provide feedback, please open a new discussion or send me an email. 

GitHub: <a href="https://github.com/FreddyHaas/anonymizedGPT/discussions">Discussions</a>

Email: cologneapps@gmail.com

### Final note 

This project was built based on: [Vercel ai chatbot](https://github.com/vercel/ai-chatbot)

